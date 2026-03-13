'use client'
import { useState } from 'react'

const ICONS = {
  web: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  app: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  mobile: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  desktop: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  bot: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
      <line x1="12" y1="7" x2="12" y2="11"/><line x1="8" y1="15" x2="8" y2="17"/><line x1="16" y1="15" x2="16" y2="17"/>
    </svg>
  ),
  api: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
}

const SERVICES = [
  { iconKey:'web',     title:'Sites Profissionais', desc:'Landing pages, sites institucionais e blogs com design moderno, responsivo e SEO otimizado.', items:['Design responsivo','SEO otimizado','Alta performance','Painel de edição'], color:'var(--accent)', colorVal:'rgba(0,229,255,', num:'01' },
  { iconKey:'app',     title:'Aplicações Web',      desc:'Sistemas completos com autenticação, dashboards, e-commerces e plataformas SaaS.', items:['Autenticação JWT','Dashboard admin','Banco de dados','API REST/GraphQL'], color:'var(--gold)', colorVal:'rgba(255,209,102,', num:'02', featured:true },
  { iconKey:'mobile',  title:'Apps Mobile',         desc:'Aplicativos iOS e Android com React Native — um código, duas plataformas.', items:['iOS & Android','React Native','Push notifications','Offline mode'], color:'var(--violet)', colorVal:'rgba(155,114,255,', num:'03' },
  { iconKey:'desktop', title:'Apps Desktop',        desc:'Software Windows/Mac/Linux em Python, Electron ou Tauri para automação e produtividade.', items:['Windows · Mac · Linux','Python / Electron','Automação','Instalador'], color:'#61dafb', colorVal:'rgba(97,218,251,', num:'04' },
  { iconKey:'bot',     title:'Automação & Bots',    desc:'Scripts Python, web scraping, bots Telegram/Discord e integrações com APIs externas.', items:['Web scraping','Bots Telegram','Integrações API','Processamento de dados'], color:'#3776ab', colorVal:'rgba(55,118,171,', num:'05' },
  { iconKey:'api',     title:'APIs & Backend',      desc:'APIs RESTful e GraphQL robustas com Node.js ou Python + banco de dados e deploy.', items:['REST / GraphQL','FastAPI · Django','PostgreSQL · MongoDB','Deploy · Docker'], color:'#68a063', colorVal:'rgba(104,160,99,', num:'06' },
]

export default function Services() {
  const [hovered, setHovered] = useState(null)

  return (
    <section id="servicos" style={{padding:'10rem 0',background:'var(--bg2)'}}>
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'5rem',flexWrap:'wrap',gap:'2rem'}}>
          <div>
            <div className="section-eyebrow">SERVIÇOS</div>
            <h2 className="section-title">O que eu<br/><span style={{color:'var(--accent)'}}>construo</span></h2>
          </div>
          <p className="section-body" style={{maxWidth:'360px'}}>
            Do conceito ao deploy — soluções completas para qualquer plataforma e escala.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'var(--border)'}} className="services-grid">
          {SERVICES.map((s,i)=>(
            <div key={s.title}
              onMouseEnter={()=>setHovered(i)}
              onMouseLeave={()=>setHovered(null)}
              style={{
                padding:'2.5rem',
                background: hovered===i ? 'var(--surface)' : 'var(--bg2)',
                position:'relative',overflow:'hidden',
                transition:'background .35s',
                borderTop: s.featured ? `2px solid ${s.color}` : undefined,
              }}
            >
              {s.featured && (
                <div style={{position:'absolute',top:0,right:'2rem',background:s.color,padding:'.2rem .75rem',fontFamily:'var(--mono)',fontSize:'.6rem',color:'#000',fontWeight:700,letterSpacing:'.08em'}}>
                  POPULAR
                </div>
              )}

              {/* ghost number */}
              <div style={{
                position:'absolute',bottom:'-1rem',right:'1.5rem',
                fontFamily:'var(--display)',fontSize:'7rem',
                color:'transparent',WebkitTextStroke:`1px rgba(255,255,255,.04)`,
                lineHeight:1,userSelect:'none',
                opacity: hovered===i ? 1 : 0,
                transition:'opacity .3s',
              }}>{s.num}</div>

              {/* SVG icon box */}
              <div style={{
                width:52,height:52,
                background: hovered===i ? `${s.colorVal}0.12)` : 'var(--surface)',
                border:`1px solid ${hovered===i ? s.color+'50' : 'var(--border)'}`,
                display:'flex',alignItems:'center',justifyContent:'center',
                marginBottom:'1.5rem',
                transition:'all .35s',
                boxShadow: hovered===i ? `0 0 20px ${s.colorVal}0.15)` : 'none',
              }}>
                {ICONS[s.iconKey](hovered===i ? s.color : 'var(--text3)')}
              </div>

              <h3 style={{fontSize:'1.1rem',fontWeight:600,marginBottom:'.7rem',transition:'color .25s',color: hovered===i ? s.color : 'var(--text)'}}>
                {s.title}
              </h3>
              <p style={{color:'var(--text2)',fontSize:'.88rem',lineHeight:1.75,marginBottom:'1.5rem',fontWeight:300}}>
                {s.desc}
              </p>

              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.4rem'}}>
                {s.items.map(f=>(
                  <li key={f} style={{display:'flex',alignItems:'center',gap:'.5rem',fontSize:'.78rem',color:'var(--text2)'}}>
                    <span style={{color:s.color,fontSize:'.6rem'}}>▸</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* hover bottom line */}
              <div style={{
                position:'absolute',bottom:0,left:0,right:0,height:'2px',
                background:`linear-gradient(90deg,${s.color},transparent)`,
                transform: hovered===i ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin:'left',
                transition:'transform .4s var(--ease-out-expo)',
              }}/>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media(max-width:900px){.services-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.services-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  )
}
