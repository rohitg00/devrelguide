import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'I Ran Six Agent Sandbox Runtimes Back to Back'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1e293b 50%, #0a0a0a 100%)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '60px 80px', fontFamily: 'system-ui, -apple-system, sans-serif', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', padding: '6px 16px', borderRadius: '20px', background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.3)' }}>
            <span style={{ color: '#FF6B35', fontSize: '16px', fontWeight: 600 }}>AI Agents</span>
          </div>
          <div style={{ display: 'flex', padding: '6px 16px', borderRadius: '20px', background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)' }}>
            <span style={{ color: '#FF6B35', fontSize: '16px', fontWeight: 600 }}>Sandboxes</span>
          </div>
          <div style={{ display: 'flex', padding: '6px 16px', borderRadius: '20px', background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)' }}>
            <span style={{ color: '#FF6B35', fontSize: '16px', fontWeight: 600 }}>microVM</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '50px', fontWeight: 700, lineHeight: 1.15, margin: 0, letterSpacing: '-0.02em' }}>Six Agent Sandbox Runtimes,</h1>
          <h1 style={{ color: '#f1f5f9', fontSize: '50px', fontWeight: 700, lineHeight: 1.15, margin: '8px 0 0 0', letterSpacing: '-0.02em' }}>Tested Back to Back</h1>
          <p style={{ color: '#94a3b8', fontSize: '24px', fontWeight: 400, margin: '20px 0 0 0', lineHeight: 1.4 }}>E2B &middot; Daytona &middot; Modal &middot; Morph &middot; Vercel &middot; Docker sbx</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
          <span style={{ color: '#475569', fontSize: '16px' }}>learndevrel.com</span>
          <span style={{ color: '#475569', fontSize: '16px' }}>May 3, 2026 &middot; 16 min read</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
