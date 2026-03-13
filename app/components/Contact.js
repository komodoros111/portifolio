'use client'
import OrcamentoForm from './OrcamentoForm'

export default function Contact() {
  return (
    <section id="orcamento" style={{padding:'10rem 0'}}>
      <div className="container">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:'6rem',alignItems:'start'}} className="contact-grid">

          {/* LEFT */}
          <div>
            <div className="section-eyebrow">ORÇAMENTO</div>
            <h2 className="section-title">Vamos criar<br/><span style={{color:'var(--accent)'}}>algo<br/>incrível?</span></h2>
            <p className="section-body" style={{marginBottom:'3rem'}}>
              Descreva sua ideia e receba um orçamento personalizado. Respondo em até 24 horas.
            </p>

            {/* how it works */}
            <div style={{position:'relative'}}>
              {[
                {n:'01',t:'Preencha o formulário',d:'Descreva seu projeto com detalhes'},
                {n:'02',t:'Análise em 24h',d:'Estudo da sua ideia e viabilidade'},
                {n:'03',t:'Orçamento detalhado',d:'Proposta com escopo, prazo e valor'},
                {n:'04',t:'Mãos à obra!',d:'Aprovado, começamos imediatamente'},
              ].map((item,i)=>(
                <div key={item.n} style={{display:'flex',gap:'1.25rem',marginBottom:'1.75rem',position:'relative'}}
                  onMouseEnter={e=>{e.currentTarget.querySelector('.step-num').style.background='var(--accent)';e.currentTarget.querySelector('.step-num').style.color='#000'}}
                  onMouseLeave={e=>{e.currentTarget.querySelector('.step-num').style.background='transparent';e.currentTarget.querySelector('.step-num').style.color='var(--accent)'}}>
                  {/* vertical line */}
                  {i < 3 && <div style={{position:'absolute',left:'1.1rem',top:'2.5rem',bottom:'-1.75rem',width:'1px',background:'var(--border)',zIndex:0}}/>}
                  <div className="step-num" style={{
                    width:'2.2rem',height:'2.2rem',flexShrink:0,
                    border:'1px solid var(--accent)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--accent)',
                    transition:'all .25s',zIndex:1,background:'var(--bg)',
                  }}>{item.n}</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:'.92rem',marginBottom:'.2rem'}}>{item.t}</div>
                    <div style={{color:'var(--text2)',fontSize:'.82rem',fontWeight:300}}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — form */}
          <div style={{
            background:'var(--surface)',
            border:'1px solid var(--border)',
            padding:'3rem',
            position:'relative',overflow:'hidden',
          }}>
            {/* top accent line */}
            <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,var(--accent),var(--violet),transparent)'}}/>

            <h3 style={{fontFamily:'var(--display)',fontSize:'1.8rem',letterSpacing:'.04em',marginBottom:'2rem'}}>
              SOLICITAR ORÇAMENTO
            </h3>
            <OrcamentoForm />
          </div>
        </div>
      </div>
      <style jsx>{`@media(max-width:900px){.contact-grid{grid-template-columns:1fr!important;gap:4rem!important}}`}</style>
    </section>
  )
}
