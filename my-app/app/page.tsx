"use client"
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Lights from "@/components/Lights";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";


export default function Home() {
  return (
    <>
      <Canvas shadows>
     
         <Experience />
         <Lights />
      </Canvas>


      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none">
        <Hero />
      </div>
 

    </>
  );
}
