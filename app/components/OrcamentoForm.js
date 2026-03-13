'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SERVICES = [
  'Site Landing Page','Site Institucional','Loja Virtual (E-commerce)',
  'Aplicação Web (Sistema/Dashboard)','App Mobile (iOS + Android)',
  'App Desktop (Windows/Mac/Linux)','Bot / Automação','API / Backend','Outro',
]
const BUDGETS   = ['Até R$ 500','R$ 500 – R$ 1.500','R$ 1.500 – R$ 3.000','R$ 3.000 – R$ 6.000','Acima de R$ 6.000','A combinar']
const DEADLINES = ['Urgente (até 7 dias)','2–3 semanas','1 mês','2+ meses','Sem pressa']

function CinBtn({ onClick, disabled, children, style={} }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        position:'relative',overflow:'hidden',padding:'.9rem 1.5rem',
        background:'transparent',border:'1px solid var(--accent)',
        color:h?'#000':'var(--accent)',fontFamily:'var(--mono)',
        fontSize:'.82rem',fontWeight:700,letterSpacing:'.08em',
        transition:'color .32s, transform .25s, box-shadow .25s',
        transform:h&&!disabled?'translateY(-2px)':'none',
        boxShadow:h&&!disabled?'0 12px 30px rgba(0,229,255,.25)':'none',
        opacity:disabled?.6:1,...style,
      }}>
      <span style={{position:'absolute',inset:0,background:'var(--accent)',transform:h?'scaleX(1)':'scaleX(0)',transformOrigin:'left',transition:'transform .38s var(--ease-out-expo)',zIndex:0}}/>
      <span style={{position:'relative',zIndex:1}}>{children}</span>
    </button>
  )
}

const Icon = {
  user:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  idea:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 21h4M12 2a7 7 0 0 1 4 12.9V17H8v-2.1A7 7 0 0 1 12 2z"/></svg>,
  details: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/></svg>,
  send:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  back:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  key:     <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l3 3"/></svg>,
  copy:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  loading: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{animation:'spin .8s linear infinite'}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>,
}

export default function OrcamentoForm() {
  const router = useRouter()
  const [step, setStep]         = useState(1)
  const [form, setForm]         = useState({ name:'', email:'', service:'', idea:'', budget:'', deadline:'' })
  const [creds, setCreds]       = useState(null) // { login, senha, orcamentoId }
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [copied, setCopied]     = useState('')

  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const handleSubmit = async () => {
    if (!form.idea.trim()) { setError('Por favor, descreva sua ideia.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/orcamentos', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form),
      })
      let data = {}
      try { data = await res.json() } catch {}
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar')
      setCreds({ login: data.clienteLogin, senha: data.clienteSenha, orcamentoId: data.id })
    } catch(e) {
      setError(e.message || 'Erro ao enviar. Tente novamente.')
    }
    setLoading(false)
  }

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const goToPortal = () => {
    localStorage.setItem('rchiy_cliente', JSON.stringify({
      user: form.name,
      clienteLogin: creds.login,
      orcamentoId: creds.orcamentoId,
    }))
    router.push('/cliente')
  }

  const inputSt = { width:'100%', padding:'.9rem 1rem', background:'var(--surface2)', border:'1px solid var(--border2)', color:'var(--text)', fontSize:'.9rem', fontFamily:'var(--body)', outline:'none', transition:'all .25s' }
  const onFocus = e => { e.target.style.borderColor='var(--accent)'; e.target.style.boxShadow='0 0 0 3px rgba(0,229,255,.07)' }
  const onBlur  = e => { e.target.style.borderColor='var(--border2)'; e.target.style.boxShadow='none' }
  const selSt   = a => ({ padding:'.65rem .85rem', textAlign:'left', background:a?'rgba(0,229,255,.1)':'var(--surface2)', border:`1px solid ${a?'var(--accent)':'var(--border)'}`, color:a?'var(--accent)':'var(--text2)', fontSize:'.75rem', fontFamily:'var(--mono)', transition:'all .2s', width:'100%' })
  const chipSt  = a => ({ padding:'.45rem 1rem', background:a?'rgba(0,229,255,.1)':'transparent', border:`1px solid ${a?'var(--accent)':'var(--border)'}`, color:a?'var(--accent)':'var(--text2)', fontSize:'.72rem', fontFamily:'var(--mono)', transition:'all .2s' })

  /* ── CREDENTIALS SCREEN ── */
  if (creds) return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div style={{textAlign:'center',paddingBottom:'1rem'}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:'1rem'}}>{Icon.key}</div>
        <h3 style={{fontFamily:'var(--display)',fontSize:'1.8rem',letterSpacing:'.04em',marginBottom:'.5rem'}}>PEDIDO RECEBIDO!</h3>
        <p style={{color:'var(--text2)',fontSize:'.85rem',lineHeight:1.7}}>
          Seu pedido foi enviado com sucesso.<br/>
          Criamos uma conta para você acompanhar tudo:
        </p>
      </div>

      {/* credentials box */}
      <div style={{background:'rgba(0,229,255,.04)',border:'1px solid rgba(0,229,255,.2)',padding:'1.5rem'}}>
        <div style={{fontFamily:'var(--mono)',fontSize:'.62rem',color:'var(--accent)',letterSpacing:'.25em',marginBottom:'1rem'}}>SUAS CREDENCIAIS DE ACESSO</div>

        {[['Login',creds.login,'login'],['Senha',creds.senha,'senha']].map(([label,value,key])=>(
          <div key={key} style={{marginBottom:'.75rem'}}>
            <div style={{fontSize:'.62rem',color:'var(--text3)',letterSpacing:'.15em',marginBottom:'.3rem'}}>{label.toUpperCase()}</div>
            <div style={{display:'flex',alignItems:'center',gap:'.75rem',background:'var(--surface2)',border:'1px solid var(--border)',padding:'.75rem 1rem'}}>
              <span style={{fontFamily:'var(--mono)',fontSize:'.95rem',color:'var(--text)',flex:1,letterSpacing:'.05em'}}>{value}</span>
              <button onClick={()=>copyText(value,key)} style={{background:'none',border:'none',color:copied===key?'var(--accent)':'var(--text3)',display:'flex',alignItems:'center',gap:'.35rem',fontSize:'.65rem',letterSpacing:'.08em',fontFamily:'var(--mono)',transition:'color .2s'}}>
                {Icon.copy} {copied===key?'Copiado!':'Copiar'}
              </button>
            </div>
          </div>
        ))}

        <div style={{background:'rgba(255,209,102,.08)',border:'1px solid rgba(255,209,102,.2)',padding:'.75rem',marginTop:'.5rem'}}>
          <p style={{fontFamily:'var(--mono)',fontSize:'.68rem',color:'rgba(255,209,102,.8)',lineHeight:1.6}}>
            ⚠ Guarde essas credenciais! Você pode alterar a senha dentro do portal.
          </p>
        </div>
      </div>

      <CinBtn onClick={goToPortal} style={{width:'100%',justifyContent:'center',display:'flex',alignItems:'center',gap:'.6rem'}}>
        Acessar Meu Portal →
      </CinBtn>
    </div>
  )

  const steps = [
    {label:'Contato', icon:Icon.user},
    {label:'Projeto', icon:Icon.idea},
    {label:'Detalhes',icon:Icon.details},
  ]

  return (
    <div>
      {/* Step bar */}
      <div style={{display:'flex',alignItems:'center',marginBottom:'2.5rem'}}>
        {steps.map((s,i)=>(
          <div key={s.label} style={{display:'flex',alignItems:'center',flex:i<2?1:0}}>
            <div style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.45rem .9rem',background:step===i+1?'rgba(0,229,255,.08)':'transparent',border:`1px solid ${step>=i+1?'var(--accent)':'var(--border)'}`,color:step>=i+1?'var(--accent)':'var(--text3)',transition:'all .3s',whiteSpace:'nowrap'}}>
              {s.icon}<span style={{fontFamily:'var(--mono)',fontSize:'.68rem',letterSpacing:'.05em'}}>{s.label}</span>
            </div>
            {i<2&&<div style={{flex:1,height:'1px',background:step>i+1?'var(--accent)':'var(--border)',transition:'background .4s',minWidth:'8px'}}/>}
          </div>
        ))}
      </div>

      {step===1&&(
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div><label style={{display:'block',fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--text3)',letterSpacing:'.12em',marginBottom:'.4rem'}}>NOME COMPLETO *</label><input style={inputSt} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Seu nome" onFocus={onFocus} onBlur={onBlur}/></div>
          <div><label style={{display:'block',fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--text3)',letterSpacing:'.12em',marginBottom:'.4rem'}}>E-MAIL *</label><input type="email" style={inputSt} value={form.email} onChange={e=>set('email',e.target.value)} placeholder="seu@email.com" onFocus={onFocus} onBlur={onBlur}/></div>
          <CinBtn style={{width:'100%',justifyContent:'center',marginTop:'.5rem'}} onClick={()=>{if(!form.name.trim()){alert('Informe seu nome.');return}if(!form.email.includes('@')){alert('E-mail inválido.');return}setStep(2)}}>Próximo →</CinBtn>
        </div>
      )}

      {step===2&&(
        <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
          <div>
            <label style={{display:'block',fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--text3)',letterSpacing:'.12em',marginBottom:'.75rem'}}>TIPO DE PROJETO *</label>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.5rem'}}>
              {SERVICES.map(s=><button key={s} onClick={()=>set('service',s)} style={{...selSt(form.service===s),gridColumn:s==='Outro'?'span 2':undefined}}>{form.service===s?'▸ ':''}{s}</button>)}
            </div>
          </div>
          <div style={{display:'flex',gap:'.75rem'}}>
            <CinBtn onClick={()=>setStep(1)} style={{display:'flex',alignItems:'center',gap:'.5rem'}}>{Icon.back} Voltar</CinBtn>
            <CinBtn style={{flex:1,justifyContent:'center'}} onClick={()=>{if(!form.service){alert('Selecione o tipo.');return}setStep(3)}}>Próximo →</CinBtn>
          </div>
        </div>
      )}

      {step===3&&(
        <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
          <div><label style={{display:'block',fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--text3)',letterSpacing:'.12em',marginBottom:'.4rem'}}>DESCREVA SUA IDEIA *</label><textarea style={{...inputSt,resize:'vertical'}} rows={5} value={form.idea} onChange={e=>set('idea',e.target.value)} placeholder="O que o projeto faz? Funcionalidades importantes..." onFocus={onFocus} onBlur={onBlur}/></div>
          <div><label style={{display:'block',fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--text3)',letterSpacing:'.12em',marginBottom:'.5rem'}}>ORÇAMENTO ESTIMADO</label><div style={{display:'flex',flexWrap:'wrap',gap:'.4rem'}}>{BUDGETS.map(b=><button key={b} onClick={()=>set('budget',b)} style={chipSt(form.budget===b)}>{b}</button>)}</div></div>
          <div><label style={{display:'block',fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--text3)',letterSpacing:'.12em',marginBottom:'.5rem'}}>PRAZO DESEJADO</label><div style={{display:'flex',flexWrap:'wrap',gap:'.4rem'}}>{DEADLINES.map(d=><button key={d} onClick={()=>set('deadline',d)} style={chipSt(form.deadline===d)}>{d}</button>)}</div></div>
          {error&&<div style={{padding:'.75rem',background:'rgba(255,77,109,.1)',border:'1px solid rgba(255,77,109,.3)',color:'#ff4d6d',fontFamily:'var(--mono)',fontSize:'.78rem',display:'flex',alignItems:'center',gap:'.5rem'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>{error}</div>}
          <div style={{display:'flex',gap:'.75rem'}}>
            <CinBtn onClick={()=>setStep(2)} style={{display:'flex',alignItems:'center',gap:'.5rem'}}>{Icon.back} Voltar</CinBtn>
            <CinBtn disabled={loading} style={{flex:1,justifyContent:'center',display:'flex',alignItems:'center',gap:'.6rem'}} onClick={handleSubmit}>
              {loading?<>{Icon.loading} Enviando...</>:<>{Icon.send} Enviar Pedido</>}
            </CinBtn>
          </div>
        </div>
      )}
    </div>
  )
}
