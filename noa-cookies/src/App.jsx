import { startTransition, useEffect, useRef, useState } from 'react'
import site from './config/site.js'
import { EASE, ScrollTrigger, gsap, initSmoothScroll, prefersReducedMotion, useGSAP } from './lib/motion.js'
import { refreshAvailability } from './services/catalog.js'
import { Header } from './components/Header.jsx'
import { Hero } from './components/hero/Hero.jsx'
import { Catalog } from './components/catalog/Catalog.jsx'
import { Featured } from './components/Featured.jsx'
import { Footer } from './components/Footer.jsx'
import { CartButton } from './components/cart/CartButton.jsx'
import { CartSheet } from './components/cart/CartSheet.jsx'
import { InfoSheet } from './components/InfoSheet.jsx'
import { LiveRegion } from './components/LiveRegion.jsx'
import { DemoBar } from './components/DemoBar.jsx'
import { Toast } from './components/Toast.jsx'

export default function App() {
  const rootRef = useRef(null)
  // El hero se monta primero y queda listo para comprar. Lo que está bajo el
  // pliegue se renderiza después, en trozos pequeños que no bloquean los toques.
  const [below, setBelow] = useState(false)
  useEffect(() => {
    startTransition(() => setBelow(true))
  }, [])

  useEffect(() => initSmoothScroll(), [])
  useEffect(() => {
    refreshAvailability()
  }, [])

  // Apariciones al hacer scroll: una por bloque, una sola vez.
  useGSAP(
    () => {
      // En modo demostración la página se muestra completa en reposo, sin
      // esperar al scroll (así se ve entera en una vista previa o miniatura).
      if (!below || site.demo || prefersReducedMotion()) return
      document.documentElement.classList.add('has-motion')

      gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll('[data-reveal-item]')
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: EASE.outStrong,
            stagger: 0.07,
            clearProps: 'transform',
            scrollTrigger: { trigger: group, start: 'top 84%', once: true },
          },
        )
      })
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: EASE.outStrong, clearProps: 'transform', scrollTrigger: { trigger: el, start: 'top 86%', once: true } },
        )
      })

      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh)
      document.fonts?.ready.then(refresh)
      return () => {
        window.removeEventListener('load', refresh)
        document.documentElement.classList.remove('has-motion')
      }
    },
    { scope: rootRef, dependencies: [below], revertOnUpdate: true },
  )

  return (
    <div ref={rootRef} id="top" className="site">
      <a className="skip-link" href="#menu">
        Ir al menú
      </a>
      {site.demo && <DemoBar />}
      <Header />
      <CartButton />
      <main>
        <Hero />
        {below ? (
          <>
            <Catalog />
            <Featured />
          </>
        ) : (
          // Mismo borde crema asomando bajo el hero mientras llega el catálogo.
          <section id="menu" className="shop paper shop--pending" aria-hidden="true" />
        )}
      </main>
      {below && (
        <>
          <Footer />
          <CartSheet />
          <InfoSheet />
        </>
      )}
      <LiveRegion />
      <Toast />
    </div>
  )
}
