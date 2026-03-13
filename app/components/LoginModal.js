'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginModal({ onClose, onSuccess }) {
  const router = useRouter()
  const [form, setForm]     = useState({ login:'', senha:'' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/login', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Credenciais inválidas'); setLoading(false); return }

      if (data.role === 'admin') {
        localStorage.setItem('rchiy_token', data.token)
        localStorage.setItem('rchiy_user', data.user)
        onSuccess(data.token, data.user)
      } else if (data.role === 'cliente') {
        localStorage.setItem('rchiy_cliente', JSON.stringify({
          user: data.user,
          clienteLogin: data.clienteLogin,
          orcamentoId: data.orcamentoId,
        }))
        onClose()
        router.push('/cliente')
      }
    } catch {
      setError('Erro de conexão')
    }
    setLoading(false)
  }

  const inputSt = { width:'100%', padding:'.9rem 1rem', background:'var(--surface2)', border:'1px solid var(--border2)', color:'var(--text)', fontSize:'.9rem', fontFamily:'var(--mono)', outline:'none', transition:'all .25s' }
  const focus = e => { e.target.style.borderColor='var(--accent)'; e.target.style.boxShadow='0 0 0 3px rgba(0,229,255,.07)' }
  const blur  = e => { e.target.style.borderColor='var(--border2)'; e.target.style.boxShadow='none' }

  return (
    <div style={{position:'fixed',inset:0,zIndex:9000,background:'rgba(4,6,15,0.85)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{width:'100%',maxWidth:'420px',background:'var(--surface)',border:'1px solid rgba(0,229,255,.2)',padding:'2.5rem',position:'relative',boxShadow:'0 40px 80px rgba(0,0,0,.6)'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,var(--accent),var(--violet),transparent)'}}/>
        <button onClick={onClose} style={{position:'absolute',top:'1rem',right:'1rem',background:'none',border:'none',color:'var(--text3)',fontSize:'1.25rem',transition:'color .2s'}}
          onMouseEnter={e=>e.target.style.color='var(--accent)'} onMouseLeave={e=>e.target.style.color='var(--text3)'}>✕</button>

        <div style={{marginBottom:'2rem'}}>
          <p style={{fontFamily:'var(--mono)',fontSize:'.7rem',color:'var(--accent)',letterSpacing:'.2em',marginBottom:'.5rem'}}>// ACESSO</p>
          <h2 style={{fontFamily:'var(--display)',fontSize:'2rem',letterSpacing:'.04em'}}>LOGIN</h2>
          <p style={{color:'var(--text2)',fontSize:'.78rem',marginTop:'.5rem'}}>Admin ou portal do cliente</p>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div>
            <label style={{display:'block',fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--text3)',letterSpacing:'.12em',marginBottom:'.4rem'}}>USUÁRIO / LOGIN</label>
            <input style={inputSt} value={form.login} onChange={e=>setForm(f=>({...f,login:e.target.value}))} placeholder="Login" onFocus={focus} onBlur={blur} onKeyDown={e=>e.key==='Enter'&&handleSubmit()}/>
          </div>
          <div>
            <label style={{display:'block',fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--text3)',letterSpacing:'.12em',marginBottom:'.4rem'}}>SENHA</label>
            <input type="password" style={inputSt} value={form.senha} onChange={e=>setForm(f=>({...f,senha:e.target.value}))} placeholder="••••••••" onFocus={focus} onBlur={blur} onKeyDown={e=>e.key==='Enter'&&handleSubmit()}/>
          </div>

          {error&&<div style={{padding:'.75rem',background:'rgba(255,77,109,.1)',border:'1px solid rgba(255,77,109,.3)',color:'#ff4d6d',fontFamily:'var(--mono)',fontSize:'.78rem'}}>✗ {error}</div>}

          <button className="btn-primary" onClick={handleSubmit} style={{justifyContent:'center',opacity:loading?.7:1,marginTop:'.5rem'}}>
            {loading?'Verificando...':'→ Entrar'}
          </button>
        </div>
      </div>
    </div>
  )
}
