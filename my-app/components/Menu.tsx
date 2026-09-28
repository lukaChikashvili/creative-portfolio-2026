"use client";

import React from "react";
import { Text3D } from "@react-three/drei";

const Menu = () => {
  const links = [
    {
      id: 1,
      title: "Home",
      position: [-3, 1, 0] as [number, number, number],
      rotation: [0, 0.2, 0] as [number, number, number],
    },
    {
      id: 2,
      title: "About",
      position: [0, 0, 0] as [number, number, number],
      rotation: [0.2, 0, -0.1] as [number, number, number],
    },
    {
      id: 3,
      title: "Work",
      position: [3, -1, 0] as [number, number, number],
      rotation: [-0.1, -0.3, 0.2] as [number, number, number],
    },
  ];

  return (
    <>
      {links.map((link) => (
        <Text3D
          key={link.id}
          font="/helvetiker_regular.typeface.json"
          position={link.position}
          rotation={link.rotation}
          size={0.7}
          height={0.15}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.01}
          bevelSegments={3}
        >
          {link.title}
          <meshStandardMaterial color="white" />
        </Text3D>
      ))}
    </>
  );
};

export default Menu;
