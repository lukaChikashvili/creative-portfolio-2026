"use client"
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'

type NavCube = {
  label: string
  offset: number
  color: string
}

const NAV_CUBES: NavCube[] = [
  { label: 'Home', offset: 0, color: '#249E94' },
  { label: 'About', offset: -50, color: '#E63946' },
  { label: 'Work', offset: 50, color: '#413333' },
  { label: 'Skills', offset: -100, color: '#FF9C4C' },
  { label: 'Contact', offset: 100, color: '#55E07E' },
]

const CUBE_SIZE = 3
const CUBE_Z = 4 

interface NavCubesProps {
  scale?: number
  onNavigate?: (section: string) => void
}

const NavCubes = ({ scale = 1, onNavigate }: NavCubesProps) => {
  const groupRefs = useRef<(THREE.Group | null)[]>([])
  const [hovered, setHovered] = useState<number | null>(null)

  const size = CUBE_SIZE * scale
  const baseY = size / 2 

  useFrame((state) => {
    groupRefs.current.forEach((g, i) => {
      if (!g) return
      g.rotation.y = state.clock.elapsedTime * 0.4 + i
      g.position.y = baseY + Math.sin(state.clock.elapsedTime * 1.5 + i) * 0.15 * scale

      const targetScale = hovered === i ? 1.15 : 1
      g.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15)
    })
  })

  return (
    <>
      {NAV_CUBES.map((cube, i) => (
        <group
          key={cube.label}
          ref={(el) => {
            groupRefs.current[i] = el
          }}
          position={[cube.offset * scale, baseY, CUBE_Z]}
        >
          <RoundedBox
            args={[size, size, size]}
            radius={0.25 * scale}
            smoothness={4}
            onClick={(e) => {
              e.stopPropagation()
              onNavigate?.(cube.label)
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHovered(i)
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              setHovered(null)
              document.body.style.cursor = 'auto'
            }}
          >
            <meshPhysicalMaterial
              color={cube.color}
              roughness={0.25}
              metalness={0.1}
              clearcoat={1}
              transmission={0.15}
              ior={1.4}
            />
          </RoundedBox>

          <Html center position={[0, size / 2 + 0.8, 0]} style={{ pointerEvents: 'none' }}>
            <div className="text-[15px] font-medium text-white/90 whitespace-nowrap select-none tracking-wide">
              {cube.label}
            </div>
          </Html>
        </group>
      ))}
    </>
  )
}

export default NavCubes