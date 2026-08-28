import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import NavBar3D from './NavBar3D'

const Experience = () => {
  const background = useTexture('/background.avif')

  background.wrapS = THREE.RepeatWrapping
  background.wrapT = THREE.RepeatWrapping
  background.repeat.set(6, 6)

  return (
    <>
    <NavBar3D
  items={[
    {
      label: 'Home',
      baseColor: '#2563eb',
      hoverColor: '#60a5fa',
      onClick: () => console.log('go home'),
    },
    {
      label: 'About',
      baseColor: '#10b981',
      hoverColor: '#34d399',
      onClick: () => console.log('go about'),
    },
    {
      label: 'Work',
      baseColor: '#f59e0b',
      hoverColor: '#fbbf24',
      onClick: () => console.log('go work'),
    },
    {
      label: 'Contact Us',
      baseColor: '#ec4899',
      hoverColor: '#f472b6',
      onClick: () => console.log('go contact'),
    },
  ]}
/>

      <mesh position={[0, 0, -4]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial map={background} />
      </mesh>
    </>
  )
}

export default Experience