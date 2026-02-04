'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ClaudeCodeDeveloperWorkflow() {
  return (
    <main className="min-h-screen bg-background">
      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Claude Code: The Hooks, Skills, and MCP Workflow That Ships Production Software
          </h1>
          <p className="text-muted-foreground mb-8">By DevRel Guide &bull; February 2026 &bull; 12 min read</p>
        </motion.div>

        <motion.div
          className="prose prose-invert max-w-none
            prose-headings:text-foreground prose-p:text-muted-foreground
            prose-a:text-secondary prose-strong:text-foreground
            prose-blockquote:border-secondary prose-blockquote:text-muted-foreground
            prose-th:text-foreground prose-td:text-muted-foreground
            prose-li:text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <blockquote>
            <p>&ldquo;80% of my code is written by AI, 20% is spent reviewing and correcting it.&rdquo; &mdash; Andrej Karpathy</p>
          </blockquote>

          <h2>Beyond a Terminal Agent</h2>
          <p>
            Claude Code is Anthropic&apos;s CLI tool that turns Claude into a coding agent operating directly in the terminal. It reads codebases, understands file relationships, runs commands, edits files, executes tests, and creates commits.
          </p>
          <p>
            That&apos;s the baseline &mdash; every coding agent does some version of this now. What separates Claude Code from alternatives is the ecosystem built on top of it: hooks for automation, skills for specialized knowledge, MCP servers for external integrations, and a persistent memory system that maintains context across sessions.
          </p>

          <h2>The Four Layers</h2>

          <h3>1. Hooks &mdash; The Automation Layer</h3>
          <p>
            Claude Code supports 8 hook types that execute shell commands in response to events during a coding session:
          </p>
          <table>
            <thead>
              <tr><th>Hook Type</th><th>Trigger</th><th>Use Case</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>PreToolUse</strong></td><td>Before any tool call</td><td>Security policies, block dangerous commands</td></tr>
              <tr><td><strong>PostToolUse</strong></td><td>After a tool call completes</td><td>Quality checks on generated code, lint on save</td></tr>
              <tr><td><strong>Stop</strong></td><td>When agent completes a task</td><td>Final validation, test suite execution</td></tr>
              <tr><td><strong>SessionStart</strong></td><td>New session begins</td><td>Load project context, check environment</td></tr>
              <tr><td><strong>SessionEnd</strong></td><td>Session terminates</td><td>Capture learnings, update memory files</td></tr>
              <tr><td><strong>UserPromptSubmit</strong></td><td>User sends a message</td><td>Input validation, context injection</td></tr>
              <tr><td><strong>PreCompact</strong></td><td>Before context compression</td><td>Preserve critical information</td></tr>
              <tr><td><strong>Notification</strong></td><td>Agent needs human attention</td><td>Slack alerts, desktop notifications</td></tr>
            </tbody>
          </table>
          <p>
            Hooks are shell commands, which means any script or binary can serve as a hook. A PostToolUse hook that runs <code>eslint --fix</code> on every modified file. A SessionEnd hook that appends key decisions to CLAUDE.md. A PreToolUse hook that blocks <code>rm -rf</code> commands.
          </p>

          <h3>2. Skills &mdash; The Capability Layer</h3>
          <p>
            Skills are prompt files that give Claude specialized knowledge for specific tasks. They are invoked with slash commands:
          </p>
          <ul>
            <li><code>/commit</code> &mdash; Creates well-structured commits with proper messages</li>
            <li><code>/review</code> &mdash; Runs a code review against staged changes</li>
            <li><code>/plan</code> &mdash; Creates an implementation plan before touching code</li>
            <li><code>/tdd</code> &mdash; Enforces test-driven development workflow</li>
            <li><code>/security-review</code> &mdash; Checks for OWASP vulnerabilities</li>
          </ul>
          <p>
            Skills are markdown files with instructions, making them easy to write and share. A growing marketplace offers hundreds of skills for specific frameworks (Django, Spring Boot, React), methodologies (TDD, security review), and workflows (PR creation, documentation updates).
          </p>

          <h3>3. MCP Servers &mdash; The Integration Layer</h3>
          <p>
            Model Context Protocol (MCP) connects Claude Code to external services, extending its reach beyond the local file system:
          </p>
          <table>
            <thead>
              <tr><th>MCP Server</th><th>Capability</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Supabase MCP</strong></td><td>Query databases, apply migrations, execute SQL, manage edge functions</td></tr>
              <tr><td><strong>GitHub MCP</strong></td><td>Create PRs, manage issues, review code, search repositories</td></tr>
              <tr><td><strong>Firecrawl MCP</strong></td><td>Scrape web pages, search the web, extract structured data</td></tr>
              <tr><td><strong>Context7 MCP</strong></td><td>Look up library documentation and code examples in real-time</td></tr>
            </tbody>
          </table>
          <p>
            When a coding agent can query the production database, read GitHub issues, scrape documentation, and deploy edge functions from the same terminal session, the development workflow fundamentally changes. Context switching between tools decreases. The agent operates with the same information the developer would normally gather manually.
          </p>

          <h3>4. CLAUDE.md &mdash; The Memory Layer</h3>
          <p>
            CLAUDE.md is a markdown file at the project root that Claude reads at the start of every session. It contains:
          </p>
          <ul>
            <li>Active project context and architecture decisions</li>
            <li>Coding standards and conventions</li>
            <li>Known issues and workarounds</li>
            <li>Deployment procedures and environment details</li>
            <li>Learnings from previous sessions</li>
          </ul>
          <p>
            Boris Cherny, the Claude Code creator, recommends splitting memory into modular files for larger projects: AGENTS.md for sub-agent configurations, LEARNED.md for patterns discovered during sessions, SOUL.md for project-specific personality and behavior.
          </p>
          <p>
            This approach creates compounding returns. Each session builds on the context of previous sessions. Over weeks of use, the CLAUDE.md file becomes a living document that represents the accumulated knowledge of the project.
          </p>

          <h2>The Production Workflow</h2>
          <p>
            Combining these four layers produces a development workflow that goes beyond interactive coding assistance:
          </p>
          <ol>
            <li><strong>Session Start:</strong> Claude reads CLAUDE.md and understands project context. SessionStart hook verifies the environment is ready.</li>
            <li><strong>Planning:</strong> <code>/plan</code> skill creates an implementation plan. Developer reviews and approves before code is written.</li>
            <li><strong>Implementation:</strong> Claude writes code in focused blocks. PostToolUse hooks enforce linting and formatting on every edit.</li>
            <li><strong>Testing:</strong> Tests run automatically. Failures are addressed in the same session without human intervention.</li>
            <li><strong>Review:</strong> <code>/review</code> skill analyzes changes before committing. Security review flags potential vulnerabilities.</li>
            <li><strong>Commit:</strong> <code>/commit</code> creates a structured commit with proper message and changelog entry.</li>
            <li><strong>Learning:</strong> SessionEnd hook captures key decisions and patterns back to CLAUDE.md for future sessions.</li>
          </ol>

          <h2>Ralph Integration</h2>
          <p>
            The Ralph technique works naturally with Claude Code&apos;s ecosystem. Write specifications in PROMPT.md, and the loop leverages all configured hooks, skills, and MCP connections on each iteration:
          </p>
          <pre><code>while :; do cat PROMPT.md | claude-code ; done</code></pre>
          <p>
            Each loop iteration benefits from PostToolUse hooks running quality checks, MCP servers providing live data, and CLAUDE.md maintaining context. This creates a more capable autonomous loop than running the agent without the ecosystem.
          </p>

          <h2>Tradeoffs</h2>
          <ul>
            <li><strong>Vendor lock-in:</strong> Claude Code only works with Anthropic&apos;s models. If Claude&apos;s API is slow or expensive, there&apos;s no fallback to another provider.</li>
            <li><strong>Configuration investment:</strong> Setting up hooks, skills, MCP servers, and memory files requires upfront effort. The ecosystem compounds over time but has a learning curve.</li>
            <li><strong>Cost:</strong> Anthropic&apos;s API pricing for Claude Opus 4.5 is higher than alternatives. Extended coding sessions can generate significant token costs.</li>
            <li><strong>Rate limits:</strong> API rate limiting during peak hours can interrupt workflows. The Max subscription plan ($100&ndash;$200/month) provides more consistent access.</li>
          </ul>

          <h2>What This Means for Developer Tooling</h2>
          <p>
            Claude Code represents a shift from &ldquo;AI coding assistant&rdquo; to &ldquo;AI development workflow.&rdquo; The individual components &mdash; hooks, skills, MCP, memory &mdash; are not unique concepts. Build systems have had hooks for decades. IDE plugins have provided specialized knowledge. API integrations are standard.
          </p>
          <p>
            What&apos;s new is composing these layers around a capable language model that can operate them autonomously. The model isn&apos;t just generating code &mdash; it&apos;s navigating a development environment with the same tools and context a human developer would use.
          </p>
          <p>
            For DevRel teams: developers are increasingly evaluating coding tools not by model quality alone, but by the workflow they enable. Documentation, onboarding, and education need to address the full system, not just the AI interaction.
          </p>
          <blockquote>
            <p>Stop comparing models. Start comparing workflows. The model is replaceable; the system around it is what compounds.</p>
          </blockquote>
        </motion.div>
      </article>
    </main>
  )
}
