import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'WebMCP: Chrome Just Turned Every Website Into an API for AI Agents'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '60px 80px', fontFamily: 'system-ui, -apple-system, sans-serif', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', padding: '6px 16px', borderRadius: '20px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <span style={{ color: '#86efac', fontSize: '16px', fontWeight: 600 }}>WebMCP</span>
          </div>
          <div style={{ display: 'flex', padding: '6px 16px', borderRadius: '20px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <span style={{ color: '#86efac', fontSize: '16px', fontWeight: 600 }}>Chrome 146</span>
          </div>
          <div style={{ display: 'flex', padding: '6px 16px', borderRadius: '20px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <span style={{ color: '#86efac', fontSize: '16px', fontWeight: 600 }}>AI Agents</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '48px', fontWeight: 700, lineHeight: 1.15, margin: 0, letterSpacing: '-0.02em' }}>WebMCP: Every Website</h1>
          <h1 style={{ color: '#f1f5f9', fontSize: '48px', fontWeight: 700, lineHeight: 1.15, margin: '8px 0 0 0', letterSpacing: '-0.02em' }}>Is Now an AI Agent API</h1>
          <p style={{ color: '#94a3b8', fontSize: '24px', fontWeight: 400, margin: '20px 0 0 0', lineHeight: 1.4 }}>navigator.modelContext changes everything</p>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>89% fewer tokens</span>
            <div style={{ display: 'flex', width: '220px', height: '4px', borderRadius: '2px', background: 'rgba(34,197,94,0.6)', marginTop: '6px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>W3C Standard</span>
            <div style={{ display: 'flex', width: '220px', height: '4px', borderRadius: '2px', background: 'rgba(34,197,94,0.4)', marginTop: '6px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>980 GitHub Stars</span>
            <div style={{ display: 'flex', width: '220px', height: '4px', borderRadius: '2px', background: 'rgba(34,197,94,0.3)', marginTop: '6px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
          <span style={{ color: '#475569', fontSize: '16px' }}>learndevrel.com</span>
          <span style={{ color: '#475569', fontSize: '16px' }}>February 2026 &middot; 18 min read</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
