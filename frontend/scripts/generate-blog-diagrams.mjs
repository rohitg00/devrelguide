import { renderMermaid } from 'beautiful-mermaid'
import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'blog', 'diagrams')

const theme = {
  bg: '#0f172a',
  fg: '#e2e8f0',
  line: '#38bdf8',
  accent: '#7dd3fc',
  muted: '#94a3b8',
  surface: '#1e293b',
  border: '#1e3a5f',
}

const diagrams = [
  {
    name: 'protocol-landscape',
    chart: `graph TD
    A[AI Application Layer]
    A --> M[MCP - Vertical]
    A --> Z[A2A - Horizontal]
    M --> M1[Tools, Resources, Prompts]
    M --> M2[Streamable HTTP / stdio]
    M --> M3[MCP Apps]
    M --> M4[10,000+ servers]
    Z --> Z1[Agent Cards, Tasks]
    Z --> Z2[Google ADK]
    Z --> Z3[SSE streaming]
    Z --> Z4[Zero Trust]

    style A fill:#0369a1,stroke:#38bdf8,color:#e2e8f0
    style M fill:#1e3a5f,stroke:#38bdf8,color:#e2e8f0
    style Z fill:#1e3a5f,stroke:#38bdf8,color:#e2e8f0
    style M1 fill:#1e293b,stroke:#1e3a5f,color:#cbd5e1
    style M2 fill:#1e293b,stroke:#1e3a5f,color:#cbd5e1
    style M3 fill:#1e293b,stroke:#1e3a5f,color:#cbd5e1
    style M4 fill:#1e293b,stroke:#1e3a5f,color:#cbd5e1
    style Z1 fill:#1e293b,stroke:#1e3a5f,color:#cbd5e1
    style Z2 fill:#1e293b,stroke:#1e3a5f,color:#cbd5e1
    style Z3 fill:#1e293b,stroke:#1e3a5f,color:#cbd5e1
    style Z4 fill:#1e293b,stroke:#1e3a5f,color:#cbd5e1`,
  },
  {
    name: 'mcp-architecture',
    chart: `graph LR
    U[User] --> H
    subgraph H[MCP Host]
      C[MCP Client]
      L[LLM / AI Model]
      C <--> L
    end
    C -->|stdio| SA[Server A: Database]
    C -->|Streamable HTTP| SB[Server B: Files]
    C -->|OAuth 2.1| SC[Server C: API Gateway]

    style U fill:#0369a1,stroke:#38bdf8,color:#e2e8f0
    style H fill:#0f172a,stroke:#38bdf8,color:#e2e8f0
    style C fill:#1e3a5f,stroke:#38bdf8,color:#e2e8f0
    style L fill:#1e3a5f,stroke:#7dd3fc,color:#e2e8f0
    style SA fill:#1e293b,stroke:#1e3a5f,color:#cbd5e1
    style SB fill:#1e293b,stroke:#1e3a5f,color:#cbd5e1
    style SC fill:#1e293b,stroke:#1e3a5f,color:#cbd5e1`,
  },
  {
    name: 'mcp-apps-flow',
    chart: `sequenceDiagram
    participant S as MCP Server
    participant H as MCP Host
    participant U as User

    S->>H: Register tools with ui:// refs
    U->>H: Triggers tool
    H->>S: Execute tool
    S->>H: Returns HTML + ui:// URI
    H->>U: Renders in sandboxed iframe
    U->>H: Interacts with UI
    H->>S: JSON-RPC over postMessage
    S->>H: Updated state
    H->>U: UI updates`,
  },
  {
    name: 'transport-evolution',
    chart: `graph TB
    subgraph G1[Gen 1: stdio]
      A1[Client] <-->|stdin/stdout| B1[Server]
    end
    subgraph G2[Gen 2: HTTP+SSE - DEPRECATED]
      A2[Client] -->|HTTP POST| B2[Server]
      B2 -->|SSE| A2
    end
    subgraph G3[Gen 3: Streamable HTTP - Current]
      A3[Client] <-->|Single Endpoint| B3[Server]
    end
    G1 ~~~ G2
    G2 ~~~ G3

    style G1 fill:#0f172a,stroke:#38bdf8,color:#e2e8f0
    style G2 fill:#0f172a,stroke:#94a3b8,color:#94a3b8
    style G3 fill:#0f172a,stroke:#7dd3fc,color:#e2e8f0
    style A1 fill:#1e3a5f,stroke:#38bdf8,color:#e2e8f0
    style B1 fill:#1e3a5f,stroke:#38bdf8,color:#e2e8f0
    style A2 fill:#1e293b,stroke:#94a3b8,color:#94a3b8
    style B2 fill:#1e293b,stroke:#94a3b8,color:#94a3b8
    style A3 fill:#1e3a5f,stroke:#7dd3fc,color:#e2e8f0
    style B3 fill:#1e3a5f,stroke:#7dd3fc,color:#e2e8f0`,
  },
  {
    name: 'a2a-interaction',
    chart: `sequenceDiagram
    participant CA as Client Agent
    participant RA as Remote Agent

    CA->>RA: GET /.well-known/agent.json
    RA-->>CA: Agent Card
    CA->>RA: POST /tasks - Create Task
    RA-->>CA: Task id, status: working
    CA->>RA: GET /tasks/id/stream
    RA-->>CA: SSE updates
    RA-->>CA: status: input-required
    CA->>RA: POST /tasks/id - Provide input
    RA-->>CA: status: completed + artifacts`,
  },
  {
    name: 'adk-architecture',
    chart: `graph TB
    subgraph ADK[Google ADK]
      subgraph Agent[Your Agent]
        subgraph Tools[MCP Tools]
          T1[Database]
          T2[Files]
          T3[APIs]
        end
        subgraph Remote[A2A Remote Agents]
          R1[Research Agent]
          R2[Scheduling Agent]
          R3[Analysis Agent]
        end
        Tools -->|MCP Protocol| P1[Local Resources]
        Remote -->|A2A Protocol| P2[External Agents]
      end
      D[Cloud Run: Zero Trust A2A]
      I[Interactions API: Gemini]
    end

    style ADK fill:#0f172a,stroke:#38bdf8,color:#e2e8f0
    style Agent fill:#0f172a,stroke:#1e3a5f,color:#e2e8f0
    style Tools fill:#1e293b,stroke:#38bdf8,color:#e2e8f0
    style Remote fill:#1e293b,stroke:#7dd3fc,color:#e2e8f0
    style T1 fill:#1e3a5f,stroke:#38bdf8,color:#cbd5e1
    style T2 fill:#1e3a5f,stroke:#38bdf8,color:#cbd5e1
    style T3 fill:#1e3a5f,stroke:#38bdf8,color:#cbd5e1
    style R1 fill:#1e3a5f,stroke:#7dd3fc,color:#cbd5e1
    style R2 fill:#1e3a5f,stroke:#7dd3fc,color:#cbd5e1
    style R3 fill:#1e3a5f,stroke:#7dd3fc,color:#cbd5e1
    style P1 fill:#0f172a,stroke:#38bdf8,color:#94a3b8
    style P2 fill:#0f172a,stroke:#7dd3fc,color:#94a3b8
    style D fill:#0369a1,stroke:#38bdf8,color:#e2e8f0
    style I fill:#0369a1,stroke:#7dd3fc,color:#e2e8f0`,
  },
  {
    name: 'complementary-architecture',
    chart: `graph TB
    subgraph A2A_Layer[A2A: Agent Collaboration]
      O[Orchestrator Agent]
      R[Research Agent]
      AN[Analytics Agent]
      O <-->|A2A| R
      O <-->|A2A| AN
    end

    subgraph MCP_O[Orchestrator Tools]
      OT1[User Data]
      OT2[Task Tracking]
      OT3[Notifications]
    end

    subgraph MCP_R[Research Tools]
      RT1[Web Search]
      RT2[Document DB]
    end

    subgraph MCP_AN[Analytics Tools]
      AT1[Data Warehouse]
      AT2[Viz Tools]
    end

    O -.->|MCP| MCP_O
    R -.->|MCP| MCP_R
    AN -.->|MCP| MCP_AN

    style A2A_Layer fill:#0f172a,stroke:#7dd3fc,color:#e2e8f0
    style O fill:#0369a1,stroke:#38bdf8,color:#e2e8f0
    style R fill:#1e3a5f,stroke:#38bdf8,color:#e2e8f0
    style AN fill:#1e3a5f,stroke:#38bdf8,color:#e2e8f0
    style MCP_O fill:#1e293b,stroke:#38bdf8,color:#cbd5e1
    style MCP_R fill:#1e293b,stroke:#38bdf8,color:#cbd5e1
    style MCP_AN fill:#1e293b,stroke:#38bdf8,color:#cbd5e1
    style OT1 fill:#0f172a,stroke:#1e3a5f,color:#94a3b8
    style OT2 fill:#0f172a,stroke:#1e3a5f,color:#94a3b8
    style OT3 fill:#0f172a,stroke:#1e3a5f,color:#94a3b8
    style RT1 fill:#0f172a,stroke:#1e3a5f,color:#94a3b8
    style RT2 fill:#0f172a,stroke:#1e3a5f,color:#94a3b8
    style AT1 fill:#0f172a,stroke:#1e3a5f,color:#94a3b8
    style AT2 fill:#0f172a,stroke:#1e3a5f,color:#94a3b8`,
  },
  {
    name: 'ecosystem-comparison',
    chart: `graph LR
    subgraph MCP_Eco[MCP Ecosystem]
      M1[10,000+ servers]
      M2[6 official SDKs]
      M3[Claude, ChatGPT, VS Code]
      M4[MCP Apps]
      M5[Streamable HTTP]
      M6[OAuth 2.1 + OIDC]
      M7[Working Groups]
    end
    subgraph A2A_Eco[A2A Ecosystem]
      A1[Google ADK]
      A2[a2a-protocol.org]
      A3[Cloud Run Zero Trust]
      A4[Gemini Deep Research]
      A5[Enterprise partners]
      A6[SSE streaming]
      A7[Agent Cards]
    end
    MCP_Eco <-->|Complementary| A2A_Eco

    style MCP_Eco fill:#0f172a,stroke:#38bdf8,color:#e2e8f0
    style A2A_Eco fill:#0f172a,stroke:#7dd3fc,color:#e2e8f0
    style M1 fill:#1e293b,stroke:#38bdf8,color:#cbd5e1
    style M2 fill:#1e293b,stroke:#38bdf8,color:#cbd5e1
    style M3 fill:#1e293b,stroke:#38bdf8,color:#cbd5e1
    style M4 fill:#1e293b,stroke:#38bdf8,color:#cbd5e1
    style M5 fill:#1e293b,stroke:#38bdf8,color:#cbd5e1
    style M6 fill:#1e293b,stroke:#38bdf8,color:#cbd5e1
    style M7 fill:#1e293b,stroke:#38bdf8,color:#cbd5e1
    style A1 fill:#1e293b,stroke:#7dd3fc,color:#cbd5e1
    style A2 fill:#1e293b,stroke:#7dd3fc,color:#cbd5e1
    style A3 fill:#1e293b,stroke:#7dd3fc,color:#cbd5e1
    style A4 fill:#1e293b,stroke:#7dd3fc,color:#cbd5e1
    style A5 fill:#1e293b,stroke:#7dd3fc,color:#cbd5e1
    style A6 fill:#1e293b,stroke:#7dd3fc,color:#cbd5e1
    style A7 fill:#1e293b,stroke:#7dd3fc,color:#cbd5e1`,
  },
]

await mkdir(outDir, { recursive: true })

for (const { name, chart } of diagrams) {
  try {
    const svg = await renderMermaid(chart, theme)
    await writeFile(join(outDir, `${name}.svg`), svg)
    console.log(`  ok ${name}.svg`)
  } catch (err) {
    console.error(`  FAIL ${name}: ${err.message}`)
  }
}

console.log('\nDone!')
