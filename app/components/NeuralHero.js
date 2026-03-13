'use client'
import { useEffect, useRef } from 'react'

export default function NeuralHero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = canvas.parentElement
    let W, H, nodes = [], animId

    function resize() {
      W = container.offsetWidth
      H = container.offsetHeight
      canvas.width = W
      canvas.height = H
    }

    function makeNodes() {
      nodes = []
      const count = Math.max(30, Math.floor(W / 55))
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: Math.random() * 2 + 1.2,
          pulse: Math.random() * Math.PI * 2,
          layer: Math.floor(Math.random() * 4), // 0-3 layers
        })
      }
    }

    function draw() {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, W, H)
      const t = Date.now() * 0.001

      // connections with animated data pulses
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.22
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(0,229,255,${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()

            // traveling signal dot
            if (dist < 100 && Math.sin(t * 1.5 + i * 0.7 + j * 0.3) > 0.92) {
              const prog = (t * 0.6 + i * 0.15) % 1
              const px = nodes[j].x + (nodes[i].x - nodes[j].x) * prog
              const py = nodes[j].y + (nodes[i].y - nodes[j].y) * prog
              ctx.beginPath()
              ctx.arc(px, py, 1.8, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(0,229,255,${alpha * 4})`
              ctx.fill()
            }
          }
        }
      }

      // nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
        n.pulse += 0.025

        const pulse = 0.5 + 0.5 * Math.sin(n.pulse)
        const layerColors = [
          `rgba(0,229,255,`,
          `rgba(155,114,255,`,
          `rgba(255,107,157,`,
          `rgba(255,209,102,`,
        ]
        const col = layerColors[n.layer]

        // outer glow
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 8)
        glow.addColorStop(0, `${col}${0.1 * pulse})`)
        glow.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 8, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // core
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * (0.8 + pulse * 0.4), 0, Math.PI * 2)
        ctx.fillStyle = `${col}${0.5 + pulse * 0.4})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    resize()
    makeNodes()
    draw()
    window.addEventListener('resize', () => { resize(); makeNodes() })
    return () => { cancelAnimationFrame(animId) }
  }, [])

  return (
    <div style={{
      position: 'relative', height: '280px',
      background: 'var(--bg2)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      {/* center label */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        fontFamily: 'var(--mono)', fontSize: '.65rem',
        letterSpacing: '.4em', color: 'rgba(0,229,255,0.2)',
        textTransform: 'uppercase', pointerEvents: 'none',
        textAlign: 'center', whiteSpace: 'nowrap',
      }}>
        NEURAL NETWORK — PROCESSING
      </div>
    </div>
  )
}
