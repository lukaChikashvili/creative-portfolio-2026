// components/Header3D.tsx
import { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'

type NavItem = {
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

type Header3DProps = {
  z?: number
  heightRatio?: number
  widthRatio?: number
  color?: string
  onNavigate?: (section: string) => void
}

const Header3D = ({
  z = -1,
  heightRatio = 0.022,
  widthRatio = 0.55,
  color = '#FFF1F1', onNavigate
}: Header3DProps) => {
  const { viewport } = useThree()

  const { barWidth, barHeight, y, buttonDiameter, buttonZ } = useMemo(() => {
    const distanceFactor = (6 - z) / 6
    const w = viewport.width * distanceFactor
    const h = viewport.height * distanceFactor
    const bh = w * heightRatio
    return {
      barWidth: w * widthRatio,
      barHeight: bh,
      y: h / 2 - bh * 2,
      buttonDiameter: bh * 1.7,
      buttonZ: z + 0.12,
    }
  }, [viewport, z, heightRatio, widthRatio])

  const positions = useMemo(() => {
    const count = NAV_ITEMS.length
    const usable = barWidth * 0.82
    const step = usable / (count - 1)
    const start = -usable / 2
    return NAV_ITEMS.map((_, i) => start + step * i)
  }, [barWidth])

  return (
    <group>
      
      <RoundedBox
        args={[barWidth, barHeight, 0.15]}
        radius={barHeight / 3}
        smoothness={10}
        position={[0, y, z]}
      >
        <meshPhysicalMaterial
          color={color}
          transmission={0.9}
          thickness={20}
          roughness={0.05}
          metalness={0}
          clearcoat={1}
          ior={3.5}
          transparent
        />
      </RoundedBox>

    
      {NAV_ITEMS.map((item, i) => (
        <group key={item.href} position={[positions[i], y, buttonZ]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[buttonDiameter / 1.9, 50, 50]} />
            <meshPhysicalMaterial
              color={color}
              transmission={1}
              thickness={1}
              roughness={0.15}
              metalness={0}
              clearcoat={1}
              ior={1.6}
              transparent
            />
          </mesh>
          <Html center transform={false} style={{ pointerEvents: 'auto' }}>
            
             <a href={item.href}
             onClick={(e) => {
                e.preventDefault() 
                onNavigate?.(item.label)
              }}
              className="text-[17px] font-medium text-white/90 hover:text-white whitespace-nowrap select-none transition-colors"
            >
              {item.label}
            </a>
          </Html>
        </group>
      ))}
    </group>
  )
}

export default Header3D