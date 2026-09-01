"use client"
import { useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import DeformingGradientBackground from './WaterPlane'
import Header from './Header'
import CameraRig, { type CameraRigHandle } from './CameraRig'

const SECTIONS: Record<string, { position: [number, number, number]; lookAt: [number, number, number]; planeOffset: number }> = {
  Home: { position: [0, 0, 5], lookAt: [0, 0, -10], planeOffset: 0 },
  About: { position: [0, 0, 8], lookAt: [50, 0, -10], planeOffset: -50 },
}

const Experience = () => {
  const cameraRigRef = useRef<CameraRigHandle>(null)
  const plane1Ref = useRef<THREE.Mesh>(null)
  const plane2Ref = useRef<THREE.Mesh>(null)

  function handleNavigate(section: string) {
    const target = SECTIONS[section]
    const homeTarget = SECTIONS['Home']
    if (!target || !homeTarget) return

    const tl = gsap.timeline()

  
    cameraRigRef.current?.flyTo(target.position, target.lookAt, 1.5)

  
    tl.to(
      [plane1Ref.current?.position, plane2Ref.current?.position],
      {
        x: (index) => (index === 0 ? target.planeOffset : target.planeOffset + 50),
        duration: 2,
        ease: 'power2.out',
      },
      '+=2.0' 
    )


    tl.call(() => {
      cameraRigRef.current?.flyTo(homeTarget.position, homeTarget.lookAt, 1.5)
    })
  }

  return (
    <>
      <CameraRig ref={cameraRigRef} />

      <DeformingGradientBackground ref={plane1Ref} position={[0, 0, -10]} width={50} height={25} />
      <DeformingGradientBackground ref={plane2Ref} position={[50, 0, -10]} colorA="#DF301C" width={50} height={25} />

      <Header onNavigate={handleNavigate} />
    </>
  )
}

export default Experience