export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  tags: string[]
  accentColor: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'openclaw-ai-agent-phenomenon',
    title: 'OpenClaw: From Side Project to 145K GitHub Stars — What Developers Should Know',
    description: 'How an Austrian developer\'s lobster-themed AI agent went from hobby project to global phenomenon in weeks, and what it means for the future of open-source AI agents.',
    date: 'February 2026',
    readTime: '12 min read',
    tags: ['AI Agents', 'Open Source', 'DevTools'],
    accentColor: '#f97316',
  },
  {
    slug: 'moltbook-ai-social-network',
    title: 'Moltbook: Inside the Social Network Where 770K AI Agents Post, Vote, and Scheme',
    description: 'A Reddit-style platform exclusively for AI bots raised questions about agent autonomy, prompt injection at scale, and what happens when machines form communities.',
    date: 'February 2026',
    readTime: '14 min read',
    tags: ['AI Agents', 'Security', 'Platforms'],
    accentColor: '#ef4444',
  },
  {
    slug: 'ralph-loop-ai-coding',
    title: 'The Ralph Loop: Why a Bash Loop Is the Most Important AI Coding Technique of 2026',
    description: 'Named after Ralph Wiggum, this deliberately simple technique of running coding agents in a loop against specs is reshaping how software gets built.',
    date: 'February 2026',
    readTime: '10 min read',
    tags: ['AI Coding', 'Automation', 'Workflows'],
    accentColor: '#eab308',
  },
  {
    slug: 'opencode-terminal-coding-agent',
    title: 'OpenCode: The 95K-Star AI Coding Agent Built for the Terminal',
    description: 'With 2.5M monthly developers, 75+ model providers, and zero hype, OpenCode became the quiet workhorse of terminal-based AI-assisted development.',
    date: 'February 2026',
    readTime: '10 min read',
    tags: ['AI Coding', 'Open Source', 'Terminal'],
    accentColor: '#3b82f6',
  },
  {
    slug: 'claude-code-developer-workflow',
    title: 'Claude Code: The Hooks, Skills, and MCP Workflow That Ships Production Software',
    description: 'How Claude Code\'s ecosystem of hooks, skills, MCP servers, and persistent memory turns a terminal agent into a complete development workflow.',
    date: 'February 2026',
    readTime: '12 min read',
    tags: ['Claude Code', 'MCP', 'DevTools'],
    accentColor: '#8b5cf6',
  },
  {
    slug: 'ai-coding-agents-compared-2026',
    title: 'AI Coding Agents Compared: Claude Code vs OpenCode vs OpenClaw in 2026',
    description: 'A practical comparison of every major AI coding agent — model access, ecosystem depth, privacy, and which workflow fits your team.',
    date: 'February 2026',
    readTime: '15 min read',
    tags: ['AI Agents', 'Comparison', 'DevTools'],
    accentColor: '#14b8a6',
  },
  {
    slug: 'mcp-a2a-skills',
    title: 'MCP vs A2A vs Agent Skills: The Complete AI Agent Protocol Stack',
    description: 'The three layers powering modern AI agents — tool access (MCP), agent collaboration (A2A), and knowledge management (Agent Skills). Plus the emerging protocol universe.',
    date: 'February 2026',
    readTime: '25 min read',
    tags: ['MCP', 'A2A', 'Agent Skills'],
    accentColor: '#a78bfa',
  },
  {
    slug: 'mcp-vs-a2a',
    title: 'MCP vs A2A: The Complete Guide to AI Agent Protocols in 2026',
    description: 'The definitive comparison of MCP and A2A — covering MCP Apps, Streamable HTTP, Google ADK integration, and how these protocols work together.',
    date: 'Updated February 2026',
    readTime: '20 min read',
    tags: ['MCP', 'A2A', 'Protocols'],
    accentColor: '#38bdf8',
  },
  {
    slug: 'why-devrel-is-needed',
    title: 'Why DevRel is Needed for Your Company: Building Bridges to Developer Communities',
    description: 'DevRel professionals connect companies and developers by giving technical guidance, support, and resources. Learn why DevRel has become essential.',
    date: 'March 24, 2025',
    readTime: '10 min read',
    tags: ['DevRel', 'Strategy', 'Community'],
    accentColor: '#34d399',
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}
