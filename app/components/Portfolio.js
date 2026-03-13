'use client'
import { useState } from 'react'

const ICONS = {
  ecommerce: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  delivery: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  ),
  dashboard: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  bot: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/>
      <line x1="8" y1="15" x2="8" y2="17"/><line x1="16" y1="15" x2="16" y2="17"/>
    </svg>
  ),
  fitness: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
    </svg>
  ),
  system: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
}

const PROJECTS = [
  { title:'E-Commerce Full Stack', cat:'web',      desc:'Loja virtual completa com carrinho, pagamento Stripe, painel admin e dashboard de vendas em tempo real.', tech:['Next.js','Node.js','PostgreSQL','Stripe'], color:'var(--accent)',  colorVal:'rgba(0,229,255,',    iconKey:'ecommerce' },
  { title:'App de Delivery',       cat:'mobile',   desc:'Aplicativo de entrega para iOS e Android com rastreamento GPS em tempo real e notificações push.',          tech:['React Native','Firebase','Google Maps'],  color:'var(--rose)',    colorVal:'rgba(255,107,157,',  iconKey:'delivery'  },
  { title:'Dashboard Analytics',   cat:'web',      desc:'Plataforma de análise de dados com gráficos interativos, relatórios automáticos e exportação PDF.',         tech:['Next.js','Python','FastAPI','Chart.js'],  color:'var(--violet)', colorVal:'rgba(155,114,255,',  iconKey:'dashboard' },
  { title:'Bot Telegram',          cat:'automacao',desc:'Bot inteligente com comandos personalizados, moderação automática e integração com APIs externas.',          tech:['Python','Telegram API','MongoDB'],        color:'#3776ab',       colorVal:'rgba(55,118,171,',   iconKey:'bot'       },
  { title:'App Fitness',           cat:'mobile',   desc:'Aplicativo de treino e dieta com planos personalizados gerados por IA e acompanhamento de progresso.',      tech:['React Native','Node.js','PostgreSQL'],    color:'#22c55e',       colorVal:'rgba(34,197,94,',    iconKey:'fitness'   },
  { title:'Sistema de Gestão',     cat:'desktop',  desc:'Software desktop para controle de estoque, vendas e finanças com relatórios automáticos.',                  tech:['Python','SQLite','Electron'],             color:'#61dafb',       colorVal:'rgba(97,218,251,',   iconKey:'system'    },
]

const CATS = [
  {id:'all',label:'Todos'},
  {id:'web',label:'Web'},
  {id:'mobile',label:'Mobile'},
  {id:'desktop',label:'Desktop'},
  {id:'automacao',label:'Automação'},
]

function FilterBtn({ label, active, onClick }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setH(true)}
      onMouseLeave={()=>setH(false)}
      style={{
        padding:'.45rem 1.1rem',
        border:`1px solid ${active||h ? 'var(--accent)' : 'var(--border2)'}`,
        color: active||h ? '#000' : 'var(--text2)',
        fontFamily:'var(--mono)', fontSize:'.7rem', letterSpacing:'.08em',
        fontWeight: active ? 700 : 400,
        position:'relative', overflow:'hidden', background:'transparent',
        transition:'color .32s, border-color .25s',
      }}>
      <span style={{
        position:'absolute', inset:0, background:'var(--accent)',
        transform: (active||h) ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin:'left',
        transition:'transform .35s var(--ease-out-expo)', zIndex:0,
      }}/>
      <span style={{position:'relative',zIndex:1}}>{label}</span>
    </button>
  )
}

export default function Portfolio() {
  const [active, setActive]   = useState('all')
  const [hovered, setHovered] = useState(null)
  const filtered = active === 'all' ? PROJECTS : PROJECTS.filter(p=>p.cat===active)

  return (
    <section id="portfolio" style={{padding:'10rem 0'}}>
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'4rem',flexWrap:'wrap',gap:'2rem'}}>
          <div>
            <div className="section-eyebrow">PORTFÓLIO</div>
            <h2 className="section-title">Projetos<br/><span style={{color:'var(--accent)'}}>reais</span></h2>
          </div>
          <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap'}}>
            {CATS.map(c=>(
              <FilterBtn key={c.id} label={c.label} active={active===c.id} onClick={()=>setActive(c.id)}/>
            ))}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:'1px',background:'var(--border)'}} className="proj-grid">
          {filtered.map((p,i)=>(
            <div key={p.title}
              onMouseEnter={()=>setHovered(i)}
              onMouseLeave={()=>setHovered(null)}
              style={{
                background: hovered===i ? 'var(--surface)' : 'var(--bg)',
                padding:'2.5rem', position:'relative', overflow:'hidden',
                transition:'background .35s',
              }}
            >
              {/* SVG icon with glow on hover */}
              <div style={{
                width:60, height:60,
                background: hovered===i ? `${p.colorVal}0.1)` : 'var(--surface)',
                border:`1px solid ${hovered===i ? p.color+'50' : 'var(--border)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom:'1.5rem',
                transition:'all .4s var(--ease-out-expo)',
                transform: hovered===i ? 'scale(1.08) rotate(-4deg)' : 'none',
                boxShadow: hovered===i ? `0 0 24px ${p.colorVal}0.2)` : 'none',
              }}>
                {ICONS[p.iconKey](hovered===i ? p.color : 'var(--text3)')}
              </div>

              <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap',marginBottom:'1rem'}}>
                {p.tech.map(t=>(
                  <span key={t} style={{
                    fontFamily:'var(--mono)',fontSize:'.62rem',letterSpacing:'.06em',
                    color:p.color, border:`1px solid ${p.color}35`,
                    padding:'.15rem .55rem',
                    background: hovered===i ? `${p.colorVal}0.08)` : 'transparent',
                    transition:'all .25s',
                  }}>{t}</span>
                ))}
              </div>

              <h3 style={{fontSize:'1.1rem',fontWeight:600,marginBottom:'.6rem',transition:'color .25s',color: hovered===i ? p.color : 'var(--text)'}}>
                {p.title}
              </h3>
              <p style={{color:'var(--text2)',fontSize:'.85rem',lineHeight:1.75,fontWeight:300}}>
                {p.desc}
              </p>

              <a href="#orcamento" style={{
                display:'inline-flex', alignItems:'center', gap:'.4rem',
                marginTop:'1.5rem',
                fontFamily:'var(--mono)', fontSize:'.72rem', color:p.color,
                textDecoration:'none', letterSpacing:'.05em',
                opacity: hovered===i ? 1 : 0,
                transform: hovered===i ? 'translateX(0)' : 'translateX(-8px)',
                transition:'all .35s var(--ease-out-expo)',
              }}>
                Projeto similar →
              </a>

              {/* corner accent */}
              <div style={{
                position:'absolute', top:0, right:0,
                width:'60px', height:'60px',
                background:`linear-gradient(225deg,${p.colorVal}0.15),transparent)`,
                opacity: hovered===i ? 1 : 0,
                transition:'opacity .3s',
              }}/>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`@media(max-width:600px){.proj-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
