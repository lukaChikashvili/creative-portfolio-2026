"use client"
import Experience from "@/components/Experience";
import Lights from "@/components/Lights";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";


export default function Home() {
  return (
    <>
      <Canvas shadows>
        <OrbitControls />
         <Experience />
         <Lights />
      </Canvas>

    </>
  );
}
