import NavButton3D from './NavButton3D'

export interface NavItem {
  label: string
  onClick?: () => void
  onPointerEnter?: () => void
  onPointerLeave?: () => void
  baseColor?: string
  hoverColor?: string
}

interface NavBar3DProps {
  items: NavItem[]
  position?: [number, number, number]
  gap?: number
  buttonSize?: [number, number, number]
}

export default function NavBar3D({
  items,
  position = [0, 4.3, -2],
  gap = 0.4,
  buttonSize = [2.6, 0.9, 0.4],
}: NavBar3DProps) {
  const totalWidth = items.length * buttonSize[0] + (items.length - 1) * gap
  const startX = -totalWidth / 2 + buttonSize[0] / 2

  return (
    <group position={position}>
      {items.map((item, i) => (
        <NavButton3D
          key={item.label}
          label={item.label}
          position={[startX + i * (buttonSize[0] + gap), 0, 0]}
          size={buttonSize}
          onClick={item.onClick}
          onPointerEnter={item.onPointerEnter}
          onPointerLeave={item.onPointerLeave}
          baseColor={item.baseColor}
          hoverColor={item.hoverColor}
        />
      ))}
    </group>
  )
}