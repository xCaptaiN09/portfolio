import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useTextMotion() {
  useEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.st-word', { opacity: 0.65 }, {
        opacity: 1, stagger: 0.05, ease: 'none',
        scrollTrigger: { trigger: '.statement', start: 'top 65%', end: 'bottom 55%', scrub: 0.6 },
      })
      const wrapped: HTMLSpanElement[] = []
      for (const heading of document.querySelectorAll('h2.pull-words')) {
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT)
        const nodes: Text[] = []
        while (walker.nextNode()) nodes.push(walker.currentNode as Text)
        const words: HTMLSpanElement[] = []
        for (const node of nodes) {
          const fragment = document.createDocumentFragment()
          for (const part of node.data.split(/(\s+)/)) {
            if (!part.trim()) { fragment.append(part); continue }
            const word = document.createElement('span')
            word.className = 'pull-word'
            word.textContent = part
            fragment.append(word)
            words.push(word)
          }
          node.replaceWith(fragment)
        }
        wrapped.push(...words)
        gsap.fromTo(words, { y: 26, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
        })
      }
      return () => wrapped.forEach(word => word.replaceWith(word.textContent || ''))
    })
    return () => media.revert()
  }, [])
}
