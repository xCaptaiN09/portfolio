import { useEffect, useState } from 'react'
export function IstClock() {
  const [time, setTime] = useState('--:--:--')
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    const tick = () => setTime(formatter.format(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  return <span>{time} IST</span>
}