import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'OpenCode: 95K Stars, 2.5M Monthly Developers'
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
            <span style={{ color: '#93c5fd', fontSize: '16px', fontWeight: 600 }}>AI Coding</span>
          </div>
          <div style={{ display: 'flex', padding: '6px 16px', borderRadius: '20px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <span style={{ color: '#93c5fd', fontSize: '16px', fontWeight: 600 }}>Open Source</span>
          </div>
          <div style={{ display: 'flex', padding: '6px 16px', borderRadius: '20px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <span style={{ color: '#93c5fd', fontSize: '16px', fontWeight: 600 }}>Terminal</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '52px', fontWeight: 700, lineHeight: 1.15, margin: 0, letterSpacing: '-0.02em' }}>OpenCode Terminal Agent</h1>
          <p style={{ color: '#94a3b8', fontSize: '26px', fontWeight: 400, margin: '20px 0 0 0', lineHeight: 1.4 }}>95K Stars. 2.5M Monthly Developers.</p>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>75+ Providers</span>
            <div style={{ display: 'flex', width: '260px', height: '4px', borderRadius: '2px', background: 'rgba(59,130,246,0.6)', marginTop: '6px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>LSP Enabled</span>
            <div style={{ display: 'flex', width: '260px', height: '4px', borderRadius: '2px', background: 'rgba(59,130,246,0.4)', marginTop: '6px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Privacy First</span>
            <div style={{ display: 'flex', width: '260px', height: '4px', borderRadius: '2px', background: 'rgba(59,130,246,0.3)', marginTop: '6px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
          <span style={{ color: '#475569', fontSize: '16px' }}>learndevrel.com</span>
          <span style={{ color: '#475569', fontSize: '16px' }}>February 2026 · 10 min read</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
