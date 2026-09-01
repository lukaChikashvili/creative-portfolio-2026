"use client"
import { useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import DeformingGradientBackground from './WaterPlane'
import Header from './Header'
import CameraRig, { type CameraRigHandle } from './CameraRig'
import { Stars } from '@react-three/drei'

const SECTIONS: Record<string, { position: [number, number, number]; lookAt: [number, number, number]; planeOffset: number }> = {
  Home: { position: [0, 0, 5], lookAt: [0, 0, -10], planeOffset: 0 },
  About: { position: [0, 0, 8], lookAt: [50, 0, -10], planeOffset: -50 },
  Work: { position: [0, 0, 8], lookAt: [50, 0, -10], planeOffset: 50 },
  Skills: { position: [0, 0, 8], lookAt: [50, 0, -10], planeOffset: -100 },
}

const Experience = () => {
  const cameraRigRef = useRef<CameraRigHandle>(null)
  const plane1Ref = useRef<THREE.Mesh>(null)
  const plane2Ref = useRef<THREE.Mesh>(null)
  const plane3Ref = useRef<THREE.Mesh>(null)
  const plane4Ref = useRef<THREE.Mesh>(null)

  function handleNavigate(section: string) {
    const target = SECTIONS[section]
    const homeTarget = SECTIONS['Home']
    if (!target || !homeTarget) return

    
    const planes = [plane1Ref.current, plane2Ref.current, plane3Ref.current, plane4Ref.current]
    const planePositions = planes.map((p) => p?.position).filter(Boolean)

    gsap.killTweensOf(planePositions)

    const tl = gsap.timeline()


    cameraRigRef.current?.flyTo(target.position, target.lookAt, 1.5)

    
    tl.to(
      planePositions,
      {
        x: (index) => {
         
          const initialPositions = [0, 50, -50, 100]
          return target.planeOffset + initialPositions[index]
        },
        duration: 2,
        ease: 'power2.inOut',
      },
      '+=1.5'
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
      <DeformingGradientBackground ref={plane3Ref} position={[-50, 0, -10]} colorA="#2E2910" colorB="#F599C6" width={50} height={25} />
      <DeformingGradientBackground ref={plane4Ref} position={[100, 0, -10]} colorA="#66BB6A" colorB="#1B5E20" width={50} height={25} />

      <Header onNavigate={handleNavigate} />
      <Stars />
    </>
  )
}

export default Experience