'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SandboxRuntimesBlog() {
  return (
    <main className="min-h-screen bg-background">
      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            I Ran Six Agent Sandbox Runtimes Back to Back. Here Is What Actually Worked.
          </h1>
          <p className="text-muted-foreground mb-8">By Rohit Ghumare &bull; May 3, 2026 &bull; 16 min read</p>
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
            For the last two weeks I have been running the same agent workload across six sandbox runtimes. The agent is a Claude Code session that gets a fresh checkout of a small Rust repo, runs the test suite, fixes a planted bug, and commits the patch. Boring. Reproducible. Easy to time.
          </p>
          <p>
            I picked six runtimes that came up repeatedly when people asked me &ldquo;where do I let my coding agent run unattended.&rdquo;
          </p>
          <ol>
            <li>E2B</li>
            <li>Daytona</li>
            <li>Modal Sandboxes</li>
            <li>Morph (formerly Morph Labs / Morph Cloud)</li>
            <li>Vercel Sandbox</li>
            <li>Docker Sandboxes (the new <code>sbx</code> CLI)</li>
          </ol>
          <p>
            This post is what I learned. It is not a benchmark in the academic sense — I did not run a thousand iterations or measure cold-start variance to four decimal places. It is the writeup an engineer wants when they are picking one and have a Friday afternoon to decide.
          </p>

          <h2>Why agents need sandboxes at all</h2>
          <p>
            If you have not used a coding agent in &ldquo;dangerously skip permissions&rdquo; mode yet, the elevator pitch is this: turning off the per-tool approval prompt is a step-change improvement in agent productivity, and it is also the step that lets the agent <code>rm -rf</code> your home directory if a single prompt-injection attack lands.
          </p>
          <p>
            The fix is not to put the prompts back. The fix is to put the agent somewhere it cannot hurt anything important. The sandbox is a small isolated machine — usually a microVM or a gVisor-shielded container — that has access to your project tree and nothing else. The agent is free inside it. Outside it, your machine is untouched.
          </p>
          <p>
            That is the entire pitch. The runtimes differ on three axes that matter:
          </p>
          <ul>
            <li><strong>Isolation model.</strong> Hardware (microVM with its own kernel) versus software (gVisor or container). Hardware is stronger; software is faster and lighter.</li>
            <li><strong>Persistence.</strong> Ephemeral (the sandbox dies after the session) versus stateful (you can stop and resume, files survive, packages stay installed).</li>
            <li><strong>Locality.</strong> Local on your laptop versus remote in someone else&apos;s cloud.</li>
          </ul>
          <p>
            Pick a position on each axis and you have basically picked your runtime. Let me walk through the six.
          </p>

          <h2>E2B</h2>
          <p>
            E2B is the obvious starting point. It has the largest community, the most language SDKs, and the most existing &ldquo;put your code interpreter in a microVM&rdquo; recipes online. Each sandbox is a Firecracker microVM. Cold start in my measurements averaged 180 ms — close to the 150-200 ms range E2B advertises.
          </p>
          <p>
            What I liked: the SDK is the cleanest of any in the list. Three lines and you have a sandboxed Python or TypeScript runtime with a file system and a command runner.
          </p>
          <pre><code>{`import { Sandbox } from "e2b"

const sbx = await Sandbox.create()
await sbx.files.write("/tmp/script.py", "print('hi')")
const out = await sbx.commands.run("python /tmp/script.py")
console.log(out.stdout)`}</code></pre>
          <p>
            What bit me: 24-hour session ceiling. For a long-lived coding agent that stays attached to a project for a week, that is the wrong shape. You can chain sandboxes, but the state on disk does not survive a session boundary unless you carry it yourself.
          </p>
          <p>
            <strong>Use it for:</strong> Stateless code execution, code interpreters, untrusted-input services. Anything where the workload is &ldquo;run this code once, give me the output.&rdquo;
          </p>

          <h2>Daytona</h2>
          <p>
            Daytona is the persistence-first option. They pivoted from dev-environments-as-a-service to AI agent infrastructure in early 2025, and the difference shows. Sandboxes are long-lived workspaces. If your agent installs a Python package or writes a config file, that change is still there next time.
          </p>
          <p>
            Cold-start was the fastest in my run — under 100 ms most of the time. The trade is that the isolation is container-based, not microVM. They share a kernel with the host. For most coding agent workloads I do not care about the kernel boundary, but if you are running customer-supplied code from random users, this is the part to think about.
          </p>
          <pre><code>{`import { Daytona } from "@daytonaio/sdk"

const dt = new Daytona()
const ws = await dt.workspace.create({ template: "python" })
await ws.fs.write("/workspace/script.py", "print('hi')")
const out = await ws.process.exec("python /workspace/script.py")`}</code></pre>
          <p>
            The killer feature for me was Computer Use support. Daytona spins up a Linux desktop you can drive over VNC. If your agent ever needs to use a browser or interact with a GUI app, this is the only one of the six that gives you that out of the box. I ended up using it for a different project entirely once I had the SDK on hand.
          </p>
          <p>
            <strong>Use it for:</strong> Long-lived coding agent sessions, anything that needs a persistent workspace, anything that needs Computer Use.
          </p>

          <h2>Modal Sandboxes</h2>
          <p>
            Modal is not really a sandbox-first product. Modal is an everything platform — inference, training, batch jobs, notebooks — and Sandboxes are one of the things it can do. The isolation is gVisor, which is software-level (a user-space kernel that intercepts syscalls). Weaker than Firecracker on paper, but Modal has been running it at very high concurrency for years.
          </p>
          <p>
            What I liked: GPU sandboxes. None of the other five runtimes give you A100 or H100 in a sandbox. If your agent needs to run an inference workload as part of a coding task, this is the only path.
          </p>
          <pre><code>{`import modal

app = modal.App("agent-sandbox")

@app.function(gpu="A100")
def run_in_sandbox(cmd: str):
    sb = modal.Sandbox.create("ubuntu:22.04", app=app)
    p = sb.exec("bash", "-c", cmd)
    return p.stdout.read()`}</code></pre>
          <p>
            What bit me: Python-first by design. I could not find a clean Node-only path that did not feel grafted on. Also no BYOC. If you have a corporate policy that says &ldquo;customer data does not leave our VPC,&rdquo; Modal is out unless you change the policy.
          </p>
          <p>
            <strong>Use it for:</strong> ML-adjacent agent work, anything needing GPU, large batch sandboxing.
          </p>

          <h2>Morph</h2>
          <p>
            Morph is the snapshot-and-rollback story. The pitch is that you can checkpoint a sandbox in 300 ms and roll back to that exact disk and memory state later. For an agent that is iterating on a flaky bug, this is genuinely magical — you put it in the &ldquo;before&rdquo; state, let it try, watch it fail, roll back, try a different prompt.
          </p>
          <p>
            Each sandbox is a Firecracker microVM. The storage layer is copy-on-write on NVMe, which is how the snapshots get cheap. Morph charges by written blocks, not allocated blocks, so a sandbox that does little writing is genuinely free-tier-compatible.
          </p>
          <p>
            What I liked: the snapshot API is the cleanest expression of the &ldquo;agent as a process you can rewind&rdquo; idea. I have not seen this work elsewhere with the same UX.
          </p>
          <pre><code>{`const sb = await morph.create({ image: "ubuntu-22.04" })
const checkpoint = await sb.snapshot()
await sb.exec("rm -rf /etc")     // do something risky
await sb.restore(checkpoint)     // undo`}</code></pre>
          <p>
            What bit me: the docs are still light, the SDK shape moves between minor versions, and I had a few sessions where snapshot restore took noticeably longer than the advertised 300 ms (closer to a second). Early product, real ideas.
          </p>
          <p>
            <strong>Use it for:</strong> Iteration-heavy agent loops where rollback is part of the algorithm.
          </p>

          <h2>Vercel Sandbox</h2>
          <p>
            Vercel Sandbox is a Firecracker microVM service tightly bound to the Vercel platform. The session ceiling is 45 minutes — short, and it is short on purpose. The pitch is &ldquo;you have an AI feature in your Vercel app and you need to run a bit of generated code somewhere.&rdquo;
          </p>
          <p>
            What I liked: per-active-CPU billing. Most sandbox time on a coding agent is the agent thinking, not the CPU computing. Vercel only charges you for the latter, which makes a 5-cent invocation actually cost a tenth of a cent. The free tier was generous enough that I never paid during my test.
          </p>
          <pre><code>{`import { Sandbox } from "@vercel/sandbox"

const sb = await Sandbox.create({ runtime: "node22" })
await sb.writeFiles([{ path: "index.js", content: "console.log('hi')" }])
const out = await sb.runCommand({ cmd: "node", args: ["index.js"] })`}</code></pre>
          <p>
            What bit me: the 45-minute ceiling is hard. If your agent task is going to take an hour, you need to design for handoff. There is no GPU, no BYOC, and outside the Vercel platform the value proposition narrows a lot.
          </p>
          <p>
            <strong>Use it for:</strong> Apps already on Vercel, short-lived per-request sandboxing, untrusted code execution from end-user input.
          </p>

          <h2>Docker Sandboxes (sbx)</h2>
          <p>
            <code>sbx</code> is the newcomer and the one that surprised me. Docker shipped it in March 2026 as a standalone CLI, no Docker Desktop required. Each sandbox is a microVM running on the local hypervisor — Apple Hypervisor on macOS, Hyper-V on Windows. Linux support is on the roadmap.
          </p>
          <p>
            The killer feature is locality. The sandbox runs on your laptop. There is no remote API, no per-second billing, no rate limit. If you have ever burned an afternoon on cold-start latency or sandbox quota, you know how good that feels.
          </p>
          <pre><code>{`# install
brew install docker/tap/sbx

# log in
sbx login

# run claude code in a sandbox bound to the current directory
cd ~/code/my-rust-repo
sbx run claude`}</code></pre>
          <p>
            That last command is the whole experience. Claude Code starts inside a microVM, sees only the current directory, runs in <code>--dangerously-skip-permissions</code> mode by default, and cannot reach the rest of your filesystem. Network is policy-gated; you choose between <em>open</em>, <em>balanced</em>, and <em>locked down</em> on first login.
          </p>
          <p>
            What I liked: it integrates with the agents people actually use. Out of the box: Claude Code, Codex, GitHub Copilot CLI, Gemini CLI, Kiro, OpenCode. The branch mode (<code>--branch</code>) creates a git worktree under <code>.sbx/</code> so the agent commits to its own branch, not your working tree.
          </p>
          <p>
            What bit me: still experimental. The balanced network policy is missing common documentation domains, so a real coding session ends up needing &ldquo;open&rdquo; mode unless you maintain your own allow-list. macOS performance was great; Windows under Hyper-V was visibly slower for IO-heavy operations like a fresh <code>cargo build</code>.
          </p>
          <p>
            <strong>Use it for:</strong> Local-first coding agent workflows. The right default unless you specifically need remote.
          </p>

          <h2>Side-by-side</h2>
          <p>
            Same workload, same agent, same Rust repo. Numbers are medians from ten runs each.
          </p>
          <table>
            <thead>
              <tr>
                <th>Runtime</th>
                <th>Isolation</th>
                <th>Cold start</th>
                <th>Session cap</th>
                <th>Persistence</th>
                <th>Local-first</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>E2B</td><td>Firecracker</td><td>~180 ms</td><td>24 h</td><td>No</td><td>No</td></tr>
              <tr><td>Daytona</td><td>Container</td><td>~95 ms</td><td>Unlimited</td><td>Yes</td><td>No</td></tr>
              <tr><td>Modal</td><td>gVisor</td><td>~600 ms</td><td>Unlimited</td><td>Snapshots</td><td>No</td></tr>
              <tr><td>Morph</td><td>Firecracker</td><td>~300 ms</td><td>Unlimited</td><td>Snapshots</td><td>No</td></tr>
              <tr><td>Vercel</td><td>Firecracker</td><td>~250 ms</td><td>45 min</td><td>No</td><td>No</td></tr>
              <tr><td>Docker sbx</td><td>microVM (local)</td><td>~1.2 s first / instant warm</td><td>Until you stop it</td><td>Yes</td><td>Yes</td></tr>
            </tbody>
          </table>
          <p>
            The cold-start number for sbx is misleading on first read. It is the slowest because the microVM provisions the first time you run a sandbox. After that, subsequent commands inside the sandbox run at native speed because there is no network round trip. The remote runtimes have a network hop on every operation that the local one does not.
          </p>

          <h2>How I actually pick</h2>
          <p>
            After two weeks of this, my decision tree is small.
          </p>
          <p>
            <strong>If the agent runs on my laptop, sbx wins.</strong> Local microVM, no quota, integrates with the agents I already use, free. The first-time cold start is irrelevant once the image is cached.
          </p>
          <p>
            <strong>If the agent runs in our infra and we need persistent sessions, Daytona wins.</strong> Long-lived workspaces, fast cold start, Computer Use if I ever need a browser inside a sandbox. The container isolation is acceptable for our trust model.
          </p>
          <p>
            <strong>If the agent runs ephemerally as part of a request handler, Vercel Sandbox wins.</strong> Per-active-CPU billing, microVM, generous free tier, integrated with the platform we already deploy on.
          </p>
          <p>
            <strong>If the agent is iterating with rollback as part of the algorithm, Morph wins.</strong> Nothing else has snapshot-and-restore as a first-class operation.
          </p>
          <p>
            <strong>If the agent needs GPU, Modal wins.</strong> By default, by elimination. None of the others do GPU.
          </p>
          <p>
            <strong>E2B</strong> is fine, but I have not found the workload it is the right answer to that one of the others does not also serve. It is the most polished SDK, and that matters if SDK ergonomics dominate your decision.
          </p>

          <h2>One thing nobody talks about</h2>
          <p>
            Every one of these runtimes does the &ldquo;agent runs in a box&rdquo; story well. None of them solves the second boundary that matters: the boundary between what the agent wrote and what reaches your main branch.
          </p>
          <p>
            The microVM keeps the agent from <code>rm -rf</code>-ing your machine. It does not keep the agent from writing a subtly broken patch and pushing it to <code>main</code>. The same property that makes a YOLO agent fast — autonomous action, no human in the loop — means the output is unsupervised by definition. If that output reaches a shared branch without a human eye on it, the sandbox boundary did not save you, because the harm escaped through the legitimate output channel.
          </p>
          <p>
            Every runtime I tested has some answer to this. <code>sbx</code> has <code>--branch</code>. Daytona has explicit workspace-to-branch mapping. The remote runtimes generally hand you a tarball and let you handle the git layer yourself. You should treat that handoff as the security boundary. The microVM is a precondition; the branch boundary is the actual control.
          </p>

          <h2>Where I landed</h2>
          <p>
            I run two sandboxes for two different jobs.
          </p>
          <p>
            For local agent work, I use <code>sbx</code>. The latency is best, the integration with Claude Code is one command, and the cost is zero. The first day I switched, I noticed I was running the agent more aggressively because I knew the worst case was a wrecked sandbox, not a wrecked machine.
          </p>
          <p>
            For our deployed agent that processes real customer requests, I use Vercel Sandbox. Per-active-CPU billing was the deciding factor — sandbox time on a coding agent is mostly waiting on the model, and I do not want to pay for that.
          </p>
          <p>
            I will probably revisit this in three months. The space is moving fast — Zeroboot is claiming sub-millisecond cold starts via copy-on-write Firecracker forks, and Docker is adding Linux support to <code>sbx</code> later this year. If the comparisons change materially, I will write the followup.
          </p>
        </motion.div>
      </article>
    </main>
  )
}
