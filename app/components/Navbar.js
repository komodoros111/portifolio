'use client'
import { useState, useEffect } from 'react'

function CinBtn({ href, onClick, children, style = {} }) {
  const [h, setH] = useState(false)
  const Tag = href ? 'a' : 'button'
  return (
    <Tag href={href} onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'var(--mono)', fontSize: '.72rem', fontWeight: 500,
        letterSpacing: '.08em', textDecoration: 'none',
        border: '1px solid rgba(0,229,255,.35)',
        color: h ? '#000' : 'var(--accent)',
        background: 'transparent',
        padding: '.5rem 1.2rem',
        transition: 'color .32s var(--ease-out-expo), transform .25s, box-shadow .25s',
        transform: h ? 'translateY(-1px)' : 'none',
        boxShadow: h ? '0 8px 24px rgba(0,229,255,.2)' : 'none',
        ...style,
      }}>
      <span style={{
        position: 'absolute', inset: 0,
        background: 'var(--accent)',
        transform: h ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform .38s var(--ease-out-expo)',
        zIndex: 0,
      }}/>
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </Tag>
  )
}

export default function Navbar({ onLoginClick, isAdmin }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#sobre',      label: 'Sobre' },
    { href: '#habilidades',label: 'Skills' },
    { href: '#servicos',   label: 'Serviços' },
    { href: '#portfolio',  label: 'Portfólio' },
    { href: '#precos',     label: 'Preços' },
    { href: '#orcamento',  label: 'Orçamento' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: scrolled ? '.9rem 0' : '1.4rem 0',
        transition: 'all .4s cubic-bezier(.16,1,.3,1)',
        background: scrolled ? 'rgba(3,5,7,.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(1.5)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,229,255,.07)' : 'none',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="#" style={{
            fontFamily: 'var(--mono)', color: 'var(--accent)', textDecoration: 'none',
            fontSize: '.95rem', fontWeight: 700, letterSpacing: '.15em',
            textShadow: '0 0 20px rgba(0,229,255,.5)',
            transition: 'text-shadow .3s',
          }}
          onMouseEnter={e => e.target.style.textShadow = '0 0 40px rgba(0,229,255,.9)'}
          onMouseLeave={e => e.target.style.textShadow = '0 0 20px rgba(0,229,255,.5)'}>
            RCHIY
          </a>

          <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', alignItems: 'center' }} className="nav-links">
            {links.map(l => (
              <li key={l.href}>
                <a href={l.href} style={{
                  fontFamily: 'var(--mono)', color: 'var(--text2)',
                  textDecoration: 'none', fontSize: '.72rem', letterSpacing: '.1em',
                  transition: 'color .2s',
                }}
                onMouseEnter={e => { e.target.style.color = 'var(--accent)' }}
                onMouseLeave={e => { e.target.style.color = 'var(--text2)' }}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              {isAdmin ? (
                <CinBtn href="/admin">⚙ Admin</CinBtn>
              ) : (
                <CinBtn onClick={onLoginClick}>Login</CinBtn>
              )}
            </li>
          </ul>

          <button onClick={() => setMenuOpen(!menuOpen)} className="mob-btn" style={{
            background: 'none', border: 'none', color: 'var(--accent)', fontSize: '1.3rem', display: 'none',
          }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {menuOpen && (
          <div style={{ background: 'rgba(3,5,7,.98)', borderTop: '1px solid var(--border)', padding: '1.5rem 2.5rem' }}>
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
                display: 'block', color: 'var(--text)', textDecoration: 'none',
                padding: '.7rem 0', borderBottom: '1px solid var(--border)',
                fontFamily: 'var(--mono)', fontSize: '.85rem', letterSpacing: '.05em',
              }}>{l.label}</a>
            ))}
          </div>
        )}
      </nav>
      <style jsx>{`
        @media(max-width:768px){.nav-links{display:none!important}.mob-btn{display:block!important}}
      `}</style>
    </>
  )
}
