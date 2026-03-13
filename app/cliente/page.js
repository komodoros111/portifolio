'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

function Cursor() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const move = e => { if(el){ el.style.left=e.clientX+'px'; el.style.top=e.clientY+'px' } }
    const over = e => {
      const on = e.target.matches('a,button,input,textarea,select') || !!e.target.closest('a,button')
      if(el){ el.style.width=on?'12px':'7px'; el.style.height=on?'12px':'7px'; el.style.background=on?'#fff':'var(--accent)' }
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over) }
  }, [])
  return <div ref={ref} style={{position:'fixed',pointerEvents:'none',zIndex:99999,borderRadius:'50%',width:'7px',height:'7px',background:'var(--accent)',transform:'translate(-50%,-50%)',boxShadow:'0 0 10px var(--accent)',transition:'width .15s,height .15s,background .15s'}}/>
}

function CinBtn({ onClick, children, variant='fill', disabled, style={} }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        position:'relative', overflow:'hidden',
        padding:'.75rem 1.5rem',
        background:'transparent',
        border:`1px solid var(--accent)`,
        color: h ? '#000' : 'var(--accent)',
        fontFamily:'var(--mono)', fontSize:'.78rem', fontWeight:700,
        letterSpacing:'.08em',
        transition:'color .32s, transform .25s, box-shadow .25s',
        transform: h&&!disabled ? 'translateY(-2px)' : 'none',
        boxShadow: h&&!disabled ? '0 12px 30px rgba(0,229,255,.2)' : 'none',
        opacity: disabled ? .6 : 1,
        ...style,
      }}>
      <span style={{position:'absolute',inset:0,background:'var(--accent)',transform:h?'scaleX(1)':'scaleX(0)',transformOrigin:'left',transition:'transform .38s cubic-bezier(0.16,1,0.3,1)',zIndex:0}}/>
      <span style={{position:'relative',zIndex:1}}>{children}</span>
    </button>
  )
}

export default function ClientePage() {
  const router = useRouter()
  const [user, setUser]           = useState(null)
  const [orc, setOrc]             = useState(null)
  const [msgs, setMsgs]           = useState([])
  const [texto, setTexto]         = useState('')
  const [sending, setSending]     = useState(false)
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState('chat') // chat | pedido | senha
  const [senhaForm, setSenhaForm] = useState({ atual:'', nova:'', conf:'' })
  const [senhaMsg, setSenhaMsg]   = useState('')
  const bottomRef = useRef(null)
  const pollRef   = useRef(null)

  useEffect(() => {
    const data = localStorage.getItem('rchiy_cliente')
    if (!data) { router.push('/'); return }
    const u = JSON.parse(data)
    setUser(u)
    loadData(u)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [msgs])

  const loadData = async (u) => {
    setLoading(true)
    try {
      // load orcamento
      const res = await fetch(`/api/orcamentos?cliente=${u.clienteLogin}`)
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) setOrc(data[0])
      else if (data && data.id) setOrc(data)

      // load messages
      if (u.orcamentoId) {
        const mres = await fetch(`/api/mensagens?orcamento_id=${u.orcamentoId}`)
        const mdata = await mres.json()
        if (Array.isArray(mdata)) setMsgs(mdata)
      }
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  // Poll messages every 4s
  useEffect(() => {
    if (!user?.orcamentoId) return
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/mensagens?orcamento_id=${user.orcamentoId}`)
        const data = await res.json()
        if (Array.isArray(data)) setMsgs(data)
      } catch {}
    }, 4000)
    return () => clearInterval(pollRef.current)
  }, [user])

  const sendMsg = async () => {
    if (!texto.trim() || !user?.orcamentoId) return
    setSending(true)
    try {
      const res = await fetch('/api/mensagens', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ orcamento_id: user.orcamentoId, remetente: 'cliente', texto }),
      })
      if (res.ok) {
        setTexto('')
        const mres = await fetch(`/api/mensagens?orcamento_id=${user.orcamentoId}`)
        const data = await mres.json()
        if (Array.isArray(data)) setMsgs(data)
      }
    } catch {}
    setSending(false)
  }

  const changeSenha = async () => {
    setSenhaMsg('')
    if (senhaForm.nova !== senhaForm.conf) { setSenhaMsg('As senhas não coincidem.'); return }
    if (senhaForm.nova.length < 6) { setSenhaMsg('Senha mínima de 6 caracteres.'); return }
    try {
      const res = await fetch('/api/login', {
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ login: user.clienteLogin, senhaAtual: senhaForm.atual, novaSenha: senhaForm.nova }),
      })
      const data = await res.json()
      if (data.ok) { setSenhaMsg('✓ Senha alterada com sucesso!'); setSenhaForm({ atual:'', nova:'', conf:'' }) }
      else setSenhaMsg('✗ ' + (data.error || 'Erro'))
    } catch { setSenhaMsg('Erro de conexão') }
  }

  const logout = () => {
    localStorage.removeItem('rchiy_cliente')
    router.push('/')
  }

  const STATUS_COLORS = { pendente:'#f9c74f', respondido:'var(--accent)', rejeitado:'#ff4d6d', em_andamento:'var(--violet)' }
  const STATUS_LABELS = { pendente:'Pendente', respondido:'Respondido', rejeitado:'Rejeitado', em_andamento:'Em andamento' }

  const inputSt = { width:'100%', padding:'.85rem 1rem', background:'var(--surface2)', border:'1px solid var(--border2)', color:'var(--text)', fontFamily:'var(--mono)', fontSize:'.85rem', outline:'none', transition:'border-color .2s' }

  if (loading) return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--mono)',color:'var(--accent)'}}>
      <style>{css}</style>
      <Cursor/>
      <div style={{textAlign:'center'}}>
        <div style={{width:'40px',height:'40px',border:'2px solid var(--accent)',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 1rem'}}/>
        Carregando...
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)',fontFamily:'var(--mono)'}}>
      <style>{css}</style>
      <Cursor/>

      {/* Header */}
      <div style={{borderBottom:'1px solid var(--border)',padding:'1rem 2rem',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(3,5,7,.9)',backdropFilter:'blur(20px)',position:'sticky',top:0,zIndex:10}}>
        <div style={{display:'flex',alignItems:'center',gap:'1.25rem'}}>
          <span style={{fontFamily:'var(--display)',fontSize:'1.2rem',color:'var(--accent)',letterSpacing:'.1em'}}>RCHIY</span>
          <span style={{color:'var(--text3)',fontSize:'.7rem'}}>/ Portal do Cliente</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <span style={{fontSize:'.8rem',color:'var(--text2)'}}>Olá, <strong style={{color:'var(--accent)'}}>{user?.user}</strong></span>
          <button onClick={logout} style={{background:'none',border:'1px solid var(--border)',color:'var(--text3)',padding:'.35rem .8rem',fontSize:'.7rem',transition:'all .2s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='#ff4d6d';e.currentTarget.style.color='#ff4d6d'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text3)'}}>
            Sair
          </button>
        </div>
      </div>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'2rem'}}>

        {/* Status card */}
        {orc && (
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',padding:'1.5rem',marginBottom:'1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem',flexWrap:'wrap'}}>
            <div>
              <div style={{fontSize:'.62rem',color:'var(--text3)',letterSpacing:'.2em',marginBottom:'.3rem'}}>SEU PEDIDO</div>
              <div style={{fontSize:'.95rem',fontWeight:600}}>{orc.service}</div>
              <div style={{fontSize:'.72rem',color:'var(--text2)',marginTop:'.2rem'}}>{new Date(orc.created_at).toLocaleDateString('pt-BR')}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.4rem 1rem',border:`1px solid ${STATUS_COLORS[orc.status]}40`,background:`${STATUS_COLORS[orc.status]}12`}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:STATUS_COLORS[orc.status],display:'inline-block'}}/>
              <span style={{fontSize:'.72rem',color:STATUS_COLORS[orc.status],letterSpacing:'.1em'}}>{STATUS_LABELS[orc.status]}</span>
            </div>
            {orc.valor && (
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'.62rem',color:'var(--text3)',letterSpacing:'.15em',marginBottom:'.2rem'}}>VALOR PROPOSTO</div>
                <div style={{fontFamily:'var(--display)',fontSize:'1.5rem',color:'var(--accent)'}}>{orc.valor}</div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div style={{display:'flex',borderBottom:'1px solid var(--border)',marginBottom:'1.5rem'}}>
          {[['chat','💬 Chat'],['pedido','📋 Meu Pedido'],['senha','🔒 Senha']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{padding:'.75rem 1.5rem',background:'none',border:'none',borderBottom:`2px solid ${tab===t?'var(--accent)':'transparent'}`,color:tab===t?'var(--accent)':'var(--text3)',fontSize:'.75rem',letterSpacing:'.08em',marginBottom:'-1px',transition:'all .2s'}}>
              {l}
            </button>
          ))}
        </div>

        {/* CHAT TAB */}
        {tab === 'chat' && (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div style={{background:'var(--surface)',border:'1px solid var(--border)',height:'420px',overflowY:'auto',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'.75rem'}}>
              {msgs.length === 0 && (
                <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text3)',fontSize:'.8rem',textAlign:'center'}}>
                  Nenhuma mensagem ainda.<br/>Envie uma mensagem para começar!
                </div>
              )}
              {msgs.map(m => (
                <div key={m.id} style={{display:'flex',flexDirection:'column',alignItems:m.remetente==='admin'?'flex-start':'flex-end'}}>
                  <div style={{
                    maxWidth:'75%',padding:'.75rem 1rem',
                    background: m.remetente==='admin' ? 'var(--surface2)' : 'rgba(0,229,255,.1)',
                    border: `1px solid ${m.remetente==='admin' ? 'var(--border)' : 'rgba(0,229,255,.25)'}`,
                    fontSize:'.85rem',lineHeight:1.6,
                  }}>
                    {m.texto}
                  </div>
                  <div style={{fontSize:'.62rem',color:'var(--text3)',marginTop:'.25rem'}}>
                    {m.remetente==='admin'?'Rchiy':'Você'} · {new Date(m.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}
                  </div>
                </div>
              ))}
              <div ref={bottomRef}/>
            </div>
            <div style={{display:'flex',gap:'.75rem'}}>
              <input
                value={texto}
                onChange={e=>setTexto(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMsg()}
                placeholder="Digite sua mensagem..."
                style={{...inputSt,flex:1}}
                onFocus={e=>{e.target.style.borderColor='var(--accent)'}}
                onBlur={e=>{e.target.style.borderColor='var(--border2)'}}
              />
              <CinBtn onClick={sendMsg} disabled={sending||!texto.trim()}>
                {sending ? '...' : 'Enviar'}
              </CinBtn>
            </div>
          </div>
        )}

        {/* PEDIDO TAB */}
        {tab === 'pedido' && orc && (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {[
              ['Serviço', orc.service],
              ['Ideia', orc.idea],
              ['Orçamento estimado', orc.budget],
              ['Prazo desejado', orc.deadline],
            ].filter(([,v])=>v).map(([k,v])=>(
              <div key={k} style={{background:'var(--surface)',border:'1px solid var(--border)',padding:'1.25rem'}}>
                <div style={{fontSize:'.62rem',color:'var(--text3)',letterSpacing:'.2em',marginBottom:'.5rem'}}>{k.toUpperCase()}</div>
                <div style={{fontSize:'.88rem',color:'var(--text2)',lineHeight:1.7}}>{v}</div>
              </div>
            ))}
            {orc.resposta && (
              <div style={{background:'rgba(0,229,255,.05)',border:'1px solid rgba(0,229,255,.25)',padding:'1.25rem'}}>
                <div style={{fontSize:'.62rem',color:'var(--accent)',letterSpacing:'.2em',marginBottom:'.5rem'}}>RESPOSTA DE RCHIY</div>
                <div style={{fontSize:'.88rem',color:'var(--text)',lineHeight:1.75,whiteSpace:'pre-wrap'}}>{orc.resposta}</div>
              </div>
            )}
          </div>
        )}

        {/* SENHA TAB */}
        {tab === 'senha' && (
          <div style={{maxWidth:'420px',display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div style={{fontSize:'.72rem',color:'var(--text3)',marginBottom:'.5rem'}}>Login: <strong style={{color:'var(--accent)'}}>{user?.clienteLogin}</strong></div>
            {['atual','nova','conf'].map((k,i)=>(
              <div key={k}>
                <label style={{display:'block',fontSize:'.62rem',color:'var(--text3)',letterSpacing:'.15em',marginBottom:'.4rem'}}>
                  {['SENHA ATUAL','NOVA SENHA','CONFIRMAR NOVA SENHA'][i]}
                </label>
                <input type="password" style={inputSt} value={senhaForm[k]} onChange={e=>setSenhaForm(f=>({...f,[k]:e.target.value}))}
                  onFocus={e=>{e.target.style.borderColor='var(--accent)'}} onBlur={e=>{e.target.style.borderColor='var(--border2)'}}/>
              </div>
            ))}
            {senhaMsg && (
              <div style={{padding:'.75rem',background:senhaMsg.startsWith('✓')?'rgba(34,197,94,.1)':'rgba(255,77,109,.1)',border:`1px solid ${senhaMsg.startsWith('✓')?'rgba(34,197,94,.3)':'rgba(255,77,109,.3)'}`,color:senhaMsg.startsWith('✓')?'#22c55e':'#ff4d6d',fontSize:'.78rem'}}>
                {senhaMsg}
              </div>
            )}
            <CinBtn onClick={changeSenha}>Alterar Senha</CinBtn>
          </div>
        )}
      </div>
    </div>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;700;800&family=Bebas+Neue&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;cursor:none!important}
  :root{--bg:#030507;--bg2:#06080d;--surface:#0a0d14;--surface2:#0f1420;--border:#151d2e;--border2:#1e2940;--accent:#00e5ff;--violet:#9b72ff;--text:#dde4f0;--text2:#6b7fa3;--text3:#2e3d58;--mono:'JetBrains Mono',monospace;--display:'Bebas Neue',sans-serif;}
  ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--accent)}
  ::selection{background:var(--accent);color:#000}
  @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
`
