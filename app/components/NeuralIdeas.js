'use client'
import { useEffect, useRef } from 'react'

const IDEAS = [
  // Project types
  'E-Commerce','App Mobile','Dashboard','SaaS Platform','Bot Telegram',
  'API REST','Landing Page','Sistema ERP','App Fitness','Automação',
  'IA Chatbot','App Delivery','Portfólio','Blog CMS','App Finanças',
  'Sistema PDV','Web Scraper','App Clima','Marketplace','CRM',
  // Technologies
  'Next.js','Python','React','Node.js','PostgreSQL','Firebase',
  'Docker','FastAPI','TypeScript','MongoDB','Redis','GraphQL',
  'React Native','Flutter','Stripe','Prisma',
]

const COLORS = [
  'rgba(0,229,255,',     // accent
  'rgba(155,114,255,',   // violet
  'rgba(255,107,157,',   // rose
  'rgba(255,209,102,',   // gold
  'rgba(98,255,180,',    // green
]

export default function NeuralIdeas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = canvas.parentElement
    let W, H, nodes = [], animId, lastSpawn = 0

    function resize() {
      W = container.offsetWidth
      H = container.offsetHeight
      canvas.width = W
      canvas.height = H
    }

    function randBetween(a, b) { return a + Math.random() * (b - a) }

    function spawnNode(label) {
      return {
        label,
        x: randBetween(80, W - 80),
        y: randBetween(60, H - 60),
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: randBetween(3, 5.5),
        colorBase: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0,
        fadeIn: true,
        life: randBetween(7000, 14000),
        born: Date.now(),
        displayText: '',
        typingIndex: 0,
        typingDone: false,
        erasing: false,
        erasingIndex: 0,
        eraseAt: null,
        pulse: Math.random() * Math.PI * 2,
        lastTypeTick: 0,
        lastEraseTick: 0,
      }
    }

    function makeInitialNodes() {
      nodes = []
      const shuffled = [...IDEAS].sort(() => Math.random() - 0.5)
      const count = Math.min(20, Math.floor(W / 55))
      for (let i = 0; i < count; i++) {
        const n = spawnNode(shuffled[i % shuffled.length])
        n.alpha = randBetween(0.35, 0.9)
        n.displayText = shuffled[i % shuffled.length]
        n.typingDone = true
        n.typingIndex = n.label.length
        n.eraseAt = Date.now() + randBetween(2000, 8000)
        nodes.push(n)
      }
    }

    function update() {
      const now = Date.now()

      // spawn new node every 2s
      if (now - lastSpawn > 2000 && nodes.length < 28) {
        lastSpawn = now
        const label = IDEAS[Math.floor(Math.random() * IDEAS.length)]
        nodes.push(spawnNode(label))
      }

      nodes.forEach(n => {
        // movement with soft wall bounce
        n.x += n.vx; n.y += n.vy
        if (n.x < 60) { n.vx = Math.abs(n.vx); n.x = 60 }
        if (n.x > W - 60) { n.vx = -Math.abs(n.vx); n.x = W - 60 }
        if (n.y < 40) { n.vy = Math.abs(n.vy); n.y = 40 }
        if (n.y > H - 40) { n.vy = -Math.abs(n.vy); n.y = H - 40 }

        // typing effect — tick every 75ms
        if (!n.typingDone && !n.erasing) {
          if (now - n.lastTypeTick > 75) {
            n.lastTypeTick = now
            if (n.typingIndex < n.label.length) {
              n.displayText = n.label.slice(0, ++n.typingIndex)
            } else {
              n.typingDone = true
              n.eraseAt = now + randBetween(3500, 8000)
            }
          }
        }

        // trigger erase
        if (n.typingDone && n.eraseAt && now > n.eraseAt && !n.erasing) {
          n.erasing = true
          n.erasingIndex = n.label.length
        }

        // erasing — tick every 50ms
        if (n.erasing) {
          if (now - n.lastEraseTick > 50) {
            n.lastEraseTick = now
            if (n.erasingIndex > 0) {
              n.displayText = n.label.slice(0, --n.erasingIndex)
            } else {
              // pick new idea
              n.label = IDEAS[Math.floor(Math.random() * IDEAS.length)]
              n.erasing = false
              n.typingDone = false
              n.typingIndex = 0
              n.displayText = ''
              n.eraseAt = null
            }
          }
        }

        // fade in
        if (n.fadeIn) { n.alpha = Math.min(n.alpha + 0.015, 0.9); if (n.alpha >= 0.88) n.fadeIn = false }

        // fade out when old
        const age = now - n.born
        if (age > n.life) n.alpha = Math.max(n.alpha - 0.008, 0)

        n.pulse += 0.028
      })

      // remove dead
      nodes = nodes.filter(n => n.alpha > 0.005 || n.fadeIn)
    }

    function draw() {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, W, H)
      const t = Date.now() * 0.001

      // ambient glow blobs
      for (let i = 0; i < 3; i++) {
        const bx = (Math.sin(t * 0.18 + i * 2.2) * 0.4 + 0.5) * W
        const by = (Math.cos(t * 0.13 + i * 1.8) * 0.4 + 0.5) * H
        const bg = ctx.createRadialGradient(bx, by, 0, bx, by, 220)
        bg.addColorStop(0, `rgba(0,229,255,0.032)`)
        bg.addColorStop(1, 'transparent')
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, W, H)
      }

      // connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 190) {
            const strength = (1 - dist / 190)
            const alpha = Math.min(a.alpha, b.alpha) * strength * 0.35
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(0,229,255,${alpha})`
            ctx.lineWidth = strength * 0.9
            ctx.stroke()

            // signal pulse along connection
            if (strength > 0.55) {
              const prog = ((t * 0.7 + i * 0.22 + j * 0.13) % 1)
              const px = a.x + (b.x - a.x) * prog
              const py = a.y + (b.y - a.y) * prog
              ctx.beginPath()
              ctx.arc(px, py, 2, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(0,229,255,${alpha * 2.5})`
              ctx.fill()
            }
          }
        }
      }

      // draw nodes + labels
      nodes.forEach(n => {
        ctx.save()
        ctx.globalAlpha = n.alpha
        const pulse = 0.6 + 0.4 * Math.sin(n.pulse)

        // outer halo
        const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 11)
        halo.addColorStop(0, `${n.colorBase}${0.14 * pulse})`)
        halo.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 11, 0, Math.PI * 2)
        ctx.fillStyle = halo
        ctx.fill()

        // ring
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 2.8 * pulse, 0, Math.PI * 2)
        ctx.strokeStyle = `${n.colorBase}${0.18 * pulse})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        // core dot
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2)
        ctx.fillStyle = `${n.colorBase}1)`
        ctx.fill()

        // label pill
        if (n.displayText) {
          const fontSize = Math.floor(n.r * 1.8 + 8)
          ctx.font = `500 ${fontSize}px 'JetBrains Mono', monospace`
          ctx.textAlign = 'center'
          const tw = ctx.measureText(n.displayText).width
          const pillH = fontSize + 8
          const pillY = n.y - n.r - pillH - 4

          // pill background
          ctx.fillStyle = 'rgba(3,5,7,0.88)'
          const px = n.x - tw / 2 - 10
          const pw = tw + 20
          ctx.beginPath()
          ctx.roundRect(px, pillY, pw, pillH, 3)
          ctx.fill()

          // pill border
          ctx.strokeStyle = `${n.colorBase}${0.28 * n.alpha})`
          ctx.lineWidth = 0.6
          ctx.stroke()

          // text
          ctx.fillStyle = `${n.colorBase}${n.alpha})`
          ctx.fillText(n.displayText, n.x, pillY + pillH - 5)

          // blinking cursor
          if (!n.typingDone || n.erasing) {
            const blinkOn = Math.floor(Date.now() / 450) % 2 === 0
            if (blinkOn) {
              ctx.fillStyle = `${n.colorBase}${n.alpha})`
              ctx.fillText('_', n.x + tw / 2 + 2, pillY + pillH - 5)
            }
          }
        }

        ctx.restore()
      })
    }

    function loop() {
      update()
      draw()
      animId = requestAnimationFrame(loop)
    }

    resize()
    makeInitialNodes()
    loop()

    const onResize = () => { resize(); makeInitialNodes() }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <div style={{
      position: 'relative',
      height: '520px',
      background: 'var(--bg2)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* header overlay */}
      <div style={{
        position: 'absolute', top: '28px', left: '2.5rem', zIndex: 2,
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '.65rem',
          letterSpacing: '.3em', color: 'rgba(0,229,255,0.45)',
          textTransform: 'uppercase', marginBottom: '.3rem',
        }}>REDE NEURAL DE IDEIAS</div>
        <div style={{
          fontFamily: 'var(--display)', fontSize: '1.15rem',
          color: 'rgba(0,229,255,0.7)', letterSpacing: '.04em',
        }}>Projetos que posso criar para você</div>
      </div>

      {/* bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px',
        background: 'linear-gradient(transparent, var(--bg2))',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '60px',
        background: 'linear-gradient(var(--bg2), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
