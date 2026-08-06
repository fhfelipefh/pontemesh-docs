import { useEffect, type RefObject } from 'react'
import { animate } from 'animejs/animation'
import { createScope } from 'animejs/scope'
import { set, stagger } from 'animejs/utils'

export function usePageAnimations(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const scope = createScope({
      root,
      mediaQueries: {
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
    }).add((currentScope) => {
      if (!currentScope || currentScope.matches.reduceMotion) return

      const heroItems = root.querySelectorAll('.motion-hero-item')
      const heroVisual = root.querySelector('.hero__visual')
      const revealItems = root.querySelectorAll<HTMLElement>('.motion-reveal')

      set(heroItems, { opacity: 0, y: 22 })
      set(revealItems, { opacity: 0, y: 30 })
      if (heroVisual) set(heroVisual, { opacity: 0, x: 28 })

      animate(heroItems, {
        opacity: 1,
        y: 0,
        delay: stagger(90),
        duration: 720,
        ease: 'out(3)',
      })

      if (heroVisual) {
        animate(heroVisual, {
          opacity: 1,
          x: 0,
          duration: 950,
          delay: 160,
          ease: 'out(4)',
        })
      }

      animate('.mesh-diagram__rings circle', {
        strokeDashoffset: [0, -34],
        opacity: [.16, .34],
        delay: stagger(180),
        duration: 4200,
        alternate: true,
        loop: true,
        ease: 'linear',
      })

      animate('.mesh-diagram__data path', {
        strokeDashoffset: [0, -30],
        duration: 2200,
        loop: true,
        ease: 'linear',
      })

      animate('.mesh-diagram__fragments rect', {
        opacity: [.4, 1],
        delay: stagger(110),
        duration: 1350,
        alternate: true,
        loop: true,
        ease: 'inOut(2)',
      })

      animate('.route-divider span', {
        x: [-8, 8],
        delay: stagger(100),
        duration: 2600,
        alternate: true,
        loop: true,
        ease: 'inOut(2)',
      })

      animate('.release-visual__fragments rect', {
        opacity: [.45, 1],
        delay: stagger(160),
        duration: 1500,
        alternate: true,
        loop: true,
        ease: 'inOut(2)',
      })

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          currentScope.execute(() => {
            animate(entry.target, {
              opacity: 1,
              y: 0,
              duration: 760,
              ease: 'out(3)',
            })
          })
          observer.unobserve(entry.target)
        })
      }, { threshold: .16 })

      revealItems.forEach((item) => observer.observe(item))
      return () => observer.disconnect()
    })

    return () => scope.revert()
  }, [rootRef])
}
