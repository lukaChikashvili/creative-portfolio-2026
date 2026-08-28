import React from 'react'

const Lights = () => {
  return (
     <>
       <ambientLight intensity={0.07} />

       <directionalLight
        position={[0, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />
     </>
  )
}

export default Lights
