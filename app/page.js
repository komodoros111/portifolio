'use client'
import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import HackerIntro from './components/HackerIntro'
import LoginModal from './components/LoginModal'
import NeuralHero from './components/NeuralHero'
import NeuralIdeas from './components/NeuralIdeas'
import NeuralTransition from './components/NeuralTransition'

export default function Home() {
  const dotRef  = useRef(null)

  const [phase, setPhase] = useState('hacker') // hacker → neural → site
  const [showLogin, setShowLogin] = useState(false)
  const [isAdmin,   setIsAdmin]   = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('rchiy_token')
    if (t) setIsAdmin(true)
  }, [])

  // custom cursor
  useEffect(() => {
    const dot  = dotRef.current
    let mx = 0, my = 0

    const move = e => {
      mx = e.clientX; my = e.clientY
      if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px' }
    }
    const hover = e => {
      const el = e.target
      const on = el.matches('a,button,input,textarea,select,[role="button"]') || !!el.closest('a,button')
      document.body.classList.toggle('hovered', on)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', hover)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', hover)
    }
  }, [])

  return (
    <>
      <div id="cur-dot" ref={dotRef}/>

      {/* Phase 1 — hacker terminal */}
      {phase === 'hacker' && (
        <HackerIntro onDone={() => setPhase('neural')} />
      )}

      {/* Phase 2 — neural network + light beam transition */}
      {phase === 'neural' && (
        <NeuralTransition onDone={() => setPhase('site')} />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => { setIsAdmin(true); setShowLogin(false) }}
        />
      )}

      {/* Phase 3 — actual site */}
      {phase === 'site' && (
        <>
          <Navbar onLoginClick={() => setShowLogin(true)} isAdmin={isAdmin}/>
          <main>
            <Hero/>
            <NeuralHero/>
            <About/>
            <NeuralIdeas/>
            <Skills/>
            <Services/>
            <Portfolio/>
            <Pricing/>
            <Contact/>
          </main>
          <Footer/>
        </>
      )}
    </>
  )
}
