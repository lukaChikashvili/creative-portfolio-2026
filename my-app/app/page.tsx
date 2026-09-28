"use client"
import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Experience from "@/components/Experience"
import Hero from "@/components/Hero"
import Lights from "@/components/Lights"
import Header3D from "@/components/Header"

import { Physics } from "@react-three/rapier"

export default function Home() {
  const [activeSection, setActiveSection] = useState("Home");
  const [is3D, setIs3D] = useState(false);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black select-none">
    
      <Canvas shadows className="absolute inset-0 z-0" >
        <Physics>
        <OrbitControls
  minPolarAngle={Math.PI / 3}
  maxPolarAngle={Math.PI / 2}
  minAzimuthAngle={-Math.PI / 4}
  maxAzimuthAngle={Math.PI / 4}
/>
        <Experience activeSection={activeSection}  is3D={is3D} />
        <Lights />
        <Header3D
           is3D={is3D}
          onNavigate={setActiveSection}
            />
       </Physics>
      </Canvas>

     
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none p-4">
       
        <Hero activeSection={activeSection}  is3D={is3D} />
     
      </div>
    </main>
  )
}