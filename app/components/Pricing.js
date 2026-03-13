'use client'
import { useState } from 'react'

const PLANS = [
  {
    name:'Starter', emoji:'🚀', price:'R$ 500', period:'projeto',
    desc:'Ideal para landing pages e sites simples',
    items:['Landing page responsiva','Até 5 seções','Formulário de contato','Hospedagem básica','Prazo: 5–7 dias','1 revisão inclusa'],
    color:'var(--text2)', colorRaw:'rgba(110,127,163,',
  },
  {
    name:'Pro', emoji:'⚡', price:'R$ 1.500', period:'projeto',
    desc:'Para sites completos e aplicações web',
    items:['Site/App completo','Até 10 páginas','Autenticação de usuários','Banco de dados','Painel admin','Deploy + domínio','Prazo: 15–21 dias','3 revisões inclusas'],
    color:'var(--accent)', featured:true, colorRaw:'rgba(0,229,255,',
  },
  {
    name:'Enterprise', emoji:'🏆', price:'Consulta', period:'',
    desc:'Para sistemas complexos e apps mobile',
    items:['App mobile iOS + Android','Sistema completo','Integrações avançadas','IA e automação','Suporte dedicado','Prazo: sob demanda','Revisões ilimitadas'],
    color:'var(--gold)', colorRaw:'rgba(255,209,102,',
  },
]

export default function Pricing() {
  const [hovered, setHovered] = useState(null)
  const [btnHovered, setBtnHovered] = useState(null)

  return (
    <section id="precos" style={{padding:'10rem 0',background:'var(--bg2)'}}>
      <div className="container">
        <div style={{textAlign:'center',marginBottom:'5rem'}}>
          <div className="section-eyebrow" style={{justifyContent:'center'}}>PREÇOS</div>
          <h2 className="section-title">Investimento<br/><span style={{color:'var(--accent)'}}>transparente</span></h2>
          <p className="section-body" style={{margin:'0 auto'}}>Orçamento aprovado antes do início. Sem surpresas.</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'var(--border)',alignItems:'start'}} className="pricing-grid">
          {PLANS.map((p,i)=>(
            <div key={p.name}
              onMouseEnter={()=>setHovered(i)}
              onMouseLeave={()=>setHovered(null)}
              style={{
                padding:'2.5rem',
                background: p.featured ? 'var(--surface2)' : (hovered===i ? 'var(--surface)' : 'var(--bg2)'),
                position:'relative',overflow:'hidden',
                transition:'background .35s',
                borderTop: p.featured ? `2px solid ${p.color}` : undefined,
              }}
            >
              {p.featured && (
                <div style={{
                  position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',
                  background:'var(--accent)',padding:'.2rem 1.25rem',
                  fontFamily:'var(--mono)',fontSize:'.6rem',color:'#000',fontWeight:700,letterSpacing:'.1em',
                  whiteSpace:'nowrap',
                }}>RECOMENDADO</div>
              )}

              <div style={{fontSize:'2rem',marginBottom:'1rem'}}>{p.emoji}</div>
              <div style={{fontFamily:'var(--mono)',fontSize:'.7rem',color:p.color,letterSpacing:'.15em',marginBottom:'.5rem'}}>{p.name.toUpperCase()}</div>
              <p style={{color:'var(--text2)',fontSize:'.85rem',marginBottom:'1.75rem',fontWeight:300}}>{p.desc}</p>

              <div style={{marginBottom:'2rem'}}>
                <span style={{
                  fontFamily:'var(--display)',fontSize:'2.8rem',letterSpacing:'.02em',
                  color: hovered===i||p.featured ? p.color : 'var(--text)',
                  transition:'color .3s,text-shadow .3s',
                  textShadow: hovered===i ? `0 0 30px ${p.colorRaw}0.4)` : 'none',
                }}>{p.price}</span>
                {p.period && <span style={{color:'var(--text3)',fontFamily:'var(--mono)',fontSize:'.72rem',marginLeft:'.5rem'}}>/ {p.period}</span>}
              </div>

              <ul style={{listStyle:'none',marginBottom:'2rem',display:'flex',flexDirection:'column',gap:'.6rem'}}>
                {p.items.map(f=>(
                  <li key={f} style={{display:'flex',gap:'.65rem',fontSize:'.85rem',color:'var(--text2)',fontWeight:300}}>
                    <span style={{color:p.color,flexShrink:0,fontFamily:'var(--mono)'}}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="#orcamento"
                onMouseEnter={()=>setBtnHovered(i)}
                onMouseLeave={()=>setBtnHovered(null)}
                style={{
                  display:'block',textAlign:'center',padding:'.85rem',
                  color: btnHovered===i ? '#000' : (p.featured ? '#000' : p.color),
                  border:`1px solid ${p.color}`,
                  fontFamily:'var(--mono)',fontSize:'.75rem',fontWeight:700,
                  textDecoration:'none',letterSpacing:'.08em',
                  transition:'all .35s var(--ease-out-expo)',
                  position:'relative',overflow:'hidden',
                  transform: btnHovered===i ? 'translateY(-2px)' : 'none',
                  boxShadow: btnHovered===i ? `0 12px 32px ${p.colorRaw}0.28)` : 'none',
                }}
              >
                <span style={{
                  position:'absolute',inset:0,
                  background: p.color,
                  transform: btnHovered===i ? 'scaleX(1)' : (p.featured ? 'scaleX(1)' : 'scaleX(0)'),
                  transformOrigin:'left',
                  transition:'transform .38s var(--ease-out-expo)',
                  zIndex:0,
                }}/>
                <span style={{position:'relative',zIndex:1}}>
                  {p.featured ? 'Começar Agora' : 'Solicitar'}
                </span>
              </a>
            </div>
          ))}
        </div>

        <p style={{textAlign:'center',fontFamily:'var(--mono)',color:'var(--text3)',fontSize:'.68rem',marginTop:'2rem',letterSpacing:'.05em'}}>
          * Valores iniciais. Orçamento final calculado de acordo com a complexidade.
        </p>
      </div>
      <style jsx>{`@media(max-width:768px){.pricing-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
