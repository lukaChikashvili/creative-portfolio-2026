"use client"

import { useState } from "react"
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Lights from "@/components/Lights";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Header3D from "@/components/Header";


export default function Home() {
  const [activeSection, setActiveSection] = useState("Home")

  return (
    <>
      <Canvas shadows>
        <OrbitControls />
         <Experience activeSection={activeSection} />
         <Lights />
         <Header3D onNavigate={setActiveSection} />
      </Canvas>


      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none">
        <Hero activeSection={activeSection} />
      </div>
 

    </>
  );
}