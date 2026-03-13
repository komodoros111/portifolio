'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

function AdminCursor() {
  const dotRef = useRef(null)
  useEffect(() => {
    const dot = dotRef.current
    const move = e => { if(dot){ dot.style.left=e.clientX+'px'; dot.style.top=e.clientY+'px' } }
    const hover = e => {
      const on = e.target.matches('a,button,input,textarea,select,[role="button"]') || !!e.target.closest('a,button')
      if(dot){ dot.style.width=on?'12px':'7px'; dot.style.height=on?'12px':'7px'; dot.style.background=on?'#fff':'var(--accent)' }
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', hover)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', hover) }
  }, [])
  return <div ref={dotRef} style={{position:'fixed',pointerEvents:'none',zIndex:99999,borderRadius:'50%',width:'7px',height:'7px',background:'var(--accent)',transform:'translate(-50%,-50%)',boxShadow:'0 0 10px var(--accent)',transition:'width .15s,height .15s,background .15s'}}/>
}

function AdminChat({ selected, token, onClose, onRefresh }) {
  const [msgs, setMsgs]         = useState([])
  const [texto, setTexto]       = useState('')
  const [sending, setSending]   = useState(false)
  const [resposta, setResposta] = useState(selected.resposta || '')
  const [valor, setValor]       = useState(selected.valor || '')
  const [status, setStatus]     = useState(selected.status || 'pendente')
  const [saving, setSaving]     = useState(false)
  const [tab, setTab]           = useState('chat')
  const bottomRef               = useRef(null)
  const pollRef                 = useRef(null)

  const loadMsgs = async () => {
    try {
      const res = await fetch(`/api/mensagens?orcamento_id=${selected.id}`)
      const data = await res.json()
      if (Array.isArray(data)) setMsgs(data)
    } catch {}
  }

  useEffect(() => { loadMsgs(); pollRef.current = setInterval(loadMsgs, 4000); return () => clearInterval(pollRef.current) }, [selected.id])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])

  const sendMsg = async () => {
    if (!texto.trim()) return
    setSending(true)
    try {
      await fetch('/api/mensagens', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ orcamento_id: selected.id, remetente:'admin', texto }) })
      setTexto(''); await loadMsgs()
    } catch {}
    setSending(false)
  }

  const handleResponder = async () => {
    if (!resposta) return
    setSaving(true)
    try {
      await fetch(`/api/orcamentos?token=${token}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: selected.id, resposta, valor, status }) })
      await onRefresh()
    } catch {}
    setSaving(false)
  }

  const inputSt = { width:'100%', padding:'.85rem', background:'var(--surface2)', border:'1px solid var(--border2)', color:'var(--text)', fontFamily:'var(--mono)', fontSize:'.85rem', outline:'none', transition:'border-color .2s' }

  return (
    <div style={{ background:'var(--surface)', border:'1px solid rgba(0,229,255,.2)', position:'sticky', top:'80px', alignSelf:'start', animation:'fadeUp .3s ease', display:'flex', flexDirection:'column', maxHeight:'85vh' }}>
      <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
        <div>
          <div style={{ fontWeight:700, fontSize:'.95rem' }}>{selected.name}</div>
          <div style={{ fontFamily:'var(--mono)', fontSize:'.65rem', color:'var(--accent)', marginTop:'.15rem' }}>{selected.service}</div>
        </div>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text3)', fontSize:'1.2rem' }}>✕</button>
      </div>
      <div style={{ display:'flex', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
        {[['chat','Chat'],['info','Pedido'],['resposta','Responder']].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:'.65rem 1.25rem', background:'none', border:'none', borderBottom:`2px solid ${tab===t?'var(--accent)':'transparent'}`, color:tab===t?'var(--accent)':'var(--text3)', fontSize:'.72rem', letterSpacing:'.08em', marginBottom:'-1px', transition:'all .2s' }}>{l}</button>
        ))}
      </div>

      {tab==='chat'&&(
        <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
          <div style={{ flex:1, overflowY:'auto', padding:'1.25rem', display:'flex', flexDirection:'column', gap:'.6rem' }}>
            {msgs.length===0&&<div style={{ color:'var(--text3)', fontSize:'.78rem', textAlign:'center', marginTop:'2rem' }}>Nenhuma mensagem ainda.</div>}
            {msgs.map(m=>(
              <div key={m.id} style={{ display:'flex', flexDirection:'column', alignItems:m.remetente==='admin'?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'80%', padding:'.65rem .9rem', background:m.remetente==='admin'?'rgba(0,229,255,.12)':'var(--surface2)', border:`1px solid ${m.remetente==='admin'?'rgba(0,229,255,.25)':'var(--border)'}`, fontSize:'.82rem', lineHeight:1.6 }}>{m.texto}</div>
                <div style={{ fontSize:'.6rem', color:'var(--text3)', marginTop:'.2rem' }}>{m.remetente==='admin'?'Você':'Cliente'} · {new Date(m.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>
          <div style={{ padding:'1rem', borderTop:'1px solid var(--border)', display:'flex', gap:'.75rem', flexShrink:0 }}>
            <input value={texto} onChange={e=>setTexto(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} placeholder="Mensagem..." style={{...inputSt,flex:1}} onFocus={e=>{e.target.style.borderColor='var(--accent)'}} onBlur={e=>{e.target.style.borderColor='var(--border2)'}}/>
            <button onClick={sendMsg} disabled={sending||!texto.trim()} style={{ padding:'.85rem 1.25rem', background:'var(--accent)', color:'#000', border:'none', fontFamily:'var(--mono)', fontSize:'.75rem', fontWeight:700, opacity:sending?0.6:1 }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 0 20px rgba(0,229,255,.4)'}} onMouseLeave={e=>{e.currentTarget.style.boxShadow='none'}}>
              {sending?'...':'→'}
            </button>
          </div>
        </div>
      )}

      {tab==='info'&&(
        <div style={{ padding:'1.25rem', overflowY:'auto', flex:1, display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div><div style={{ fontSize:'.6rem', color:'var(--text3)', letterSpacing:'.15em', marginBottom:'.4rem' }}>CLIENTE</div><div style={{ fontSize:'.88rem' }}>{selected.name} — {selected.email}</div></div>
          <div><div style={{ fontSize:'.6rem', color:'var(--text3)', letterSpacing:'.15em', marginBottom:'.4rem' }}>IDEIA</div><div style={{ fontSize:'.85rem', color:'var(--text2)', lineHeight:1.7, background:'var(--surface2)', border:'1px solid var(--border)', padding:'.85rem' }}>{selected.idea}</div></div>
          {selected.budget&&<div><div style={{ fontSize:'.6rem', color:'var(--text3)', letterSpacing:'.15em', marginBottom:'.4rem' }}>ORÇAMENTO</div><div style={{ fontSize:'.85rem', color:'var(--accent)' }}>{selected.budget}</div></div>}
          {selected.deadline&&<div><div style={{ fontSize:'.6rem', color:'var(--text3)', letterSpacing:'.15em', marginBottom:'.4rem' }}>PRAZO</div><div style={{ fontSize:'.85rem', color:'var(--text2)' }}>{selected.deadline}</div></div>}
        </div>
      )}

      {tab==='resposta'&&(
        <div style={{ padding:'1.25rem', overflowY:'auto', flex:1, display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div><label style={{ display:'block', fontSize:'.6rem', color:'var(--text3)', letterSpacing:'.15em', marginBottom:'.4rem' }}>RESPOSTA / PROPOSTA *</label><textarea value={resposta} onChange={e=>setResposta(e.target.value)} rows={6} placeholder="Descreva o orçamento, escopo, prazo..." style={{...inputSt,resize:'vertical'}} onFocus={e=>{e.target.style.borderColor='var(--accent)'}} onBlur={e=>{e.target.style.borderColor='var(--border2)'}}/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
            <div><label style={{ display:'block', fontSize:'.6rem', color:'var(--text3)', letterSpacing:'.15em', marginBottom:'.4rem' }}>VALOR</label><input value={valor} onChange={e=>setValor(e.target.value)} placeholder="R$ 1.500" style={inputSt} onFocus={e=>{e.target.style.borderColor='var(--accent)'}} onBlur={e=>{e.target.style.borderColor='var(--border2)'}}/></div>
            <div><label style={{ display:'block', fontSize:'.6rem', color:'var(--text3)', letterSpacing:'.15em', marginBottom:'.4rem' }}>STATUS</label>
              <select value={status} onChange={e=>setStatus(e.target.value)} style={inputSt}>
                <option value="respondido">Respondido</option><option value="em_andamento">Em andamento</option><option value="rejeitado">Rejeitado</option><option value="pendente">Pendente</option>
              </select>
            </div>
          </div>
          <button onClick={handleResponder} disabled={saving||!resposta} style={{ width:'100%', padding:'.9rem', background:'var(--accent)', color:'#000', border:'none', fontFamily:'var(--mono)', fontSize:'.82rem', fontWeight:700, opacity:saving||!resposta?0.6:1 }}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 0 24px rgba(0,229,255,.4)'}} onMouseLeave={e=>{e.currentTarget.style.boxShadow='none'}}>
            {saving?'Salvando...':'→ Salvar Resposta'}
          </button>
        </div>
      )}
    </div>
  )
}

const STATUS_COLORS = {
  pendente: '#f9c74f',
  respondido: '#00ffe7',
  rejeitado: '#ff4d6d',
  em_andamento: '#7b5ea7',
}

const STATUS_LABELS = {
  pendente: '⏳ Pendente',
  respondido: '✓ Respondido',
  rejeitado: '✗ Rejeitado',
  em_andamento: '⟳ Em andamento',
}

export default function AdminPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [user, setUser] = useState('')
  const [orcamentos, setOrcamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [resposta, setResposta] = useState('')
  const [valor, setValor] = useState('')
  const [status, setStatus] = useState('respondido')
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const t = localStorage.getItem('rchiy_token')
    const u = localStorage.getItem('rchiy_user')
    if (!t) { router.push('/'); return }
    setToken(t); setUser(u)
    fetchData(t)
  }, [])

  const fetchData = async (t) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/orcamentos?token=${t}`)
      if (!res.ok) { router.push('/'); return }
      setOrcamentos(await res.json())
    } catch {}
    setLoading(false)
  }

  const handleResponder = async () => {
    if (!resposta) return
    setSaving(true)
    try {
      await fetch(`/api/orcamentos?token=${token}`, {
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ id: selected.id, resposta, valor, status }),
      })
      await fetchData(token)
      setSelected(null); setResposta(''); setValor('')
    } catch {}
    setSaving(false)
  }

  const logout = () => {
    localStorage.removeItem('rchiy_token')
    localStorage.removeItem('rchiy_user')
    router.push('/')
  }

  const filtered = filter === 'all' ? orcamentos : orcamentos.filter(o => o.status === filter)
  const pending = orcamentos.filter(o => o.status === 'pendente').length

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Space Mono,monospace', color:'var(--accent)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'2rem', marginBottom:'1rem', animation:'spin 1s linear infinite', display:'inline-block' }}>⟳</div>
        <p>Carregando painel...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--text)', fontFamily:'var(--mono)' }}>
      <AdminCursor/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;cursor:none!important}
        :root{--bg:#04060f;--bg2:#070b16;--surface:#0c1222;--surface2:#111827;--border:#1a2540;--border2:#243050;--accent:#00e5ff;--accent2:#7b5ea7;--accent3:#ff4d6d;--accent4:#f9c74f;--text:#e8edf8;--text2:#7a8baa;--text3:#3a4560;--mono:'JetBrains Mono',monospace;--ease-out-expo:cubic-bezier(0.16,1,0.3,1)}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--accent)}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        textarea,input,select{font-family:var(--mono);color:var(--text);outline:none;background:var(--surface2);border:1px solid var(--border2)}
        textarea:focus,input:focus,select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,229,255,0.07)}
        ::selection{background:var(--accent);color:#000}
      `}</style>

      {/* Header */}
      <div style={{ borderBottom:'1px solid var(--border)', padding:'1.25rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(4,6,15,0.9)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
          <span className="mono" style={{ color:'var(--accent)', fontSize:'1rem', fontWeight:700 }}>&lt;Rchiy/&gt; Admin</span>
          {pending > 0 && (
            <span className="mono" style={{ background:'rgba(249,199,79,0.15)', border:'1px solid var(--accent4)', color:'var(--accent4)', padding:'.2rem .7rem', fontSize:'.7rem', borderRadius:'2px' }}>
              {pending} pendente{pending>1?'s':''}
            </span>
          )}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <span style={{ color:'var(--text2)', fontSize:'.85rem' }}>Olá, <strong style={{color:'var(--accent)'}}>{user}</strong></span>
          <button onClick={logout} className="mono" style={{ background:'none', border:'1px solid var(--border)', color:'var(--text3)', padding:'.4rem .9rem', fontSize:'.7rem', cursor:'pointer', transition:'all .2s' }}
            onMouseEnter={e=>{e.target.style.borderColor='var(--accent3)';e.target.style.color='var(--accent3)'}}
            onMouseLeave={e=>{e.target.style.borderColor='var(--border)';e.target.style.color='var(--text3)'}}>
            Sair
          </button>
        </div>
      </div>

      <div style={{ padding:'2rem', maxWidth:'1400px', margin:'0 auto' }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'2rem' }}>
          {[
            { label:'Total', value: orcamentos.length, color:'var(--text)' },
            { label:'Pendentes', value: orcamentos.filter(o=>o.status==='pendente').length, color:'var(--accent4)' },
            { label:'Respondidos', value: orcamentos.filter(o=>o.status==='respondido').length, color:'var(--accent)' },
            { label:'Em andamento', value: orcamentos.filter(o=>o.status==='em_andamento').length, color:'var(--accent2)' },
          ].map(s=>(
            <div key={s.label} style={{ background:'var(--surface)', border:'1px solid var(--border)', padding:'1.25rem', animation:'fadeUp .5s ease' }}>
              <div className="mono" style={{ fontSize:'.65rem', color:'var(--text3)', letterSpacing:'.12em', marginBottom:'.4rem' }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize:'2rem', fontWeight:800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display:'flex', gap:'.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          {[['all','Todos'],['pendente','Pendentes'],['respondido','Respondidos'],['em_andamento','Em andamento'],['rejeitado','Rejeitados']].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)} className="mono"
              style={{ padding:'.4rem 1rem', background: filter===v?'rgba(0,255,231,0.1)':'transparent', border:`1px solid ${filter===v?'var(--accent)':'var(--border)'}`, color: filter===v?'var(--accent)':'var(--text2)', fontSize:'.72rem', cursor:'pointer', transition:'all .2s' }}>
              {l}
            </button>
          ))}
          <button onClick={()=>fetchData(token)} className="mono" style={{ marginLeft:'auto', padding:'.4rem 1rem', background:'transparent', border:'1px solid var(--border)', color:'var(--text3)', fontSize:'.72rem', cursor:'pointer' }}>
            ↻ Atualizar
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap:'1.5rem' }}>
          {/* List */}
          <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
            {filtered.length === 0 && (
              <div style={{ padding:'3rem', textAlign:'center', color:'var(--text3)', fontFamily:'Space Mono,monospace', fontSize:'.85rem', border:'1px dashed var(--border)' }}>
                Nenhum orçamento {filter !== 'all' ? 'nesta categoria' : 'ainda'}.
              </div>
            )}
            {filtered.map(o=>(
              <div key={o.id}
                onClick={()=>{ setSelected(o); setResposta(o.resposta||''); setValor(o.valor||''); setStatus(o.status) }}
                style={{
                  background: selected?.id===o.id ? 'rgba(0,255,231,0.06)' : 'var(--surface)',
                  border: `1px solid ${selected?.id===o.id ? 'rgba(0,255,231,0.35)' : 'var(--border)'}`,
                  padding:'1.25rem', cursor:'pointer', transition:'all .25s',
                  animation:'fadeUp .4s ease',
                }}
                onMouseEnter={e=>{ if(selected?.id!==o.id) e.currentTarget.style.borderColor='var(--border2)' }}
                onMouseLeave={e=>{ if(selected?.id!==o.id) e.currentTarget.style.borderColor='var(--border)' }}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'.6rem' }}>
                  <div>
                    <strong style={{ fontSize:'1rem' }}>{o.name}</strong>
                    <span style={{ color:'var(--text3)', fontSize:'.8rem', marginLeft:'.75rem', fontFamily:'Space Mono,monospace' }}>#{o.id.slice(-6)}</span>
                  </div>
                  <span className="mono" style={{ fontSize:'.65rem', padding:'.2rem .6rem', border:`1px solid ${STATUS_COLORS[o.status]}40`, color: STATUS_COLORS[o.status], background:`${STATUS_COLORS[o.status]}12` }}>
                    {STATUS_LABELS[o.status]}
                  </span>
                </div>
                <div style={{ display:'flex', gap:'1.5rem', marginBottom:'.6rem' }}>
                  <span style={{ fontSize:'.8rem', color:'var(--text2)' }}>📧 {o.email}</span>
                  {o.whatsapp && <span style={{ fontSize:'.8rem', color:'var(--text2)' }}>💬 {o.whatsapp}</span>}
                </div>
                <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
                  <span className="mono" style={{ fontSize:'.68rem', color:'var(--accent)', border:'1px solid rgba(0,255,231,0.2)', padding:'.15rem .5rem' }}>{o.service}</span>
                  {o.budget && <span className="mono" style={{ fontSize:'.68rem', color:'var(--accent4)', border:'1px solid rgba(249,199,79,0.2)', padding:'.15rem .5rem' }}>{o.budget}</span>}
                  {o.deadline && <span className="mono" style={{ fontSize:'.68rem', color:'var(--text3)', border:'1px solid var(--border)', padding:'.15rem .5rem' }}>{o.deadline}</span>}
                </div>
                <p style={{ color:'var(--text2)', fontSize:'.83rem', marginTop:'.6rem', lineHeight:1.5 }}>
                  {o.idea.length>120 ? o.idea.slice(0,120)+'...' : o.idea}
                </p>
                <div style={{ marginTop:'.6rem', fontFamily:'Space Mono,monospace', fontSize:'.65rem', color:'var(--text3)' }}>
                  {new Date(o.createdAt).toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <AdminChat selected={selected} token={token} onClose={()=>setSelected(null)} onRefresh={()=>fetchData(token)}/>
          )}
        </div>
      </div>
    </div>
  )
}
