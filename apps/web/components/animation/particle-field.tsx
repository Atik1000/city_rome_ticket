"use client"

import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

// Warm brand tones: antique gold, light gold, a hint of ivory.
const EMBER_COLORS = ["#c8963e", "#e3c88f", "#f3ebdd"]

// Soft round glow sprite so points read as dust/embers, not squares.
function makeSpriteTexture() {
  const size = 64
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, "rgba(255,255,255,1)")
  gradient.addColorStop(0.35, "rgba(255,255,255,0.55)")
  gradient.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function Particles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  const texture = useMemo(() => makeSpriteTexture(), [])
  useEffect(() => () => texture.dispose(), [texture])

  // The canvas wrapper is pointer-events-none, so track the mouse on window.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  const { positions, colors, base, speeds, sway, phase, halfW, halfH } = useMemo(() => {
    const halfW = Math.max(viewport.width, 12) / 2 + 1
    const halfH = Math.max(viewport.height, 8) / 2 + 1
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const base = new Float32Array(count)
    const speeds = new Float32Array(count)
    const sway = new Float32Array(count)
    const phase = new Float32Array(count)
    const color = new THREE.Color()
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * halfW
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * halfH
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * 3 // subtle depth
      base[i] = positions[i * 3]
      speeds[i] = 0.08 + Math.random() * 0.22 // slow upward drift
      sway[i] = 0.2 + Math.random() * 0.5
      phase[i] = Math.random() * Math.PI * 2
      color.set(EMBER_COLORS[i % EMBER_COLORS.length])
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    return { positions, colors, base, speeds, sway, phase, halfW, halfH }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const geometry = pointsRef.current?.geometry
    if (geometry) {
      const pos = geometry.attributes.position as THREE.BufferAttribute
      const arr = pos.array as Float32Array
      for (let i = 0; i < count; i++) {
        let y = arr[i * 3 + 1] + speeds[i] * dt
        if (y > halfH) y = -halfH
        arr[i * 3 + 1] = y
        arr[i * 3] = base[i] + Math.sin(t * 0.3 + phase[i]) * sway[i]
      }
      pos.needsUpdate = true
    }
    // Slight mouse parallax, eased.
    const group = groupRef.current
    if (group) {
      group.position.x += (mouse.current.x * 0.45 - group.position.x) * 0.04
      group.position.y += (mouse.current.y * 0.3 - group.position.y) * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={texture}
          vertexColors
          transparent
          opacity={0.7}
          size={0.16}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  )
}

export default function ParticleField({
  count = 220,
  active = true,
}: {
  count?: number
  active?: boolean
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
    >
      <Particles count={count} />
    </Canvas>
  )
}
