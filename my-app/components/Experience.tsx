import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const Experience = () => {
    
    const texture = useTexture('/texture.avif');

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(-10, -1 );


  return (
     <>
      <mesh position = {[0, 4.3, -2]}>
        <boxGeometry args = {[18, 1 ]}   />
         <meshBasicMaterial map={texture} />
      </mesh>
    </>
  )
}

export default Experience
