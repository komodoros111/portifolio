'use client'
import { useState } from 'react'

function TermsModal({ onClose }) {
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9000,
      background:'rgba(3,5,7,0.92)', backdropFilter:'blur(16px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'2rem',
    }} onClick={onClose}>
      <div style={{
        background:'var(--surface)', border:'1px solid rgba(0,229,255,0.2)',
        maxWidth:'680px', width:'100%', maxHeight:'80vh', overflow:'hidden',
        display:'flex', flexDirection:'column',
        position:'relative',
      }} onClick={e => e.stopPropagation()}>
        {/* top accent */}
        <div style={{height:'2px', background:'linear-gradient(90deg,var(--accent),var(--violet),transparent)'}}/>

        {/* header */}
        <div style={{padding:'1.5rem 2rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontFamily:'var(--mono)', fontSize:'.65rem', letterSpacing:'.3em', color:'var(--accent)', marginBottom:'.3rem'}}>RCHIY.DEV</div>
            <h2 style={{fontFamily:'var(--display)', fontSize:'1.8rem', letterSpacing:'.04em'}}>TERMOS DE USO</h2>
          </div>
          <button onClick={onClose} style={{background:'none', border:'1px solid var(--border)', color:'var(--text2)', width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', transition:'all .2s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.color='var(--accent)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text2)'}}>
            ✕
          </button>
        </div>

        {/* content */}
        <div style={{padding:'2rem', overflowY:'auto', flex:1}}>
          {[
            { title:'1. Uso do Site', text:'Este portfólio tem fins exclusivamente informativos e comerciais. O acesso e a navegação implicam concordância com estes termos.' },
            { title:'2. Propriedade Intelectual', text:'Todo o conteúdo deste site — incluindo textos, código-fonte, design, logotipos e materiais visuais — é de propriedade exclusiva de Rchiy e protegido pelas leis de direitos autorais vigentes no Brasil (Lei nº 9.610/98).' },
            { title:'3. Uso Permitido', text:'É permitido visualizar e compartilhar o link deste portfólio. É proibido copiar, reproduzir, distribuir ou criar obras derivadas de qualquer conteúdo sem autorização expressa e por escrito.' },
            { title:'4. Orçamentos e Contratação', text:'O envio de um formulário de orçamento não constitui contrato. O serviço só é firmado após proposta formal aceita por ambas as partes e pagamento de sinal conforme acordado.' },
            { title:'5. Isenção de Responsabilidade', text:'As informações deste site são fornecidas "como estão". Não nos responsabilizamos por decisões tomadas com base no conteúdo aqui apresentado.' },
            { title:'6. Alterações', text:'Estes termos podem ser atualizados a qualquer momento sem aviso prévio. Recomendamos a consulta periódica desta página.' },
          ].map(item => (
            <div key={item.title} style={{marginBottom:'1.5rem'}}>
              <div style={{fontFamily:'var(--mono)', fontSize:'.72rem', color:'var(--accent)', letterSpacing:'.1em', marginBottom:'.4rem'}}>{item.title}</div>
              <p style={{color:'var(--text2)', fontSize:'.88rem', lineHeight:1.75, fontWeight:300}}>{item.text}</p>
            </div>
          ))}
          <div style={{borderTop:'1px solid var(--border)', paddingTop:'1.5rem', fontFamily:'var(--mono)', fontSize:'.68rem', color:'var(--text3)'}}>
            Última atualização: Janeiro de 2025 · Rchiy · eusoumiguelmarques@gmail.com
          </div>
        </div>
      </div>
    </div>
  )
}

function PrivacyModal({ onClose }) {
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9000,
      background:'rgba(3,5,7,0.92)', backdropFilter:'blur(16px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'2rem',
    }} onClick={onClose}>
      <div style={{
        background:'var(--surface)', border:'1px solid rgba(0,229,255,0.2)',
        maxWidth:'680px', width:'100%', maxHeight:'80vh', overflow:'hidden',
        display:'flex', flexDirection:'column',
      }} onClick={e => e.stopPropagation()}>
        <div style={{height:'2px', background:'linear-gradient(90deg,var(--violet),var(--accent),transparent)'}}/>
        <div style={{padding:'1.5rem 2rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontFamily:'var(--mono)', fontSize:'.65rem', letterSpacing:'.3em', color:'var(--accent)', marginBottom:'.3rem'}}>RCHIY.DEV</div>
            <h2 style={{fontFamily:'var(--display)', fontSize:'1.8rem', letterSpacing:'.04em'}}>DIREITOS AUTORAIS</h2>
          </div>
          <button onClick={onClose} style={{background:'none', border:'1px solid var(--border)', color:'var(--text2)', width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', transition:'all .2s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.color='var(--accent)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text2)'}}>
            ✕
          </button>
        </div>
        <div style={{padding:'2rem', overflowY:'auto', flex:1}}>
          {[
            { title:'© Copyright 2025 — Rchiy', text:'Todo o conteúdo deste site, incluindo mas não se limitando a textos, imagens, código, layouts, animações e identidade visual, é protegido por direitos autorais conforme a Lei Federal nº 9.610/98.' },
            { title:'Código-Fonte', text:'Os projetos desenvolvidos por Rchiy são de propriedade dos respectivos clientes após quitação integral. O código de demonstração e os projetos pessoais exibidos neste portfólio pertencem exclusivamente a Rchiy.' },
            { title:'Design e Visual', text:'A identidade visual, paleta de cores, tipografia e elementos gráficos deste portfólio são originais e não podem ser replicados sem autorização.' },
            { title:'Projetos de Terceiros', text:'Projetos desenvolvidos para clientes são apresentados com autorização. Marcas, logos e conteúdos de terceiros pertencem a seus respectivos proprietários.' },
            { title:'Contato para Licenciamento', text:'Para solicitações de uso, licenciamento ou parcerias, entre em contato pelo formulário de orçamento ou pelo e-mail oficial.' },
          ].map(item => (
            <div key={item.title} style={{marginBottom:'1.5rem'}}>
              <div style={{fontFamily:'var(--mono)', fontSize:'.72rem', color:'var(--accent)', letterSpacing:'.1em', marginBottom:'.4rem'}}>{item.title}</div>
              <p style={{color:'var(--text2)', fontSize:'.88rem', lineHeight:1.75, fontWeight:300}}>{item.text}</p>
            </div>
          ))}
          <div style={{borderTop:'1px solid var(--border)', paddingTop:'1.5rem', fontFamily:'var(--mono)', fontSize:'.68rem', color:'var(--text3)'}}>
            © 2025 Rchiy — Todos os direitos reservados.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Footer() {
  const [showTerms,   setShowTerms]   = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  return (
    <>
      {showTerms   && <TermsModal   onClose={() => setShowTerms(false)}/>}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)}/>}

      <footer style={{borderTop:'1px solid var(--border)', background:'var(--bg)'}}>
        {/* main row */}
        <div style={{padding:'3rem 0', borderBottom:'1px solid var(--border)'}}>
          <div className="container">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1.5rem'}}>
              <div style={{fontFamily:'var(--display)', fontSize:'1.5rem', letterSpacing:'.12em', color:'var(--accent)', textShadow:'0 0 20px rgba(0,229,255,.3)'}}>
                RCHIY
              </div>
              <div style={{display:'flex', gap:'2rem', flexWrap:'wrap'}}>
                {['#sobre','#servicos','#portfolio','#precos','#orcamento'].map(l=>(
                  <a key={l} href={l} style={{color:'var(--text3)', textDecoration:'none', fontFamily:'var(--mono)', fontSize:'.68rem', letterSpacing:'.08em', transition:'color .2s'}}
                    onMouseEnter={e=>e.target.style.color='var(--accent)'}
                    onMouseLeave={e=>e.target.style.color='var(--text3)'}>
                    {l.replace('#','').toUpperCase()}
                  </a>
                ))}
              </div>
              <a href="#orcamento" className="btn-ghost" style={{fontSize:'.72rem', padding:'.6rem 1.4rem'}}>
                Solicitar Orçamento
              </a>
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div style={{padding:'1.25rem 0'}}>
          <div className="container">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem'}}>
              <p style={{fontFamily:'var(--mono)', color:'var(--text3)', fontSize:'.65rem', letterSpacing:'.05em'}}>
                © 2025 RCHIY — Todos os direitos reservados.
              </p>
              <div style={{display:'flex', gap:'1.5rem'}}>
                <button onClick={() => setShowTerms(true)}
                  style={{background:'none', border:'none', fontFamily:'var(--mono)', fontSize:'.65rem', color:'var(--text3)', letterSpacing:'.05em', transition:'color .2s', textDecoration:'underline', textUnderlineOffset:'3px'}}
                  onMouseEnter={e=>e.target.style.color='var(--accent)'}
                  onMouseLeave={e=>e.target.style.color='var(--text3)'}>
                  Termos de Uso
                </button>
                <button onClick={() => setShowPrivacy(true)}
                  style={{background:'none', border:'none', fontFamily:'var(--mono)', fontSize:'.65rem', color:'var(--text3)', letterSpacing:'.05em', transition:'color .2s', textDecoration:'underline', textUnderlineOffset:'3px'}}
                  onMouseEnter={e=>e.target.style.color='var(--accent)'}
                  onMouseLeave={e=>e.target.style.color='var(--text3)'}>
                  Direitos Autorais
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
