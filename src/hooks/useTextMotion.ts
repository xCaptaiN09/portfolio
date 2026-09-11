import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export function useTextMotion() {
  useEffect(() => {
    const statementWords = document.querySelectorAll('.st-word')
    let statementTween: gsap.core.Tween | null = null
    if (statementWords.length > 0) {
      statementTween = gsap.fromTo(statementWords, { opacity: 0.22 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top 65%', end: 'bottom 55%', scrub: 0.6 } })
    }
    const heads = Array.from(document.querySelectorAll<HTMLElement>('h2.pull-words'))
    const headTweens: gsap.core.Tween[] = []
    heads.forEach((head) => {
      const walker = document.createTreeWalker(head, NodeFilter.SHOW_TEXT)
      const textNodes: Text[] = []
      while (walker.nextNode()) { textNodes.push(walker.currentNode as Text) }
      const spans: HTMLSpanElement[] = []
      textNodes.forEach((node) => {
        const parts = node.textContent?.split(/(\s+)/) ?? []
        const frag = document.createDocumentFragment()
        parts.forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return }
          const span = document.createElement('span')
          span.className = 'pull-word'
          span.textContent = part
          frag.appendChild(span)
          spans.push(span)
        })
        node.parentNode?.replaceChild(frag, node)
      })
      if (spans.length > 0) {
        headTweens.push(gsap.fromTo(spans, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'power3.out', immediateRender: false, scrollTrigger: { trigger: head, start: 'top 85%', once: true } }))
      }
    })
    return () => {
      statementTween?.scrollTrigger?.kill()
      statementTween?.kill()
      headTweens.forEach((tween) => { tween.scrollTrigger?.kill(); tween.kill() })
    }
  }, [])
}