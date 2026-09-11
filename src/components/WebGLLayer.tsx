import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getScrollProgress } from '../utils/scrollProgress'
interface DustFieldProps { count: number; color: string; size: number; opacity: number; speed: number }
function DustField({ count, color, size, opacity, speed }: DustFieldProps) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 32
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [count])
  const ref = useRef<THREE.Points>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * speed + getScrollProgress() * 0.4
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.12) * 0.04
  })
  return (<points ref={ref} geometry={geometry}><pointsMaterial color={color} size={size} transparent opacity={opacity} sizeAttenuation /></points>)
}
function Scene() {
  useFrame(({ camera }) => {
    const p = getScrollProgress()
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(p * Math.PI * 2) * 1.6, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.4 + p * 1.2, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8 - p * 1.5, 0.05)
    camera.lookAt(0, 0, 0)
  })
  return (<group><DustField count={900} color="#ff4d00" size={0.025} opacity={0.5} speed={0.018} /><DustField count={500} color="#ffffff" size={0.018} opacity={0.18} speed={-0.01} /></group>)
}
export function WebGLLayer() {
  return (<div className="webgl"><Canvas camera={{ position: [0, 0.4, 8], fov: 48 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}><Scene /></Canvas></div>)
}