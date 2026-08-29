import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SphereProps {
  zPosition?: number
  radius?: number
  color?: string
  delay?: number
}

const Sphere = ({ zPosition = 0, radius = 0.08, color = 'gold', delay = 0.04 }: SphereProps) => {
  const sphereRef = useRef<THREE.Mesh>(null!)
  const targetPos = useRef(new THREE.Vector3(0, 0, zPosition))
  const currentPos = useRef(new THREE.Vector3(0, 0, zPosition))

  const raycaster = useRef(new THREE.Raycaster())
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), -zPosition))
  const intersection = useRef(new THREE.Vector3())

  useFrame(({ camera, pointer }) => {
    raycaster.current.setFromCamera(pointer, camera)
    raycaster.current.ray.intersectPlane(plane.current, intersection.current)
    targetPos.current.set(intersection.current.x, intersection.current.y, zPosition)

    const prevPos = currentPos.current.clone()
    currentPos.current.lerp(targetPos.current, delay)
    sphereRef.current.position.copy(currentPos.current)

    const delta = new THREE.Vector3().subVectors(currentPos.current, prevPos)
    const distance = delta.length()

    if (distance > 0.0001) {
      const normal = new THREE.Vector3(0, 0, 1)
      const axis = new THREE.Vector3().crossVectors(normal, delta).normalize()
      const angle = distance / radius

      const quat = new THREE.Quaternion().setFromAxisAngle(axis, angle)
      sphereRef.current.quaternion.premultiply(quat)
    }
  })

  return (
    <mesh ref={sphereRef} position={[0, 0, zPosition]}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default Sphere