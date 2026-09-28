"use client"
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import DeformingGradientBackground from './WaterPlane'
import CameraRig, { type CameraRigHandle } from './CameraRig'
import { Stars } from '@react-three/drei'


const SECTIONS: Record<
  string,
  { position: [number, number, number]; lookAt: [number, number, number]; planeOffset: number }
> = {
  Home:    { position: [0, 0, 5], lookAt: [0, 0, -10],   planeOffset: 0 },
  About:   { position: [0, 0, 8], lookAt: [-50, 0, -10], planeOffset: -50 },
  Work:    { position: [0, 0, 8], lookAt: [50, 0, -10],  planeOffset: 50 },
  Skills:  { position: [0, 0, 8], lookAt: [-100, 0, -10],planeOffset: -100 },
  Contact: { position: [0, 0, 8], lookAt: [100, 0, -10], planeOffset: 100 },
}

const INITIAL_PLANE_POSITIONS = [0, 50, -50, 100, -100]

interface ExperienceProps {
  activeSection: string
  is3D?: boolean
  onSectionChange?: (section: string) => void
}

const FLOOR_CAMERA: { position: [number, number, number]; lookAt: [number, number, number] } = {
  position: [0, 9, 22],   
  lookAt: [0, -1, -35],  
}
const FLOOR_SCALE = 4;


const Experience = ({ activeSection,  is3D = false, onSectionChange  }: ExperienceProps) => {
  const cameraRigRef = useRef<CameraRigHandle>(null)
  const plane1Ref = useRef<THREE.Mesh>(null)
  const plane2Ref = useRef<THREE.Mesh>(null)
  const plane3Ref = useRef<THREE.Mesh>(null)
  const plane4Ref = useRef<THREE.Mesh>(null)
  const plane5Ref = useRef<THREE.Mesh>(null)

  const prevSection = useRef(activeSection)
  const isFirstRun = useRef(true)
  const currentOffsetRef = useRef(0);

  const getPlanes = () =>
  [plane1Ref, plane2Ref, plane3Ref, plane4Ref, plane5Ref]
    .map((r) => r.current)
    .filter(Boolean) as THREE.Mesh[]

    useEffect(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false
        prevSection.current = activeSection
        return
      }
  
      if (prevSection.current === activeSection) return
      prevSection.current = activeSection
  
      const target = SECTIONS[activeSection]
      const homeTarget = SECTIONS['Home']
      if (!target || !homeTarget) return
  
      currentOffsetRef.current = target.planeOffset
  
      const planes = getPlanes()
      const planePositions = planes.map((p) => p.position)
      const scale = is3D ? FLOOR_SCALE : 1
  
      gsap.killTweensOf(planePositions)
  
      const tl = gsap.timeline()
  
      tl.call(() => {
        cameraRigRef.current?.flyTo(target.position, target.lookAt, 1.2)
      })
  
      tl.to(
        planePositions,
        {
          x: (index) => (target.planeOffset + INITIAL_PLANE_POSITIONS[index]) * scale,
          duration: 2,
          delay: 1,
          ease: 'power2.inOut',
        },
        '<0.5'
      )
  
      tl.call(
        () => {
          cameraRigRef.current?.flyTo(homeTarget.position, homeTarget.lookAt, 1)
        },
        undefined,
        '+=1.4'
      )
  
      return () => {
        tl.kill()
      }
    }, [activeSection])
  
    useEffect(() => {
      const planes = getPlanes()
      gsap.killTweensOf(planes.map((p) => p.rotation))
      gsap.killTweensOf(planes.map((p) => p.scale))
      gsap.killTweensOf(planes.map((p) => p.position))
  
      const offset = currentOffsetRef.current
  
      if (is3D) {
        cameraRigRef.current?.flyTo(FLOOR_CAMERA.position, FLOOR_CAMERA.lookAt, 2)
  
        planes.forEach((plane, i) => {
          gsap.to(plane.rotation, {
            x: -Math.PI / 2,
            duration: 1.6,
            delay: i * 0.05,
            ease: 'power3.inOut',
          })
          gsap.to(plane.scale, {
            x: FLOOR_SCALE,
            y: FLOOR_SCALE,
            z: FLOOR_SCALE,
            duration: 1.6,
            delay: i * 0.05,
            ease: 'power3.inOut',
          })
          gsap.to(plane.position, {
            x: (offset + INITIAL_PLANE_POSITIONS[i]) * FLOOR_SCALE,
            duration: 1.6,
            delay: i * 0.05,
            ease: 'power3.inOut',
          })
        })
      } else {
        const home = SECTIONS['Home']
        cameraRigRef.current?.flyTo(home.position, home.lookAt, 1.5)
  
        planes.forEach((plane, i) => {
          gsap.to(plane.rotation, {
            x: 0,
            duration: 1.2,
            delay: i * 0.04,
            ease: 'power3.inOut',
          })
          gsap.to(plane.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1.2,
            delay: i * 0.04,
            ease: 'power3.inOut',
          })
          gsap.to(plane.position, {
            x: offset + INITIAL_PLANE_POSITIONS[i],
            duration: 1.2,
            delay: i * 0.04,
            ease: 'power3.inOut',
          })
        })
      }
    }, [is3D])

  return (
    <>
      <CameraRig ref={cameraRigRef} />

      <DeformingGradientBackground ref={plane1Ref} position={[0, 0, -10]} colorA='#249E94' colorB='#005461' glowColor='#FFF6F6' width={50} height={25} />
      <DeformingGradientBackground ref={plane2Ref} position={[50, 0, -10]} colorA="#E63946" colorB='#224248' width={50} height={25} />
      <DeformingGradientBackground ref={plane3Ref} position={[-50, 0, -10]} colorA="#413333" colorB="#91008D" width={50} height={25} />
      <DeformingGradientBackground ref={plane4Ref} position={[100, 0, -10]} colorA="#FF9C4C" colorB="#60241E" glowColor='#1D2128' width={50} height={25} />
      <DeformingGradientBackground ref={plane5Ref} position={[-100, 0, -10]} colorA="#55E07E" colorB="#4E1F6E" glowColor='#FFD400' width={50} height={25} />
     

    {is3D && <Stars />}
     
    </>
  )
}

export default Experience