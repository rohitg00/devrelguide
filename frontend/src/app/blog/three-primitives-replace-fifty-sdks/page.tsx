'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ThreePrimitivesBlog() {
  return (
    <main className="min-h-screen bg-background">
      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Three Primitives Are Enough: Rebuilding Backends Without Fifty SDKs
          </h1>
          <p className="text-muted-foreground mb-8">By Rohit Ghumare &bull; April 26, 2026 &bull; 14 min read</p>
        </motion.div>

        <motion.div
          className="prose prose-invert max-w-none
            prose-headings:text-foreground prose-p:text-muted-foreground
            prose-a:text-secondary prose-strong:text-foreground
            prose-blockquote:border-secondary prose-blockquote:text-muted-foreground
            prose-th:text-foreground prose-td:text-muted-foreground
            prose-li:text-muted-foreground
            prose-code:text-secondary prose-pre:bg-muted prose-pre:border prose-pre:border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p>
            I have been writing backend services for a decade. I want to talk about the moment I realised most of the SDK surface area I deal with every day is accidental complexity, not the work.
          </p>
          <p>
            Here is the inventory I pulled from a small production service I shipped last quarter. It is not a big system. It does one thing well. Look at the dependency list:
          </p>
          <pre><code>{`bullmq          // queue
node-cron       // schedules
ioredis         // pub/sub + cache
express         // HTTP
prisma          // state
ws              // streams
pino            // logs
@opentelemetry  // traces`}</code></pre>
          <p>
            Eight packages. Eight failure modes. Eight different ways to express &ldquo;run this code when something happens.&rdquo; The HTTP handler enqueues a job. The job worker reads from Postgres, writes to Redis, publishes a pub/sub event, schedules a follow-up via cron, opens a websocket, and emits a span. Every hop is a different vocabulary.
          </p>
          <p>
            Most of that is not the work. The work is one function that processes one event. The rest is plumbing the runtime did not give me.
          </p>
          <p>
            A small but growing camp of engineers is arguing that three primitives are enough to express all of it. I want to walk through the argument, show the code, and then talk about where it breaks.
          </p>

          <h2>The shape of the claim</h2>
          <p>
            The claim is that any backend system can be expressed with three nouns:
          </p>
          <ol>
            <li><strong>Worker.</strong> A long-running process. It is a unit of deployment and resource isolation. It owns a piece of the application.</li>
            <li><strong>Function.</strong> A piece of code inside a worker. It takes a typed input, does work, returns a typed output. The runtime can call it for any reason.</li>
            <li><strong>Trigger.</strong> A reason the runtime calls a function. HTTP request, scheduled time, queue message, file change, database write. The trigger is data; the function does not care where the data came from.</li>
          </ol>
          <p>
            Once you accept that decomposition, the SDK explosion collapses. A queue is a trigger. Cron is a trigger. HTTP is a trigger. Pub/sub is a trigger. A websocket message is a trigger. State changes can be a trigger. They are all <em>reasons to call a function</em>, which is the only thing the application code actually cares about.
          </p>
          <p>
            The runtime owns retries, timeouts, observability, persistence, and fan-out. The application owns the function body. That is the entire deal.
          </p>

          <h2>What the code actually looks like</h2>
          <p>
            I have been writing services in this style for the last three months on a runtime called iii (three i&apos;s — short for &ldquo;interoperable invocation interface&rdquo;). The Rust SDK is the cleanest expression of the idea, so I will use it for the example. The Node and Python SDKs map one-to-one.
          </p>
          <p>
            Here is a complete worker that exposes an HTTP endpoint, runs a cron job, and reacts to a queue message. One file, no extra services:
          </p>
          <pre><code>{`use iii_sdk::{register_worker, InitOptions, RegisterFunction, RegisterTrigger};
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let url = std::env::var("III_URL")
        .unwrap_or_else(|_| "ws://127.0.0.1:49134".to_string());
    let iii = register_worker(&url, InitOptions::default());

    iii.register_function(RegisterFunction::new_async(
        "orders::handle",
        |ctx, input| async move {
            let order_id = input["order_id"].as_str().unwrap();
            ctx.state().update("orders", order_id, json!({
                "status": "received",
                "received_at": ctx.now(),
            })).await?;
            Ok(json!({ "ok": true }))
        },
    ));

    iii.register_trigger(
        RegisterTrigger::http()
            .method("POST")
            .api_path("orders/new")
            .function("orders::handle"),
    );

    iii.register_trigger(
        RegisterTrigger::cron()
            .schedule("*/5 * * * *")
            .function("orders::reconcile"),
    );

    iii.register_trigger(
        RegisterTrigger::queue("dead-letters")
            .function("orders::dlq"),
    );

    tokio::signal::ctrl_c().await?;
    iii.shutdown_async().await;
    Ok(())
}`}</code></pre>
          <p>
            Read the file. Three triggers. One function shown, two more by name. Zero lines about retries, persistence, transport, or observability. The runtime takes those.
          </p>
          <p>
            If you want a queue, you write <code>RegisterTrigger::queue(name)</code>. The runtime persists the messages. If you want cron, you write <code>RegisterTrigger::cron().schedule(expr)</code>. The runtime enforces the schedule across restarts. If you want HTTP, you write <code>RegisterTrigger::http()</code>. The runtime owns the listener.
          </p>
          <p>
            There is no <code>bullmq</code>. There is no <code>node-cron</code>. There is no <code>express</code>. The runtime exposes a single async API and a transport, and the application is shaped around triggers and functions.
          </p>

          <h2>Why this is not just another framework</h2>
          <p>
            I want to be careful here, because the framework graveyard is large.
          </p>
          <p>
            Inngest, Temporal, Restate, Cloudflare Workers, AWS Step Functions, Google Cloud Run jobs, Vercel Functions — all of them gesture at this idea. Many of them implement parts of it well. So why do I keep coming back to the three-primitive framing instead of any of them?
          </p>
          <p>
            Two reasons.
          </p>
          <p>
            <strong>Reason one: the framing is the product.</strong> Most workflow engines treat the workflow as the unit of abstraction — a DAG, a state machine, a saga. The function is hidden inside the workflow. That is fine for batch pipelines. It is bad for the messy reality of an application, where most of the code is not a workflow at all but a single function that handles one event and returns. When the framework forces you to express everything as a workflow, you end up writing one-step workflows everywhere, and the abstraction tax shows up in the call graph and the observability surface.
          </p>
          <p>
            The three-primitive model takes the opposite stance. The function is the unit. Workflows are emergent — you get them by chaining functions through triggers. If you want a saga, you write functions and let the runtime fan them out. The DAG is implicit in the trigger graph, not authored.
          </p>
          <p>
            <strong>Reason two: the runtime is small enough to host yourself.</strong> Temporal needs a Postgres cluster, a history service, a matching service, and a frontend. Cloudflare Workers is a managed platform. Inngest pushes you toward their cloud. The three-primitive runtime I have been working with is a single Rust binary that opens one websocket port. Workers connect over WebSocket and register their functions and triggers. State, queues, and streams are libraries that workers register the same way as anything else.
          </p>
          <p>
            You can run the whole thing on a laptop, in a Docker container, or on a $5 VPS. There is no control plane. There is no &ldquo;platform&rdquo; in the marketing sense. There is a binary, a config file, and your workers.
          </p>

          <h2>What a queue actually is</h2>
          <p>
            Let me make the collapse concrete with one primitive — the queue.
          </p>
          <p>
            In the conventional stack, a queue is a service. It is BullMQ on Redis, or RabbitMQ, or SQS, or Kafka with a consumer group. It has its own SDK, its own failure modes, and its own observability story. The application calls into the SDK to enqueue and to consume.
          </p>
          <p>
            In the three-primitive model, a queue is a worker that registers two functions:
          </p>
          <pre><code>{`queue::push    // append a message to a named queue
queue::pop     // pop a message and route it to a target function`}</code></pre>
          <p>
            That is it. The worker stores messages on disk, exposes a queue trigger type, and handles fan-out. Other workers register triggers like <code>queue::pop("dead-letters")</code> and the runtime calls them when messages arrive. To enqueue, you call <code>iii.trigger(&quot;queue::push&quot;, &#123; queue: &quot;dead-letters&quot;, body &#125;)</code>. No new vocabulary.
          </p>
          <p>
            The same shape works for cron, pub/sub, state, and streams. Each one is a worker. Each one registers a small set of functions. Each one exposes a trigger type. The runtime stitches them together over the same transport that any other worker uses.
          </p>
          <p>
            That uniformity is the win. You do not learn a new SDK to add cron. You add a worker called <code>iii-cron</code>, and now you have a cron trigger. You add a worker called <code>iii-pubsub</code>, and now you have pub/sub. The capability surface of your application is the union of the workers you started, and every worker speaks the same protocol.
          </p>

          <h2>What this actually buys you</h2>
          <p>
            I have been counting concrete wins on a real production service over the last three months. Three stand out.
          </p>
          <p>
            <strong>One transport, one log, one trace.</strong> Every function call goes through the same WebSocket. There is one place to attach an observer. OpenTelemetry traces span across HTTP triggers, queue handlers, cron jobs, and state writes without me writing a single propagation header. When something goes wrong, I read one trace, not seven.
          </p>
          <p>
            <strong>Migration becomes a worker swap.</strong> I started with the in-process state worker. When I needed durability, I swapped it for a Postgres-backed worker. The application code did not change. <code>ctx.state().update(...)</code> is a function call; the implementation lives in a worker; swapping workers swaps storage. The same shape lets me move from a local queue to a Redis-backed one without touching the call sites.
          </p>
          <p>
            <strong>Local development is the same as production.</strong> I run the same binary on my laptop and on the server. There is no &ldquo;local development override&rdquo; or &ldquo;staging emulator.&rdquo; If a test passes locally, it passes in production for the same reasons. This is what I always wanted from serverless and never got, because the serverless platforms make local development a fiction.
          </p>

          <h2>Where it breaks (be honest)</h2>
          <p>
            I would not be doing this honestly if I did not call out the rough edges.
          </p>
          <p>
            <strong>Cold-start workers.</strong> Workers connect over WebSocket. If the runtime restarts, every worker reconnects. In a heavily-loaded system that takes seconds. The runtime needs sticky reconnection logic; right now you write it. This is a real operational tax.
          </p>
          <p>
            <strong>Macro DAGs are still worth authoring.</strong> The three-primitive model says workflows are emergent. That is true for two-or-three-step chains. For a fifteen-step billing pipeline with compensation logic, you still want to author the DAG explicitly. The runtime gives you the function call primitive; you still have to write the orchestrator function. A higher-level workflow library on top is the right answer, and it does not exist yet for this particular runtime.
          </p>
          <p>
            <strong>Ecosystem gravity.</strong> When something is broken in BullMQ, half the internet has hit it before you. When something is broken in a young runtime, you read the source. I have read more Rust source in the last three months than in the prior three years. That is fine for me; it would not be fine for everyone on a team.
          </p>
          <p>
            <strong>The metaphor leaks at the wire.</strong> The runtime hides protocol details well, until you need to integrate with something the runtime does not have a worker for. Then you write the worker. That is the right architecture, but it means the bus stops at the runtime — anything outside has to be marshalled through a custom adapter you maintain.
          </p>

          <h2>How to think about whether this is for you</h2>
          <p>
            Three questions decide it.
          </p>
          <p>
            <strong>Is most of your code a function that handles one event?</strong> If yes, the three-primitive model is going to feel obvious. If your code is mostly orchestration over many systems, you want a workflow engine, not a function runtime.
          </p>
          <p>
            <strong>Are you spending more than a third of your time on integration plumbing?</strong> SDK glue, adapter code, retry logic, observability wiring — if these dominate your hours, the framing collapses that work to zero. If you are mostly writing business logic in one language against one database, the gain is smaller.
          </p>
          <p>
            <strong>Do you control your hosting?</strong> The runtime is a binary. You run it. If you have a platform team that wants serverless functions on a managed control plane, this will feel like going backwards. If you are happy with a long-lived process you operate, this is liberating.
          </p>
          <p>
            For me, the answer to all three is yes, and I have not gone back.
          </p>

          <h2>Try it in five minutes</h2>
          <p>
            If you want to play with the runtime I have been describing, the install is one line:
          </p>
          <pre><code>{`curl -fsSL https://install.iii.dev/iii/main/install.sh | sh`}</code></pre>
          <p>
            Then start the engine, scaffold a worker, and call your first function:
          </p>
          <pre><code>{`# start the engine — workers in config.yaml come up automatically
iii

# in another terminal — write the Rust crate yourself, then
cd hello
cargo run

# in a third terminal — invoke any registered function over the same WebSocket
iii trigger \\
  --function-id='hello::greet' \\
  --payload='{"name":"Rohit"}'`}</code></pre>
          <p>
            The hello worker registers one function and one HTTP trigger. <code>iii trigger</code> calls that function over the same transport an HTTP request would have used. There is no second &ldquo;serve&rdquo; mode.
          </p>

          <h2>Closing</h2>
          <p>
            The argument is not that three primitives are the only way to write a backend. Plenty of systems get built on the SDK-per-need model and ship just fine.
          </p>
          <p>
            The argument is that the SDK explosion is not load-bearing. Most of it is plumbing, and plumbing should be a runtime concern, not an application concern. When you commit to a small primitive set and let the runtime carry the rest, the application code shrinks to roughly what the work actually is. Reading a service becomes reading the function bodies and the trigger registrations. Everything else is gone.
          </p>
          <p>
            I am writing more posts in this series — the next one looks at how I picked an agent sandbox runtime to give my coding agent a place to live, with the same three-primitive framing for context. If you want to follow along, the blog index has the rest.
          </p>
        </motion.div>
      </article>
    </main>
  )
}
