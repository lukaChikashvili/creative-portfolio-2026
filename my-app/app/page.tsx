"use client"
import Experience from "@/components/Experience";
import { Canvas } from "@react-three/fiber";


export default function Home() {
  return (
    <>
      <Canvas>
         <Experience />
      </Canvas>

    </>
  );
}
