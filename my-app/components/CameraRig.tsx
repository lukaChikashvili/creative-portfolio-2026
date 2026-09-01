
"use client"
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'

export type CameraRigHandle = {
  flyTo: (
    position: [number, number, number],
    lookAt?: [number, number, number],
    duration?: number
  ) => void
}

type CameraRigProps = {
  
  controlsRef?: React.RefObject<any>
}

const CameraRig = forwardRef<CameraRigHandle, CameraRigProps>(function CameraRig(
  { controlsRef },
  ref
) {
  const { camera } = useThree()
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0))

  useImperativeHandle(
    ref,
    () => ({
      flyTo(position, lookAt = [0, 0, 0], duration = 1.5) {
        gsap.to(camera.position, {
          x: position[0],
          y: position[1],
          z: position[2],
          duration,
          ease: 'power3.inOut',
        })

        gsap.to(lookAtTarget.current, {
          x: lookAt[0],
          y: lookAt[1],
          z: lookAt[2],
          duration,
          ease: 'power3.inOut',
          onUpdate: () => {
            camera.lookAt(lookAtTarget.current)
          
            if (controlsRef?.current) {
              controlsRef.current.target.copy(lookAtTarget.current)
              controlsRef.current.update()
            }
          },
        })
      },
    }),
    [camera, controlsRef]
  )

  return null
})

export default CameraRig