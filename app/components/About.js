'use client'
import { useState } from 'react'

export default function About() {
  const [imgError, setImgError] = useState(false)

  return (
    <section id="sobre" style={{padding:'10rem 0',background:'var(--bg2)'}}>
      <div className="container">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6rem',alignItems:'center'}} className="about-grid">

          {/* LEFT — profile image */}
          <div style={{position:'relative'}}>
            <div className="profile-img-wrap" style={{marginLeft:'auto',marginRight:0}}>
              {imgError ? (
                /* fallback avatar */
                <div style={{
                  width:'100%', paddingBottom:'120%',
                  background:'linear-gradient(135deg,var(--surface2),var(--surface3))',
                  border:'1px solid var(--border)',
                  position:'relative', overflow:'hidden',
                }}>
                  {/* animated grid bg */}
                  <div style={{
                    position:'absolute',inset:0,
                    backgroundImage:'linear-gradient(rgba(0,229,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.04) 1px,transparent 1px)',
                    backgroundSize:'32px 32px',
                  }}/>
                  <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1.25rem'}}>
                    {/* avatar circle */}
                    <div style={{
                      width:'120px',height:'120px',borderRadius:'50%',
                      background:'linear-gradient(135deg,rgba(0,229,255,.1),rgba(155,114,255,.15))',
                      border:'2px solid rgba(0,229,255,.35)',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontFamily:'var(--display)',fontSize:'3.8rem',color:'var(--accent)',
                      boxShadow:'0 0 60px rgba(0,229,255,.15), inset 0 0 30px rgba(0,229,255,.05)',
                      animation:'pulse 2.5s ease-in-out infinite',
                      position:'relative',
                    }}>
                      R
                      {/* ring */}
                      <div style={{
                        position:'absolute',inset:'-10px',borderRadius:'50%',
                        border:'1px solid rgba(0,229,255,.15)',
                        animation:'spin 8s linear infinite',
                      }}/>
                    </div>
                    <div style={{fontFamily:'var(--mono)',fontSize:'.78rem',color:'var(--accent)',letterSpacing:'.18em',textShadow:'0 0 20px rgba(0,229,255,.4)'}}>RCHIY.DEV</div>
                    <div style={{fontFamily:'var(--mono)',fontSize:'.62rem',color:'var(--text3)',letterSpacing:'.12em'}}>FULL STACK DEVELOPER</div>
                    {/* scan line */}
                    <div style={{
                      position:'absolute',top:0,left:0,right:0,height:'2px',
                      background:'linear-gradient(90deg,transparent,rgba(0,229,255,.4),transparent)',
                      animation:'scanline 3s linear infinite',
                    }}/>
                  </div>
                </div>
              ) : (
                <img
                  src="/profile.jpg"
                  alt="Rchiy"
                  onError={() => setImgError(true)}
                  style={{width:'100%',display:'block'}}
                />
              )}
            </div>

            {/* floating badge — disponível */}
            <div style={{
              position:'absolute', bottom:'-1.5rem', right:'-1.5rem',
              background:'var(--surface)', border:'1px solid rgba(0,229,255,.25)',
              padding:'1rem 1.4rem',
              boxShadow:'0 20px 40px rgba(0,0,0,.5)',
            }}>
              <div style={{display:'flex',alignItems:'center',gap:'.6rem',marginBottom:'.35rem'}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:'#22c55e',display:'inline-block',boxShadow:'0 0 8px #22c55e',animation:'pulse 2s infinite'}}/>
                <span style={{fontFamily:'var(--mono)',fontSize:'.65rem',color:'#22c55e',letterSpacing:'.12em'}}>DISPONÍVEL</span>
              </div>
              <div style={{fontFamily:'var(--mono)',fontSize:'.72rem',color:'var(--text2)'}}>Para novos projetos</div>
            </div>

            {/* years badge */}
            <div style={{
              position:'absolute', top:'-1.5rem', left:'-1.5rem',
              background:'var(--accent)',
              width:'80px', height:'80px',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            }}>
              <span style={{fontFamily:'var(--display)',fontSize:'2.2rem',color:'#000',lineHeight:1}}>3+</span>
              <span style={{fontFamily:'var(--mono)',fontSize:'.5rem',color:'rgba(0,0,0,.7)',letterSpacing:'.08em',textAlign:'center'}}>ANOS</span>
            </div>
          </div>

          {/* RIGHT — text */}
          <div>
            <div className="section-eyebrow">SOBRE MIM</div>
            <h2 className="section-title">
              Código que<br/>
              <span style={{color:'var(--accent)',textShadow:'0 0 40px rgba(0,229,255,.3)'}}>resolve</span><br/>
              problemas
            </h2>
            <p className="section-body" style={{marginBottom:'1.5rem'}}>
              Sou Rchiy, desenvolvedor full stack apaixonado por criar soluções digitais que fazem diferença. Entrego projetos do zero ao deploy com qualidade e atenção aos detalhes.
            </p>
            <p className="section-body" style={{marginBottom:'2.5rem'}}>
              Com Python, Next.js, JavaScript e mais no arsenal, transformo ideias em produtos funcionais, rápidos e visualmente incríveis.
            </p>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem',marginBottom:'2.5rem'}}>
              {[
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title:'Entrega Rápida', desc:'Prazos cumpridos' },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, title:'Foco no cliente', desc:'Resultado garantido' },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>, title:'Suporte', desc:'Pós-entrega incluso' },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, title:'Qualidade', desc:'Código limpo e escalável' },
              ].map(t=>(
                <div key={t.title} style={{
                  padding:'1rem', background:'var(--surface)', border:'1px solid var(--border)',
                  transition:'all .3s var(--ease-out-expo)',
                }}
                onMouseEnter={e=>{
                  e.currentTarget.style.borderColor='rgba(0,229,255,.3)'
                  e.currentTarget.style.transform='translateY(-3px)'
                  e.currentTarget.style.boxShadow='0 12px 30px rgba(0,0,0,.3)'
                }}
                onMouseLeave={e=>{
                  e.currentTarget.style.borderColor='var(--border)'
                  e.currentTarget.style.transform='none'
                  e.currentTarget.style.boxShadow='none'
                }}>
                  <div style={{color:'var(--accent)',marginBottom:'.35rem',display:'flex'}}>{t.icon}</div>
                  <div style={{fontSize:'.88rem',fontWeight:500,marginBottom:'.15rem'}}>{t.title}</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--text3)'}}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`@media(max-width:768px){.about-grid{grid-template-columns:1fr!important;gap:4rem!important}}`}</style>
    </section>
  )
}
