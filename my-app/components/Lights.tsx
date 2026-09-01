import React from 'react'

const Lights = () => {
  return (
     <>
       <ambientLight intensity={-2} />

       <directionalLight
        position={[0, 5, 5]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />
     </>
  )
}

export default Lights
