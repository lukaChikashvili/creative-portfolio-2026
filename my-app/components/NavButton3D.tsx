import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface NavButton3DProps {
  label: string
  position: [number, number, number]
  size?: [number, number, number]
  onClick?: () => void
  onPointerEnter?: () => void
  onPointerLeave?: () => void
  baseColor?: string
  hoverColor?: string
}

export default function NavButton3D({
  label,
  position,
  size = [3, 0.9, 0.4],
  onClick,
  onPointerEnter,
  onPointerLeave,
  baseColor = '#FF9292',
  hoverColor = '#22d3ee',
}: NavButton3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [, setClicked] = useState(false)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const material = meshRef.current.material as THREE.MeshStandardMaterial

    const targetIntensity = hovered ? 1.2 : 0.15
    material.emissiveIntensity = THREE.MathUtils.damp(
      material.emissiveIntensity,
      targetIntensity,
      8,
      delta
    )

    const targetScale = hovered ? 1.06 : 1
    const s = THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 10, delta)
    meshRef.current.scale.setScalar(s)
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
          onPointerEnter?.()
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
          document.body.style.cursor = 'auto'
          onPointerLeave?.()
        }}
        onClick={(e) => {
          e.stopPropagation()
          setClicked(true)
          onClick?.()
          setTimeout(() => setClicked(false), 150)
        }}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={baseColor}
          emissive={new THREE.Color(hoverColor)}
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      <Text
        position={[0, 0, size[2] / 2 + 0.01]}
        fontSize={0.28}
        color={hovered ? hoverColor : '#e5e7eb'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        {label.toUpperCase()}
      </Text>
    </group>
  )
}