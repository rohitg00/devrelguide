import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Your AI Agent\'s Memory Is Probably Broken. Here Is Why.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '60px 80px', fontFamily: 'system-ui, -apple-system, sans-serif', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', padding: '6px 16px', borderRadius: '20px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
            <span style={{ color: '#60a5fa', fontSize: '16px', fontWeight: 600 }}>AI Agents</span>
          </div>
          <div style={{ display: 'flex', padding: '6px 16px', borderRadius: '20px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <span style={{ color: '#60a5fa', fontSize: '16px', fontWeight: 600 }}>Memory</span>
          </div>
          <div style={{ display: 'flex', padding: '6px 16px', borderRadius: '20px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <span style={{ color: '#60a5fa', fontSize: '16px', fontWeight: 600 }}>Fundamentals</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '50px', fontWeight: 700, lineHeight: 1.15, margin: 0, letterSpacing: '-0.02em' }}>Your Agent's Memory</h1>
          <h1 style={{ color: '#f1f5f9', fontSize: '50px', fontWeight: 700, lineHeight: 1.15, margin: '8px 0 0 0', letterSpacing: '-0.02em' }}>Is Probably Broken</h1>
          <p style={{ color: '#94a3b8', fontSize: '24px', fontWeight: 400, margin: '20px 0 0 0', lineHeight: 1.4 }}>Content-addressed IDs, reinforcement-on-write, and forty lines of code.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
          <span style={{ color: '#475569', fontSize: '16px' }}>learndevrel.com</span>
          <span style={{ color: '#475569', fontSize: '16px' }}>May 9, 2026 &middot; 15 min read</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
