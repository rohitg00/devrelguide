'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

function TweetEmbed({ username, name, tweetId, text, likes, impressions, date }: { username: string; name: string; tweetId: string; text: string; likes: string; impressions: string; date: string }) {
  return (
    <a href={`https://x.com/${username}/status/${tweetId}`} target="_blank" rel="noopener noreferrer" className="block no-underline">
      <div className="border border-border rounded-xl p-5 my-6 bg-card hover:border-secondary transition-colors">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-sm">{name.charAt(0)}</div>
          <div>
            <p className="text-foreground font-semibold text-sm !my-0">{name}</p>
            <p className="text-muted-foreground text-xs !my-0">@{username} &bull; {date}</p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed !my-0">{text}</p>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <span>{likes} likes</span>
          <span>{impressions} views</span>
        </div>
      </div>
    </a>
  )
}

export default function WebMCPBlog() {
  return (
    <main className="min-h-screen bg-background">
      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            WebMCP: Chrome Just Turned Every Website Into an API for AI Agents
          </h1>
          <p className="text-muted-foreground mb-8">By Rohit Ghumare &bull; February 14, 2026 &bull; 18 min read</p>
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
            Two days ago, Google&apos;s Chrome team shipped something that will fundamentally change how AI agents interact with the web.
          </p>
          <p>
            It&apos;s called <strong>WebMCP</strong>. And within 48 hours of the announcement, it hit 980 stars on GitHub, got 1.2 million impressions on a single tweet, and had developers across five different frameworks building demos.
          </p>
          <p>
            Here&apos;s what actually happened, what it means, and why you should care.
          </p>

          <h2>The Problem WebMCP Solves</h2>
          <p>
            Right now, when an AI agent needs to interact with a website, it does one of two things:
          </p>
          <ol>
            <li><strong>Screenshots and clicks.</strong> The agent takes a screenshot, uses vision to figure out what&apos;s on screen, then simulates mouse clicks and keyboard input. This is what tools like Playwright-based agents do. It works, but it&apos;s slow, expensive (thousands of tokens per screenshot), and breaks constantly when UI changes.</li>
            <li><strong>Backend MCP servers.</strong> The website builds a separate server that exposes its functionality through the Model Context Protocol. This is reliable, but requires the website to build and maintain a whole separate API surface just for AI agents.</li>
          </ol>
          <p>
            WebMCP introduces a third option: <strong>the website itself tells agents what it can do.</strong>
          </p>
          <p>
            Instead of agents guessing what buttons do by looking at pixels, websites register structured tools directly in the browser. The agent sees a list of available actions, each with a name, description, and typed input schema. It calls the function. The website runs it. Done.
          </p>
          <p>
            No screenshots. No DOM scraping. No separate server. The existing frontend JavaScript becomes the agent interface.
          </p>

          <h2>How It Works</h2>
          <p>
            WebMCP adds a new API to the browser: <code>navigator.modelContext</code>. Websites register tools through it, and AI agents discover and call those tools through the browser.
          </p>
          <p>
            There are two ways to register tools.
          </p>

          <h3>The JavaScript Way (Imperative API)</h3>
          <p>
            This gives you full control. You write a function, describe it with a JSON Schema, and register it:
          </p>
          <pre><code>{`if ('modelContext' in navigator) {
  navigator.modelContext.registerTool({
    name: 'add_to_cart',
    description: 'Add a product to the shopping cart',
    inputSchema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'The product ID to add'
        },
        quantity: {
          type: 'number',
          description: 'How many to add'
        }
      },
      required: ['productId', 'quantity']
    },
    async execute({ productId, quantity }) {
      const result = await addToCart(productId, quantity);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result)
        }]
      };
    }
  });
}`}</code></pre>
          <p>
            That&apos;s it. An AI agent can now add items to the cart on your site without seeing the UI. It calls <code>add_to_cart</code> with the right parameters, your existing <code>addToCart()</code> function runs, and the agent gets back structured data.
          </p>

          <h3>The HTML Way (Declarative API)</h3>
          <p>
            For simple form-based actions, you don&apos;t even need JavaScript. Add a few attributes to an existing <code>&lt;form&gt;</code>:
          </p>
          <pre><code>{`<form toolname="search_flights"
      tooldescription="Search for available flights"
      action="/api/search">
  <input name="origin"
         toolparamdescription="Departure airport code (e.g. SFO)" />
  <input name="destination"
         toolparamdescription="Arrival airport code (e.g. JFK)" />
  <input name="date" type="date"
         toolparamdescription="Travel date in YYYY-MM-DD" />
  <button type="submit">Search</button>
</form>`}</code></pre>
          <p>
            The browser reads these attributes and automatically exposes the form as an agent-callable tool. The agent fills in the fields and submits. From the server&apos;s perspective, it looks identical to a human submission.
          </p>
          <p>
            There&apos;s even a CSS pseudo-class <code>:tool-form-active</code> so you can style the form differently when an agent is using it, and a <code>SubmitEvent.agentInvoked</code> boolean so your server knows whether a human or agent submitted.
          </p>

          <h2>The Numbers</h2>
          <p>
            Early benchmarks from the Chrome team and MCP-B project show real improvements:
          </p>
          <table>
            <thead>
              <tr><th>Metric</th><th>Screenshot-Based</th><th>WebMCP</th><th>Improvement</th></tr>
            </thead>
            <tbody>
              <tr><td>Tokens per action (simple)</td><td>3,801</td><td>433</td><td><strong>89% fewer tokens</strong></td></tr>
              <tr><td>Tokens per action (complex)</td><td>~8,000+</td><td>~1,800</td><td><strong>77% fewer tokens</strong></td></tr>
              <tr><td>Computational overhead</td><td>Baseline</td><td>-67%</td><td><strong>67% reduction</strong></td></tr>
              <tr><td>Task accuracy</td><td>Variable</td><td>~98%</td><td>Structured calls vs. pixel guessing</td></tr>
            </tbody>
          </table>
          <p>
            The token reduction is the big one. A simple counter task that costs 3,801 tokens with screenshots costs 433 tokens with WebMCP. That&apos;s not a marginal improvement. That&apos;s the difference between &ldquo;AI agents browsing the web is economically viable&rdquo; and &ldquo;it&apos;s not.&rdquo;
          </p>

          <h2>Who Built It</h2>
          <p>
            WebMCP was co-developed by engineers at Google and Microsoft working together through the <a href="https://www.w3.org/community/webmachinelearning/" target="_blank" rel="noopener noreferrer">W3C Web Machine Learning Community Group</a>:
          </p>
          <ul>
            <li><strong>Brandon Walderman</strong> (Microsoft) &mdash; Spec editor</li>
            <li><strong>Khushal Sagar</strong> (Google) &mdash; Spec editor</li>
            <li><strong>Dominic Farolino</strong> (Google) &mdash; Spec editor</li>
          </ul>
          <p>
            The fact that Google and Microsoft are collaborating on this matters. When both major browser vendors co-author a spec, adoption tends to follow. The spec was published as a <a href="https://webmachinelearning.github.io/webmcp/" target="_blank" rel="noopener noreferrer">W3C Community Group Draft</a> on February 10, 2026. It&apos;s not a finalized standard yet, but it&apos;s in Chrome 146 Canary right now behind a flag.
          </p>

          <h2>How to Try It Today</h2>
          <ol>
            <li>Download <a href="https://www.google.com/chrome/canary/" target="_blank" rel="noopener noreferrer">Chrome Canary</a> (version 146+)</li>
            <li>Go to <code>chrome://flags/#enable-webmcp-testing</code></li>
            <li>Enable the &ldquo;WebMCP for testing&rdquo; flag</li>
            <li>Relaunch Chrome</li>
          </ol>
          <p>
            Chrome 146 stable is expected around <strong>March 10, 2026</strong>. For now, the flag is the only way in.
          </p>

          <h2>What the Developer Community Built in 48 Hours</h2>
          <p>
            The speed of adoption was genuinely surprising. Here&apos;s what showed up within two days of the announcement:
          </p>

          <h3>MCP-B &mdash; The Browser Bridge</h3>
          <p>
            <a href="https://github.com/WebMCP-org" target="_blank" rel="noopener noreferrer">Alex Nahas</a>, formerly at Amazon, built MCP-B (&ldquo;B&rdquo; for browser) before the W3C spec even existed. It started as an internal solution at Amazon where backend MCP servers couldn&apos;t access authenticated web apps because they lacked session cookies.
          </p>
          <p>
            MCP-B is a Chrome extension that collects WebMCP tools from all your open tabs and bridges them to desktop MCP clients like Claude Desktop or Cursor. It also includes built-in AI agents that help you <em>create</em> WebMCP tools without leaving the browser.
          </p>
          <p>
            The project now provides the <code>@mcp-b/global</code> polyfill that adds <code>navigator.modelContext</code> to browsers that don&apos;t have native support yet, plus a forked Chrome DevTools MCP server that exposes <code>list_webmcp_tools</code> and <code>call_webmcp_tool</code> functions.
          </p>

          <h3>Five Framework Examples</h3>
          <p>
            The <a href="https://github.com/WebMCP-org/examples" target="_blank" rel="noopener noreferrer">WebMCP-org/examples</a> repo shipped production-ready demos across five frameworks:
          </p>
          <table>
            <thead>
              <tr><th>Framework</th><th>Demo App</th><th>Key Pattern</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Vanilla TS</strong></td><td>Shopping cart</td><td><code>navigator.modelContext.registerTool()</code></td></tr>
              <tr><td><strong>React</strong></td><td>Task manager</td><td><code>useWebMCP()</code> hook + Zod validation</td></tr>
              <tr><td><strong>Rails 7</strong></td><td>Bookmarks manager</td><td>Stimulus controller integration</td></tr>
              <tr><td><strong>Angular 19</strong></td><td>Note-taking app</td><td>Angular signals + services</td></tr>
              <tr><td><strong>Phoenix LiveView</strong></td><td>Counter + item list</td><td>Elixir server-side state sync</td></tr>
            </tbody>
          </table>
          <p>
            Community members added Vue and Nuxt 3 implementations within hours.
          </p>

          <h3>DoorDash-Style Food Ordering Demo</h3>
          <p>
            <a href="https://x.com/skirano" target="_blank" rel="noopener noreferrer">Suhail Kakar</a> built a starter template for a DoorDash-like food ordering app where an AI agent adds items to cart, configures options, and navigates checkout &mdash; all through WebMCP tool calls, never touching the UI.
          </p>
          <TweetEmbed
            username="skirano"
            name="Suhail Kakar"
            tweetId="2022387763421810989"
            text="WebMCP is the future of the web. Agents can now interact with any website without ever seeing the UI. I built a starter template to show how: A DoorDash like app where the agent adds items to cart..."
            likes="551"
            impressions="39.1K"
            date="Feb 14, 2026"
          />

          <h3>TODO App with Agent Control</h3>
          <p>
            Japanese developer <a href="https://x.com/azukiazusa9" target="_blank" rel="noopener noreferrer">@azukiazusa9</a> built a clean TODO app demo showing <code>navigator.modelContext.provideContext</code> registering add, delete, and list tools. Their video shows an AI agent creating and managing TODO items through structured tool calls.
          </p>
          <TweetEmbed
            username="azukiazusa9"
            name="azukiazusa9"
            tweetId="2021417919419502669"
            text="WebMCP completely understood. Register tools with window.navigator.modelContext.provideContext and the AI agent executes JavaScript callbacks to add TODO items."
            likes="145"
            impressions="13.3K"
            date="Feb 12, 2026"
          />

          <h3>Travel Booking Reference App</h3>
          <p>
            The Chrome team shipped a live travel booking demo at <code>travel-demo.bandarra.me</code> that demonstrates both APIs &mdash; declarative HTML forms for flight search and imperative JavaScript for complex itinerary building. This serves as the official reference implementation.
          </p>

          <h3>Chrome DevTools Quickstart</h3>
          <p>
            The <a href="https://github.com/WebMCP-org/chrome-devtools-quickstart" target="_blank" rel="noopener noreferrer">DevTools quickstart</a> shows a development loop where AI writes WebMCP tools, Vite hot-reloads, the AI tests its own tools, and iterates. Three included examples (<code>get_page_title</code>, <code>get_counter</code>, <code>set_counter</code>) demonstrate the pattern.
          </p>

          <h2>What People Are Saying</h2>
          <p>
            The response from the developer community was immediate and largely enthusiastic. Here are some of the takes that stood out:
          </p>

          <TweetEmbed
            username="firt"
            name="Maximiliano Firtman"
            tweetId="2020903127428313461"
            text="Chrome 146 includes an early preview of WebMCP, accessible via a flag, that lets AI agents query and execute services without browsing the web app like a user. Services can be declared through an imperative navigator.modelContext API or declaratively through a form."
            likes="2,700"
            impressions="1.2M"
            date="Feb 11, 2026"
          />

          <TweetEmbed
            username="wesbos"
            name="Wes Bos"
            tweetId="2021236635334050112"
            text="Taking the new WebMCP spec proposal for a rip. Immediately see two benefits: this is WAY faster than a bot screenshotting and clicking buttons. Adapting existing apps will be much easier..."
            likes="757"
            impressions="75.5K"
            date="Feb 12, 2026"
          />

          <TweetEmbed
            username="_philschmid"
            name="Philipp Schmid"
            tweetId="2021289121570775333"
            text="MCP Servers Are Coming to the Web. MCP lets AI agents call tools on backends. WebMCP brings the same idea to the frontend, letting developers expose their website's functionality as structured tools using plain JavaScript (or even HTML), no separate server needed."
            likes="385"
            impressions="55.9K"
            date="Feb 12, 2026"
          />

          <TweetEmbed
            username="steren"
            name="Steren Giannini"
            tweetId="2021832820679962642"
            text="WebMCP sits in a very interesting spot: It's not a spec for HTTP APIs, like MCP servers are. It's a way to help browsers with agentic capabilities use webapps more reliably (instead of asking them to screenshot and click)."
            likes="196"
            impressions="12.5K"
            date="Feb 13, 2026"
          />

          <TweetEmbed
            username="glenngabe"
            name="Glenn Gabe"
            tweetId="2021582770326159477"
            text='This is a big deal. Agents can bypass the UI via WebMCP. Chrome Team announces WebMCP is available for early preview: "As the agentic web evolves, we want to help websites play an active role in how AI agents interact with them."'
            likes="47"
            impressions="3.8K"
            date="Feb 13, 2026"
          />

          <p>
            <a href="https://x.com/midudev" target="_blank" rel="noopener noreferrer">Miguel Angel Duran</a> (1,700 likes): &ldquo;The web will change forever with WebMCP! An open standard so AI agents don&apos;t &lsquo;click&rsquo; but talk directly to your web. No DOM scraping. No fragile automations. Structured tools.&rdquo;
          </p>
          <p>
            On LinkedIn, SEO expert Dan Petrovic at DEJAN AI called WebMCP &ldquo;the biggest shift in technical SEO since structured data&rdquo; and coined the term <strong>&ldquo;Agentic CRO&rdquo;</strong> for optimizing how AI agents interact with websites &mdash; a discipline that didn&apos;t exist a week ago.
          </p>

          <h2>WebMCP vs. Backend MCP &mdash; When to Use Which</h2>
          <p>
            WebMCP doesn&apos;t replace backend MCP servers. They solve different problems:
          </p>
          <table>
            <thead>
              <tr><th></th><th>WebMCP (Frontend)</th><th>MCP Server (Backend)</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Where it runs</strong></td><td>In the browser tab</td><td>On your server</td></tr>
              <tr><td><strong>User present?</strong></td><td>Yes &mdash; shared context</td><td>No &mdash; agent acts alone</td></tr>
              <tr><td><strong>Authentication</strong></td><td>Inherits session cookies</td><td>OAuth / API keys</td></tr>
              <tr><td><strong>Use case</strong></td><td>Collaborative workflows</td><td>Automated pipelines</td></tr>
              <tr><td><strong>Setup effort</strong></td><td>Add JS to existing pages</td><td>Build and deploy a server</td></tr>
              <tr><td><strong>Headless?</strong></td><td>No &mdash; needs a browser</td><td>Yes</td></tr>
            </tbody>
          </table>
          <p>
            The key distinction is the user. WebMCP is for <strong>cooperative workflows</strong> where a human is watching and the agent operates within their session. Backend MCP is for <strong>autonomous pipelines</strong> where the agent operates independently.
          </p>
          <p>
            A travel site might use WebMCP so an agent can search flights while the user watches and approves. That same site might use a backend MCP server so an agent can check prices overnight and send a notification when a fare drops.
          </p>

          <h2>Security Model</h2>
          <p>
            WebMCP&apos;s security approach is worth examining because it&apos;s different from traditional APIs:
          </p>
          <ul>
            <li><strong>HTTPS required.</strong> WebMCP only works in secure contexts (localhost exempted for development).</li>
            <li><strong>Callback-based control.</strong> The website decides what tools to expose and what they do. An agent can only call functions the site explicitly registers.</li>
            <li><strong>User confirmation.</strong> Tools can request user approval before executing through <code>ModelContextClient.requestUserInteraction()</code>.</li>
            <li><strong>Origin-scoped.</strong> Tools are scoped to the page origin. One site can&apos;t access another site&apos;s tools.</li>
            <li><strong>Advisory hints.</strong> Tools can declare <code>readOnlyHint</code> and <code>destructiveHint</code> flags so agents know which actions are safe and which aren&apos;t.</li>
          </ul>
          <p>
            The spec is honest about open questions. Prompt injection is still a risk &mdash; if an agent reads untrusted content from one tool and passes it to another, malicious instructions could execute. The <a href="https://bug0.com/blog/webmcp-chrome-146-guide" target="_blank" rel="noopener noreferrer">Bug0 analysis</a> calls out the &ldquo;lethal trifecta&rdquo; of agents that can read private data, parse untrusted content, and take actions. WebMCP narrows the attack surface by limiting agents to explicitly exposed functions rather than arbitrary DOM access, but it doesn&apos;t eliminate the risk entirely.
          </p>

          <h2>The Broader Ecosystem</h2>
          <p>
            WebMCP doesn&apos;t exist in isolation. It&apos;s part of a growing stack:
          </p>
          <ul>
            <li><strong>MCP</strong> (Anthropic) &mdash; The backend protocol. Agents call tools on servers. This is the original standard that WebMCP extends to the browser.</li>
            <li><strong>WebMCP</strong> (W3C) &mdash; The frontend protocol. Websites expose tools in the browser. What we&apos;ve been discussing.</li>
            <li><strong>MCP-B</strong> (WebMCP-org) &mdash; The bridge. Chrome extension that connects browser-side WebMCP tools to desktop MCP clients. Adds inter-site tool cooperation.</li>
            <li><strong>MCP Apps</strong> (Anthropic) &mdash; Interactive UI extensions for MCP servers. Where WebMCP turns websites into tools for agents, MCP Apps turn agent tools into UIs for humans.</li>
          </ul>
          <p>
            Together, these create a loop: websites expose tools to agents (WebMCP), agents expose UIs to users (MCP Apps), and everything connects through the same protocol layer (MCP).
          </p>

          <h2>What This Means for Different Roles</h2>

          <h3>Frontend Developers</h3>
          <p>
            WebMCP is a net new interface surface. Your sites will need to declare what they can do, not just render UI. The good news: it&apos;s JavaScript you already know. The <code>registerTool()</code> API is straightforward. The bad news: now you need to think about tool discoverability, schema design, and how agents will interpret your descriptions. &ldquo;Add to cart&rdquo; means something different to a language model than to a human scanning a button.
          </p>

          <h3>SEO and Growth Teams</h3>
          <p>
            Dan Petrovic&apos;s &ldquo;Agentic CRO&rdquo; framing is not an overreaction. When AI agents can call structured tools on websites, the agents that deliver the best results will send users to sites with the best tool implementations. Tool descriptions become the new meta descriptions. Schema design becomes the new structured data. This is a real competitive surface.
          </p>

          <h3>DevRel Teams</h3>
          <p>
            If your platform has a web interface, WebMCP is a new integration point you&apos;ll need to document. Developers will ask &ldquo;how do I expose my app&apos;s features to AI agents?&rdquo; and the answer should include WebMCP alongside your REST/GraphQL APIs. Writing good tool descriptions &mdash; clear, unambiguous, with well-typed schemas &mdash; is a documentation challenge that falls squarely in DevRel territory.
          </p>

          <h3>Product Teams</h3>
          <p>
            WebMCP changes the question from &ldquo;how does a human use our product?&rdquo; to &ldquo;how does a human <em>and</em> an agent use our product together?&rdquo; The declarative API makes it cheap to experiment. Add <code>toolname</code> and <code>tooldescription</code> to your existing forms and see what agents do with them. No backend changes needed.
          </p>

          <h2>Limitations and Open Questions</h2>
          <p>
            The spec itself flags several unresolved areas:
          </p>
          <ul>
            <li><strong>Tool discovery at scale.</strong> If every website exposes 50 tools (the recommended max per page), how do agents efficiently discover relevant tools across the web?</li>
            <li><strong>Multi-agent conflicts.</strong> What happens when two agents try to use the same website&apos;s tools simultaneously?</li>
            <li><strong>Headless scenarios.</strong> WebMCP requires a browser. Server-side rendering and headless environments don&apos;t have <code>navigator.modelContext</code>.</li>
            <li><strong>No native support yet.</strong> Only Chrome 146 Canary behind a flag. Firefox and Safari haven&apos;t announced support. The <code>@mcp-b/global</code> polyfill fills the gap for now.</li>
            <li><strong>Spec instability.</strong> Multiple TODO placeholders in the spec. The API surface will change before standardization.</li>
          </ul>

          <h2>Getting Started</h2>
          <p>
            The fastest path from zero to a working WebMCP integration:
          </p>

          <h3>Option 1: Native API (Chrome 146 Canary)</h3>
          <pre><code>{`// Enable chrome://flags/#enable-webmcp-testing first

navigator.modelContext.registerTool({
  name: 'get_product',
  description: 'Get product details by ID',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Product ID' }
    },
    required: ['id']
  },
  async execute({ id }) {
    const product = await fetch(\`/api/products/\${id}\`).then(r => r.json());
    return {
      content: [{ type: 'text', text: JSON.stringify(product) }]
    };
  }
});`}</code></pre>

          <h3>Option 2: MCP-B Polyfill (Any Browser)</h3>
          <pre><code>{`npm install @mcp-b/global

// In your app's entry point:
import '@mcp-b/global';

// Now navigator.modelContext is available
navigator.modelContext.registerTool({ /* same API */ });`}</code></pre>

          <h3>Option 3: React Hook</h3>
          <pre><code>{`import { useWebMCP } from '@mcp-b/react-webmcp';
import { z } from 'zod';

function TodoApp() {
  const [todos, setTodos] = useState([]);

  useWebMCP('add_todo', {
    description: 'Add a new todo item',
    schema: z.object({
      title: z.string().describe('The todo title'),
      priority: z.enum(['low', 'medium', 'high'])
    }),
    handler: async ({ title, priority }) => {
      const newTodo = { id: Date.now(), title, priority, done: false };
      setTodos(prev => [...prev, newTodo]);
      return { content: [{ type: 'text', text: \`Added: \${title}\` }] };
    }
  });

  return <div>{/* your UI */}</div>;
}`}</code></pre>

          <h3>Option 4: Zero-Build HTML</h3>
          <pre><code>{`<form toolname="subscribe"
      tooldescription="Subscribe a user to the newsletter"
      action="/api/subscribe"
      method="POST">
  <input name="email" type="email"
         toolparamdescription="User email address" required />
  <button type="submit">Subscribe</button>
</form>`}</code></pre>

          <h2>Timeline</h2>
          <table>
            <thead>
              <tr><th>Date</th><th>Milestone</th></tr>
            </thead>
            <tbody>
              <tr><td>Feb 10, 2026</td><td>W3C Community Group Draft published</td></tr>
              <tr><td>Feb 11, 2026</td><td>Chrome team announces early preview</td></tr>
              <tr><td>Feb 12, 2026</td><td>Available in Chrome 146 Canary behind flag</td></tr>
              <tr><td>~Mar 10, 2026</td><td>Chrome 146 stable (expected)</td></tr>
              <tr><td>Mid-2026</td><td>Broader browser support expected (unconfirmed)</td></tr>
            </tbody>
          </table>

          <h2>Where to Go From Here</h2>
          <ul>
            <li><a href="https://webmachinelearning.github.io/webmcp/" target="_blank" rel="noopener noreferrer">W3C WebMCP Specification</a></li>
            <li><a href="https://github.com/webmachinelearning/webmcp" target="_blank" rel="noopener noreferrer">WebMCP GitHub (spec repo)</a></li>
            <li><a href="https://developer.chrome.com/blog/webmcp-epp" target="_blank" rel="noopener noreferrer">Chrome Developer Blog announcement</a></li>
            <li><a href="https://github.com/WebMCP-org/examples" target="_blank" rel="noopener noreferrer">MCP-B Examples (5 frameworks)</a></li>
            <li><a href="https://github.com/WebMCP-org/chrome-devtools-quickstart" target="_blank" rel="noopener noreferrer">Chrome DevTools Quickstart</a></li>
            <li><a href="https://docs.mcp-b.ai/" target="_blank" rel="noopener noreferrer">MCP-B Documentation</a></li>
            <li><a href="https://www.arcade.dev/blog/web-mcp-alex-nahas-interview" target="_blank" rel="noopener noreferrer">Alex Nahas Interview (MCP-B origin story)</a></li>
          </ul>

          <blockquote>
            <p>WebMCP doesn&apos;t replace the web. It gives the web a way to participate in the agentic era on its own terms &mdash; by telling agents what it can do, instead of hoping they figure it out.</p>
          </blockquote>
        </motion.div>
      </article>
    </main>
  )
}
