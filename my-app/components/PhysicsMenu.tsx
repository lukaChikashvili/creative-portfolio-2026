"use client";

import { useEffect, useState } from "react";
import {
  Physics,
  RigidBody,
  CuboidCollider,
} from "@react-three/rapier";
import { RoundedBox, Text3D, Center } from "@react-three/drei";

const ITEMS = ["Home", "About", "Work", "Skills", "Contact"];

const H = Math.PI / 2;

const FACES: {
  pos: [number, number, number];
  rot: [number, number, number];
}[] = [
  { pos: [0, 0, 1], rot: [0, 0, 0] },
  { pos: [0, 0, -1], rot: [0, Math.PI, 0] },
  { pos: [1, 0, 0], rot: [0, H, 0] },
  { pos: [-1, 0, 0], rot: [0, -H, 0] },
  { pos: [0, 1, 0], rot: [-H, 0, 0] },
  { pos: [0, -1, 0], rot: [H, 0, 0] },
];

type CubeProps = {
  label: string;
  size: number;
  position: [number, number, number];
  delay: number;
  color: string;
  onSelect?: (label: string) => void;
};

const PhysicsCube = ({
  label,
  size,
  position,
  delay,
  color,
  onSelect,
}: CubeProps) => {
  const [spawned, setSpawned] = useState(false);

  const [initialRotation] = useState<[number, number, number]>(() => [
    Math.random() * 0.8,
    Math.random() * Math.PI,
    Math.random() * 0.8,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSpawned(true);
    }, delay);

    return () => {
      clearTimeout(timeout);
      document.body.style.cursor = "default";
    };
  }, [delay]);

  if (!spawned) return null;

  return (
    <RigidBody
      position={position}
      rotation={initialRotation}
      colliders={false}
      restitution={0.35}
      friction={0.8}
      linearDamping={0.1}
      angularDamping={0.5}
    >
      <CuboidCollider args={[size / 2, size / 2, size / 2]} />

      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(label);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <RoundedBox
          args={[size, size, size]}
          radius={size * 0.16}
          smoothness={8}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            color={color}
            transmission={0.85}
            thickness={size}
            roughness={0.05}
            ior={1.5}
            clearcoat={1}
            clearcoatRoughness={0}
            envMapIntensity={2}
            transparent
            opacity={0.55}
          />
        </RoundedBox>

        {FACES.map((face, index) => (
          <group
            key={index}
            position={[
              face.pos[0] * (size / 2 + 0.01),
              face.pos[1] * (size / 2 + 0.01),
              face.pos[2] * (size / 2 + 0.01),
            ]}
            rotation={face.rot}
          >
            <Center>
              <Text3D
                font="/helvetiker_regular.typeface.json"
                size={size * 0.17}
                height={size * 0.05}
                curveSegments={8}
                bevelEnabled
                bevelThickness={size * 0.008}
                bevelSize={size * 0.005}
                bevelSegments={2}
              >
                {label}
                <meshBasicMaterial color="white" />
              </Text3D>
            </Center>
          </group>
        ))}
      </group>
    </RigidBody>
  );
};

type PhysicsMenuProps = {
  onSelect?: (label: string) => void;
  cubeSize?: number;
  spacing?: number;
  dropHeight?: number;
  z?: number;
  startDelay?: number;
  color?: string;
};

const PhysicsMenu = ({
  onSelect,
  cubeSize = 2.5,
  spacing = 4,
  dropHeight = 12,
  z = 6,
  startDelay = 1200,
  color = "#FFF1F1",
}: PhysicsMenuProps) => {
  const floorY = -3;

  const roomWidth = 100;
  const roomDepth = 100;
  const wallHeight = 35;
  const wallThickness = 0.4;

  
  const glassMaterial = (
    <meshPhysicalMaterial
      color="#000000"                 
      transmission={10}          
      thickness={2.2}                
      roughness={0.08}                
      metalness={0.05}
      ior={1.45}
      clearcoat={1}
      clearcoatRoughness={0.05}
      envMapIntensity={4.5}           
      transparent
      opacity={0.35}
      side={2}                        
     
      emissive="#a8d4ff"
      emissiveIntensity={0.04}
    />
  );

  return (
    <Physics gravity={[0, -25, 0]}>
      <RigidBody type="fixed" friction={0.8} restitution={0.1}>
      
        <mesh
          position={[0, floorY, -10]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[roomWidth, roomDepth]} />
          {glassMaterial}
        </mesh>

        <CuboidCollider
          args={[roomWidth / 2, 0.1, roomDepth / 2]}
          position={[0, floorY, -10]}
        />

      
        <mesh
          position={[-roomWidth / 2, floorY + wallHeight / 2, -10]}
          receiveShadow
        >
          <boxGeometry args={[wallThickness, wallHeight, roomDepth]} />
          {glassMaterial}
        </mesh>
        <CuboidCollider
          args={[wallThickness / 2, wallHeight / 2, roomDepth / 2]}
          position={[-roomWidth / 2, floorY + wallHeight / 2, -10]}
        />

       
        <mesh
          position={[roomWidth / 2, floorY + wallHeight / 2, -10]}
          receiveShadow
        >
          <boxGeometry args={[wallThickness, wallHeight, roomDepth]} />
          {glassMaterial}
        </mesh>
        <CuboidCollider
          args={[wallThickness / 2, wallHeight / 2, roomDepth / 2]}
          position={[roomWidth / 2, floorY + wallHeight / 2, -10]}
        />

      
        <mesh
          position={[0, floorY + wallHeight / 2, -10 - roomDepth / 2]}
          receiveShadow
        >
          <boxGeometry args={[roomWidth, wallHeight, wallThickness]} />
          {glassMaterial}
        </mesh>
        <CuboidCollider
          args={[roomWidth / 2, wallHeight / 2, wallThickness / 2]}
          position={[0, floorY + wallHeight / 2, -10 - roomDepth / 2]}
        />

      
        <mesh
          position={[0, floorY + wallHeight / 2, -10 + roomDepth / 2]}
          receiveShadow
        >
          <boxGeometry args={[roomWidth, wallHeight, wallThickness]} />
          {glassMaterial}
        </mesh>
        <CuboidCollider
          args={[roomWidth / 2, wallHeight / 2, wallThickness / 2]}
          position={[0, floorY + wallHeight / 2, -10 + roomDepth / 2]}
        />
      </RigidBody>

      {ITEMS.map((label, index) => (
        <PhysicsCube
          key={label}
          label={label}
          size={cubeSize}
          color={color}
          position={[
            (index - (ITEMS.length - 1) / 2) * spacing,
            dropHeight + index * 1.5,
            z,
          ]}
          delay={startDelay + index * 180}
          onSelect={onSelect}
        />
      ))}
    </Physics>
  );
};

export default PhysicsMenu;