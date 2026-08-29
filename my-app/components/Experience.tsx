import { useState } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import NavBar3D from './NavBar3D'
import FurPlane from './Furcreature'
import Sphere from './Sphere'

const Experience = () => {
  const textures = useTexture([
    '/background.avif',
     '/background2.jpg',
     '/background3.jpg',
     '/background4.avif',
     '/background5.avif'
  ])

  textures.forEach((tex) => {
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(10, 10)
  })

  const [activeTexture, setActiveTexture] = useState<THREE.Texture>(textures[0])

  return (
    <>
      <NavBar3D
        items={[
          {
            label: 'Home',
            baseColor: '#2563eb',
            hoverColor: '#60a5fa',
            onPointerEnter: () => setActiveTexture(textures[1]),
            onPointerLeave: () => setActiveTexture(textures[0]),
            onClick: () => {},
          },
          {
            label: 'About',
            baseColor: '#10b981',
            hoverColor: '#34d399',
            onPointerEnter: () => setActiveTexture(textures[2]),
            onPointerLeave: () => setActiveTexture(textures[0]),
            onClick: () => {},
          },
          {
            label: 'Work',
            baseColor: '#f59e0b',
            hoverColor: '#fbbf24',
            onPointerEnter: () => setActiveTexture(textures[3]),
            onPointerLeave: () => setActiveTexture(textures[0]),
            onClick: () => {},
          },
          {
            label: 'Contact Us',
            baseColor: '#ec4899',
            hoverColor: '#f472b6',
            onPointerEnter: () => setActiveTexture(textures[4]),
            onPointerLeave: () => setActiveTexture(textures[0]),
            onClick: () => {},
          },
        ]}
      />

      <FurPlane
        map={activeTexture}
        position={[0, 0, -9]}
        width={45}
        height={40}
        furLength={0.35}
        noiseRepeat={60}
      />

    <Sphere zPosition={-6} radius={1} />
    </>
  )
}

export default Experience