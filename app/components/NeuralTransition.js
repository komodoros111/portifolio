'use client'
import { useEffect, useRef, useState } from 'react'

export default function NeuralTransition({ onDone }) {
  const canvasRef = useRef(null)
  const [phase, setPhase] = useState('neural') // neural → beam → fade
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const W = canvas.width = window.innerWidth
    const H = canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')

    // Build a large neural network
    const NODE_COUNT = 80
    const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 3 + 1.5,
      pulse: Math.random() * Math.PI * 2,
      alpha: 0,
      layer: Math.floor(Math.random() * 4),
    }))

    const COLORS = [
      [0, 229, 255],
      [155, 114, 255],
      [255, 107, 157],
      [255, 209, 102],
    ]

    let startTime = Date.now()
    let animId
    let beamProgress = 0
    let beamActive = false
    let beamStartTime = 0

    // Phase timer: neural for 2.5s, then beam
    const beamTimer = setTimeout(() => {
      beamActive = true
      beamStartTime = Date.now()
    }, 2500)

    // Total done after 4.2s
    const doneTimer = setTimeout(() => {
      setPhase('fade')
      setTimeout(() => onDone?.(), 600)
    }, 4200)

    function draw() {
      ctx.clearRect(0, 0, W, H)
      const now = Date.now()
      const elapsed = (now - startTime) * 0.001
      const t = elapsed

      // dark background
      ctx.fillStyle = '#04060f'
      ctx.fillRect(0, 0, W, H)

      // fade in nodes
      nodes.forEach(n => {
        n.alpha = Math.min(n.alpha + 0.012, 1)
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
        n.pulse += 0.02
      })

      // connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            const strength = (1 - dist / 160)
            const alpha = Math.min(a.alpha, b.alpha) * strength * 0.3
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(0,229,255,${alpha})`
            ctx.lineWidth = strength * 0.8
            ctx.stroke()

            // signal pulse
            if (strength > 0.6) {
              const prog = (t * 0.8 + i * 0.3 + j * 0.17) % 1
              const px = a.x + (b.x - a.x) * prog
              const py = a.y + (b.y - a.y) * prog
              ctx.beginPath()
              ctx.arc(px, py, 1.8, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(0,229,255,${alpha * 3})`
              ctx.fill()
            }
          }
        }
      }

      // nodes
      nodes.forEach(n => {
        const c = COLORS[n.layer]
        const pulse = 0.6 + 0.4 * Math.sin(n.pulse)

        // glow
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 9)
        g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${0.12 * pulse * n.alpha})`)
        g.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 9, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${n.alpha})`
        ctx.fill()
      })

      // ── BEAM OF LIGHT ──
      if (beamActive) {
        const beamElapsed = (now - beamStartTime) * 0.001
        beamProgress = Math.min(beamElapsed / 1.2, 1)

        // beam comes from center-top and expands outward
        const cx = W / 2
        const cy = H / 2

        // main white beam — vertical sweep
        const beamWidth = beamProgress * W * 1.4
        const beamGrad = ctx.createLinearGradient(cx - beamWidth / 2, 0, cx + beamWidth / 2, 0)
        beamGrad.addColorStop(0, 'transparent')
        beamGrad.addColorStop(0.35, `rgba(0,229,255,${0.04 * beamProgress})`)
        beamGrad.addColorStop(0.5, `rgba(255,255,255,${0.18 * Math.sin(beamProgress * Math.PI)})`)
        beamGrad.addColorStop(0.65, `rgba(0,229,255,${0.04 * beamProgress})`)
        beamGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = beamGrad
        ctx.fillRect(0, 0, W, H)

        // sharp center line
        const lineGrad = ctx.createLinearGradient(0, 0, 0, H)
        lineGrad.addColorStop(0, 'transparent')
        lineGrad.addColorStop(0.3, `rgba(255,255,255,${0.8 * Math.sin(beamProgress * Math.PI)})`)
        lineGrad.addColorStop(0.7, `rgba(0,229,255,${0.8 * Math.sin(beamProgress * Math.PI)})`)
        lineGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = lineGrad
        ctx.fillRect(cx - 1, 0, 2, H)

        // radial burst from center
        const burst = ctx.createRadialGradient(cx, cy, 0, cx, cy, beamProgress * Math.max(W, H) * 0.8)
        burst.addColorStop(0, `rgba(255,255,255,${0.25 * Math.sin(beamProgress * Math.PI)})`)
        burst.addColorStop(0.3, `rgba(0,229,255,${0.08 * Math.sin(beamProgress * Math.PI)})`)
        burst.addColorStop(1, 'transparent')
        ctx.fillStyle = burst
        ctx.fillRect(0, 0, W, H)

        // ring expanding outward
        ctx.beginPath()
        ctx.arc(cx, cy, beamProgress * Math.max(W, H), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,229,255,${0.4 * (1 - beamProgress)})`
        ctx.lineWidth = 2
        ctx.stroke()

        // second ring, slightly delayed
        if (beamProgress > 0.15) {
          const r2 = (beamProgress - 0.15) * Math.max(W, H)
          ctx.beginPath()
          ctx.arc(cx, cy, r2, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(155,114,255,${0.3 * (1 - beamProgress)})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(beamTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99998,
      opacity: phase === 'fade' ? 0 : 1,
      transition: 'opacity .6s ease',
      pointerEvents: phase === 'fade' ? 'none' : 'all',
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* skip button */}
      <button
        onClick={() => { setPhase('fade'); setTimeout(() => onDone?.(), 600) }}
        style={{
          position: 'absolute', bottom: '2rem', right: '2rem',
          background: 'none', border: '1px solid rgba(0,229,255,.25)',
          color: 'rgba(0,229,255,.5)', fontFamily: 'var(--mono)',
          fontSize: '.7rem', letterSpacing: '.12em', padding: '.4rem 1rem',
          transition: 'all .2s',
        }}
        onMouseEnter={e => { e.target.style.color = 'var(--accent)'; e.target.style.borderColor = 'var(--accent)' }}
        onMouseLeave={e => { e.target.style.color = 'rgba(0,229,255,.5)'; e.target.style.borderColor = 'rgba(0,229,255,.25)' }}
      >
        [SKIP]
      </button>
    </div>
  )
}
