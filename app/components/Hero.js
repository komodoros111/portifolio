'use client'
import { useEffect, useRef, useState } from 'react'

const TYPED = [
  'Desenvolvedor Full Stack',
  'Criador de Sites Modernos',
  'Dev de Apps Mobile & Desktop',
  'Python · Next.js · JavaScript',
]

export default function Hero() {
  const [text, setText] = useState('')
  const [si, setSi]     = useState(0)
  const [ci, setCi]     = useState(0)
  const [del, setDel]   = useState(false)
  const canvasRef        = useRef(null)

  /* typing */
  useEffect(() => {
    const cur = TYPED[si]
    const t = setTimeout(() => {
      if (!del) {
        setText(cur.slice(0, ci+1))
        if (ci+1 === cur.length) setTimeout(() => setDel(true), 2400)
        else setCi(c=>c+1)
      } else {
        setText(cur.slice(0, ci-1))
        if (ci-1 === 0) { setDel(false); setSi(s=>(s+1)%TYPED.length); setCi(0) }
        else setCi(c=>c-1)
      }
    }, del ? 32 : 70)
    return () => clearTimeout(t)
  }, [ci, del, si])

  /* particles */
  useEffect(() => {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d')
    const resize = () => { c.width = innerWidth; c.height = innerHeight }
    resize()
    const pts = Array.from({length:60}, () => ({
      x:Math.random()*c.width, y:Math.random()*c.height,
      vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
      r:Math.random()*1.4+.3, a:Math.random()*.35+.05,
    }))
    let id
    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height)
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy
        if(p.x<0||p.x>c.width)p.vx*=-1
        if(p.y<0||p.y>c.height)p.vy*=-1
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(0,229,255,${p.a})`; ctx.fill()
      })
      pts.forEach((a,i)=>pts.slice(i+1).forEach(b=>{
        const d=Math.hypot(a.x-b.x,a.y-b.y)
        if(d<110){
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y)
          ctx.strokeStyle=`rgba(0,229,255,${.055*(1-d/110)})`; ctx.stroke()
        }
      }))
      id=requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize',resize)
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize',resize) }
  }, [])

  return (
    <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', overflow:'hidden' }}>
      <canvas ref={canvasRef} style={{position:'absolute',inset:0,zIndex:0}}/>

      {/* gradient orbs */}
      <div style={{position:'absolute',width:'800px',height:'800px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,229,255,.045) 0%,transparent 68%)',top:'-200px',right:'-200px',pointerEvents:'none',animation:'float 9s ease-in-out infinite'}}/>
      <div style={{position:'absolute',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle,rgba(155,114,255,.055) 0%,transparent 68%)',bottom:'0',left:'8%',pointerEvents:'none',animation:'float 12s ease-in-out infinite reverse'}}/>

      <div className="container" style={{position:'relative',zIndex:1,paddingTop:'7rem',paddingBottom:'4rem'}}>
        <div style={{maxWidth:'860px'}}>

          {/* eyebrow */}
          <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1.75rem',animation:'fadeUp .6s ease both'}}>
            <div style={{width:32,height:1,background:'var(--accent)'}}/>
            <span style={{fontFamily:'var(--mono)',fontSize:'.7rem',letterSpacing:'.28em',color:'var(--accent)',textTransform:'uppercase'}}>
              PORTFOLIO — RCHIY.DEV
            </span>
          </div>

          {/* main heading */}
          <h1 style={{fontFamily:'var(--display)',fontSize:'clamp(4rem,10vw,8.5rem)',lineHeight:.95,letterSpacing:'.02em',marginBottom:'1.5rem',animation:'revealUp .9s var(--ease-out-expo) .15s both'}}>
            <span style={{display:'block',color:'var(--text)'}}>TRANSFORMO</span>
            <span style={{display:'block',color:'transparent',WebkitTextStroke:'2px var(--accent)',textShadow:'0 0 60px rgba(0,229,255,.3)'}}>IDEIAS</span>
            <span style={{display:'block',color:'var(--text)'}}>EM CÓDIGO</span>
          </h1>

          {/* typed */}
          <div style={{height:'2rem',marginBottom:'2rem',animation:'fadeUp .8s ease .4s both',opacity:0}}>
            <span style={{fontFamily:'var(--mono)',color:'var(--text2)',fontSize:'clamp(.9rem,2vw,1.1rem)',fontWeight:300}}>
              {text}
              <span style={{display:'inline-block',width:'2px',height:'1em',background:'var(--accent)',marginLeft:'3px',verticalAlign:'text-bottom',animation:'blink 1s infinite'}}/>
            </span>
          </div>

          <p style={{color:'var(--text2)',fontSize:'1.05rem',lineHeight:1.85,maxWidth:'520px',fontWeight:300,marginBottom:'2.5rem',animation:'fadeUp .8s ease .55s both',opacity:0}}>
            Crio soluções digitais de alta qualidade — do zero ao deploy. Sites, sistemas, apps mobile e desktop com foco em performance e design.
          </p>

          <div style={{display:'flex',gap:'.85rem',flexWrap:'wrap',animation:'fadeUp .8s ease .7s both',opacity:0}}>
            <a href="#portfolio" className="btn-primary">Ver Projetos</a>
            <a href="#orcamento" className="btn-ghost">Solicitar Orçamento</a>
          </div>

          {/* stats */}
          <div style={{display:'flex',gap:'3rem',marginTop:'5rem',flexWrap:'wrap',animation:'fadeUp .8s ease .85s both',opacity:0}}>
            {[['30+','Projetos entregues'],['20+','Clientes satisfeitos'],['3+','Anos de experiência']].map(([n,l])=>(
              <div key={l}>
                <div style={{fontFamily:'var(--display)',fontSize:'2.8rem',color:'var(--accent)',lineHeight:1,letterSpacing:'.03em',textShadow:'0 0 30px rgba(0,229,255,.4)'}}>{n}</div>
                <div style={{fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--text3)',letterSpacing:'.1em',textTransform:'uppercase',marginTop:'.35rem'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div style={{position:'absolute',bottom:'2.5rem',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'.5rem',animation:'float 2.5s ease-in-out infinite'}}>
        <div style={{width:'20px',height:'32px',border:'1px solid rgba(0,229,255,.3)',borderRadius:'10px',position:'relative'}}>
          <div style={{position:'absolute',top:'5px',left:'50%',transform:'translateX(-50%)',width:'3px',height:'6px',background:'var(--accent)',borderRadius:'2px',animation:'float 1.5s ease-in-out infinite'}}/>
        </div>
      </div>
    </section>
  )
}
