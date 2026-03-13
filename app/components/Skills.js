'use client'
import { useEffect, useRef } from 'react'

const SKILLS = [
  { name:'Python',     level:90, color:'#3776ab', icon:'🐍' },
  { name:'Next.js',    level:85, color:'#00e5ff', icon:'▲' },
  { name:'JavaScript', level:88, color:'#f7df1e', icon:'JS' },
  { name:'HTML/CSS',   level:92, color:'#e34f26', icon:'🌐' },
  { name:'React',      level:82, color:'#61dafb', icon:'⚛' },
  { name:'Node.js',    level:75, color:'#68a063', icon:'⬢' },
  { name:'TypeScript', level:70, color:'#007acc', icon:'TS' },
  { name:'Git',        level:88, color:'#f05032', icon:'⎇' },
]

const TAGS = ['React Native','Flutter','PostgreSQL','MongoDB','Docker','REST API','GraphQL','Tailwind CSS','Firebase','Vercel','Linux','Prisma','FastAPI','Django','SQLite','Redis','Electron','Tauri']

export default function Skills() {
  const refs = useRef([])
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) e.target.style.width = e.target.dataset.level+'%' })
    }, {threshold:.4})
    refs.current.forEach(r => r && obs.observe(r))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="habilidades" style={{padding:'10rem 0'}}>
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'5rem',flexWrap:'wrap',gap:'2rem'}}>
          <div>
            <div className="section-eyebrow">HABILIDADES</div>
            <h2 className="section-title">Arsenal<br/><span style={{color:'var(--accent)'}}>técnico</span></h2>
          </div>
          <p className="section-body" style={{maxWidth:'380px'}}>
            Ferramentas e tecnologias que domino para entregar projetos de qualidade.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'1px',background:'var(--border)',marginBottom:'4rem'}}>
          {SKILLS.map((s,i)=>(
            <div key={s.name}
              style={{
                padding:'1.75rem',background:'var(--bg)',
                transition:'background .3s',position:'relative',overflow:'hidden',
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='var(--surface)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='var(--bg)'}}
            >
              {/* big ghost number */}
              <div style={{position:'absolute',top:'-12px',right:'12px',fontFamily:'var(--display)',fontSize:'5rem',color:'transparent',WebkitTextStroke:`1px rgba(${s.color==='#00e5ff'?'0,229,255':'100,100,120'},.07)`,lineHeight:1,userSelect:'none'}}>
                {String(i+1).padStart(2,'0')}
              </div>

              <div style={{display:'flex',alignItems:'center',gap:'.85rem',marginBottom:'1.25rem'}}>
                <div style={{
                  width:40,height:40,
                  background:`${s.color}14`,
                  border:`1px solid ${s.color}30`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontFamily:'var(--mono)',fontSize:'.82rem',fontWeight:700,color:s.color,
                  transition:'all .3s',
                  flexShrink:0,
                }}>
                  {s.icon}
                </div>
                <span style={{fontWeight:600,fontSize:'.95rem'}}>{s.name}</span>
                <span style={{marginLeft:'auto',fontFamily:'var(--mono)',fontSize:'.75rem',color:s.color,fontWeight:700}}>{s.level}%</span>
              </div>

              <div style={{height:'2px',background:'var(--border2)',overflow:'hidden'}}>
                <div ref={el=>refs.current[i]=el} data-level={s.level}
                  style={{height:'100%',width:'0%',background:`linear-gradient(90deg,${s.color},${s.color}99)`,transition:`width 1.4s cubic-bezier(.16,1,.3,1) ${i*.07}s`,boxShadow:`0 0 10px ${s.color}55`}}/>
              </div>
            </div>
          ))}
        </div>

        {/* tags */}
        <div>
          <div style={{fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--text3)',letterSpacing:'.2em',marginBottom:'1.25rem',textAlign:'center'}}>
            TAMBÉM TRABALHO COM
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem',justifyContent:'center'}}>
            {TAGS.map(t=><span key={t} className="tag">{t}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}
