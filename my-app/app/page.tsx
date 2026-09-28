"use client"
import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Experience from "@/components/Experience"
import Hero from "@/components/Hero"
import Lights from "@/components/Lights"
import Header3D from "@/components/Header"
import View3DToggle from "@/components/View3DToggle"

export default function Home() {
  const [activeSection, setActiveSection] = useState("Home");
  const [is3D, setIs3D] = useState(false);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black select-none">
    
      <Canvas shadows className="absolute inset-0 z-0">
        <OrbitControls  />
        <Experience activeSection={activeSection}  is3D={is3D} />
        <Lights />
        <Header3D
           is3D={is3D}
          onNavigate={setActiveSection}
            />
       
      </Canvas>

     
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none p-4">
       
        <Hero activeSection={activeSection}  is3D={is3D} />
        <View3DToggle is3D={is3D} onToggle={() => setIs3D((v) => !v)} />
      </div>
    </main>
  )
}