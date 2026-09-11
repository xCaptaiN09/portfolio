export function ScrollRing() {
  return (
    <div className="scroll-ring" aria-hidden="true">
      <svg viewBox="0 0 118 118">
        <defs><path id="circlePath" d="M 59, 59 m -46, 0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" /></defs>
        <text fill="currentColor" fontSize="8" fontFamily="Geist Mono" fontWeight="700"><textPath href="#circlePath">SCROLL DOWN • KERNEL SPACE • SCROLL DOWN • KERNEL SPACE •</textPath></text>
      </svg>
      <span>↓</span>
    </div>
  )
}