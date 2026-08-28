"use client"
import Experience from "@/components/Experience";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";


export default function Home() {
  return (
    <>
      <Canvas>
        <OrbitControls />
         <Experience />
      </Canvas>

    </>
  );
}
