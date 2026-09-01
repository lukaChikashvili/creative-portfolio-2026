import React from 'react'
import DeformingGradientBackground from './WaterPlane'
import Header from './Header'

const Experience = () => {
  return (
  <>
  <DeformingGradientBackground position={[0, 0, -10]} width={50} height={25} />
    <Header />
  </>
  )
}

export default Experience
