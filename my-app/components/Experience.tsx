
"use client"
import { useRef } from 'react'
import DeformingGradientBackground from './WaterPlane'
import Header from './Header'
import CameraRig, { type CameraRigHandle } from './CameraRig'

const SECTIONS: Record<string, { position: [number, number, number]; lookAt: [number, number, number] }> = {
  Home: { position: [0, 0, 6], lookAt: [0, 0, -10] },
  About: { position: [50, 0, 6], lookAt: [50, 0, -10] },
}

const Experience = () => {
  const cameraRigRef = useRef<CameraRigHandle>(null)

  function handleNavigate(section: string) {
    const target = SECTIONS[section]
    if (!target) return
    cameraRigRef.current?.flyTo(target.position, target.lookAt)
  }

  return (
    <>
      <CameraRig ref={cameraRigRef} />

      <DeformingGradientBackground position={[0, 0, -10]} width={50} height={25} />
      <DeformingGradientBackground position={[50, 0, -10]} colorA="#DF301C" width={50} height={25} />

      <Header onNavigate={handleNavigate} />
    </>
  )
}

export default Experience