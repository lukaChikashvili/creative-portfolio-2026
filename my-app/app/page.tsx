"use client"
import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Experience from "@/components/Experience"
import Hero from "@/components/Hero"
import Lights from "@/components/Lights"
import Header3D from "@/components/Header"

export default function Home() {
  const [activeSection, setActiveSection] = useState("Home")

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black select-none">
    
      <Canvas shadows className="absolute inset-0 z-0">
        <OrbitControls />
        <Experience activeSection={activeSection} />
        <Lights />
        <Header3D onNavigate={setActiveSection} />
      </Canvas>

     
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none p-4">
       
        <Hero activeSection={activeSection} />
      </div>
    </main>
  )
}