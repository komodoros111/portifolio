'use client'
import { useEffect, useState } from 'react'

const LINES = [
  { text: 'Initializing system...', delay: 0 },
  { text: 'Loading kernel modules... [OK]', delay: 400 },
  { text: 'Mounting filesystem... [OK]', delay: 800 },
  { text: 'Starting network services... [OK]', delay: 1100 },
  { text: '> Connecting to dev.rchiy.io...', delay: 1500, accent: true },
  { text: 'Resolving DNS... 203.0.113.42', delay: 1900 },
  { text: 'Establishing secure tunnel... [TLS 1.3]', delay: 2200 },
  { text: '████████████████████ 100%', delay: 2600, bar: true },
  { text: '> Authentication required', delay: 3000, accent: true },
  { text: 'User: Rchiy | Access: GRANTED ✓', delay: 3400, success: true },
  { text: '> Loading portfolio...', delay: 3700, accent: true },
  { text: 'Portfolio v2.0 ready. Welcome!', delay: 4100, success: true },
]

export default function HackerIntro({ onDone }) {
  const [visible, setVisible] = useState([])
  const [done, setDone] = useState(false)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    LINES.forEach((line, i) => {
      setTimeout(() => setVisible(v => [...v, i]), line.delay)
    })
    setTimeout(() => setFade(true), 4700)
    setTimeout(() => { setDone(true); onDone?.() }, 5200)
  }, [])

  const skip = () => {
    setFade(true)
    setTimeout(() => { setDone(true); onDone?.() }, 500)
  }

  if (done) return null

  return (
    <div style={{
      position:'fixed', inset:0,
      background:'#04060f',
      zIndex:99999,
      display:'flex', alignItems:'center', justifyContent:'center',
      opacity: fade ? 0 : 1,
      transition:'opacity .5s ease',
      overflow:'hidden',
    }}>
      <MatrixRain />
      <div style={{
        width:'100%', maxWidth:'680px',
        padding:'2rem',
        background:'rgba(4,6,15,0.92)',
        border:'1px solid rgba(0,255,231,0.2)',
        boxShadow:'0 0 40px rgba(0,255,231,0.08)',
        position:'relative', zIndex:2,
        backdropFilter:'blur(10px)',
      }}>
        {/* Terminal bar */}
        <div style={{ display:'flex', alignItems:'center', gap:'.5rem', paddingBottom:'1rem', borderBottom:'1px solid rgba(0,255,231,0.1)', marginBottom:'1.5rem' }}>
          {['#ff5f57','#febc2e','#28c840'].map(c=>(
            <span key={c} style={{ width:12,height:12,borderRadius:'50%',background:c,display:'inline-block' }}/>
          ))}
          <span className="mono" style={{ marginLeft:'.5rem', fontSize:'.75rem', color:'var(--text3)' }}>bash — rchiy@dev:~</span>
        </div>

        <div style={{ minHeight:'280px' }}>
          {LINES.map((line, i) => (
            <div key={i} style={{
              opacity: visible.includes(i) ? 1 : 0,
              transform: visible.includes(i) ? 'none' : 'translateY(4px)',
              transition:'all .3s ease',
              marginBottom:'.35rem',
              display:'flex', alignItems:'center', gap:'.75rem',
            }}>
              {!line.bar && (
                <span className="mono" style={{ color:'var(--text3)', fontSize:'.75rem', flexShrink:0 }}>
                  {String(i+1).padStart(2,'0')}
                </span>
              )}
              <span className="mono" style={{
                fontSize:'.82rem',
                color: line.success ? '#28c840' : line.accent ? 'var(--accent)' : 'var(--text2)',
                letterSpacing:'.03em',
              }}>
                {line.bar ? (
                  <span style={{ background:'linear-gradient(90deg,var(--accent),var(--accent2))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontWeight:700 }}>
                    {line.text}
                  </span>
                ) : line.text}
              </span>
            </div>
          ))}
          {visible.length < LINES.length && (
            <span style={{ display:'inline-block', width:'8px', height:'16px', background:'var(--accent)', animation:'blink 1s infinite', verticalAlign:'middle', marginTop:'.35rem' }}/>
          )}
        </div>

        <button onClick={skip} className="mono" style={{
          position:'absolute', bottom:'1rem', right:'1rem',
          background:'none', border:'1px solid var(--border2)',
          color:'var(--text3)', fontSize:'.7rem', padding:'.3rem .8rem',
          cursor:'none', letterSpacing:'.08em', transition:'all .2s',
        }}
        onMouseEnter={e=>{ e.target.style.color='var(--accent)'; e.target.style.borderColor='var(--accent)' }}
        onMouseLeave={e=>{ e.target.style.color='var(--text3)'; e.target.style.borderColor='var(--border2)' }}>
          [SKIP]
        </button>
      </div>
    </div>
  )
}

// Matrix rain — only rendered client-side via useEffect to avoid hydration mismatch
function MatrixRain() {
  const [cols, setCols] = useState([])

  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ'.split('')
    const count = 20
    setCols(Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i / count) * 100}%`,
      duration: (3 + Math.random() * 4).toFixed(2) + 's',
      delay: (Math.random() * 2).toFixed(2) + 's',
      text: Array.from({ length: 15 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''),
    })))
  }, [])

  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', opacity:0.07 }}>
      {cols.map(col => (
        <div key={col.id} style={{
          position:'absolute',
          left: col.left,
          top: 0,
          fontFamily:'Space Mono,monospace',
          fontSize:'14px',
          color:'var(--accent)',
          lineHeight:1.4,
          animation:`matrixDrop ${col.duration} linear ${col.delay} infinite`,
          whiteSpace:'nowrap',
          writingMode:'vertical-rl',
          letterSpacing:'2px',
        }}>
          {col.text}
        </div>
      ))}
    </div>
  )
}
