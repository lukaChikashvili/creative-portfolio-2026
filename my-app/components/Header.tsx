"use client";

import { useRef, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text3D, Center, Text } from "@react-three/drei";
import * as THREE from "three";

type NavItem = {
  label: string;
  href: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "#home",
    position: [-4, 0, 0],
    rotation: [0, 0.15, 0],
  },
  {
    label: "About",
    href: "#about",
    position: [-2, 0.3, 0],
    rotation: [0, -0.1, 0],
  },
  {
    label: "Work",
    href: "#work",
    position: [0, -0.2, 0],
    rotation: [0, 0.15, 0],
  },
  {
    label: "Skills",
    href: "#skills",
    position: [2, 0.25, 0],
    rotation: [0, -0.15, 0],
  },
  {
    label: "Contact",
    href: "#contact",
    position: [4, 0, 0],
    rotation: [0, 0.1, 0],
  },
];

type Header3DProps = {
  z?: number;
  color?: string;
  is3D?: boolean;
  onNavigate?: (section: string) => void;
};

const Header3D = ({
  z = -1,
  color = "#FFF1F1",
  is3D = false,
  onNavigate,
}: Header3DProps) => {
  const { viewport } = useThree();

  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const panelRef = useRef<THREE.Group>(null);

  const progress = useRef(0);


  const barWidth = viewport.width * 0.55;
  const barHeight = viewport.width * 0.012;

  const y = viewport.height / 2 - barHeight * 2;

  const panelWidth = barWidth * 0.6;
  const panelHeight = barHeight * 3.2;

  const gap = panelWidth / NAV_ITEMS.length;

  const fontSize = barHeight * 1.1;


  const openMenu = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    setOpen(true);
  }, []);



  const closeMenu = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }

    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setActiveIdx(null);
    }, 120);
  }, []);

  useFrame((_, delta) => {
    progress.current = THREE.MathUtils.damp(
      progress.current,
      open ? 1 : 0,
      10,
      delta
    );

    const p = progress.current;

    if (!panelRef.current) return;

    panelRef.current.visible = p > 0.01;

    panelRef.current.scale.set(
      0.85 + 0.15 * p,
      p,
      1
    );

    panelRef.current.position.y =
      y -
      barHeight * 0.6 -
      panelHeight * 0.5 * p;
  });

  return (
    <group position={[0, 0, z]}>


      {!is3D && (
        <mesh
          position={[
            0,
            y - panelHeight / 2,
            0.1,
          ]}
          onPointerOver={(e) => {
            e.stopPropagation();
            openMenu();
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            closeMenu();
          }}
        >
          <planeGeometry
            args={[
              barWidth,
              panelHeight + barHeight * 2,
            ]}
          />

          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      )}

    

      <RoundedBox
        args={[
          barWidth,
          barHeight,
          0.15,
        ]}
        radius={barHeight / 3}
        smoothness={10}
        position={[0, y, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();

          if (!is3D) {
            openMenu();
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation();

          if (!is3D) {
            closeMenu();
          }
        }}
      >
        <meshPhysicalMaterial
          color={color}
          transmission={0.9}
          thickness={20}
          roughness={0.05}
          metalness={0}
          clearcoat={1}
          ior={3.5}
          transparent
        />
      </RoundedBox>



      {!is3D && (
        <group
          ref={panelRef}
          visible={false}
          onPointerOver={(e) => {
            e.stopPropagation();
            openMenu();
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            closeMenu();
          }}
        >
     

          <RoundedBox
            args={[
              panelWidth,
              panelHeight,
              0.12,
            ]}
            radius={panelHeight / 2.5}
            smoothness={10}
          >
            <meshPhysicalMaterial
              color={color}
              transmission={0.95}
              thickness={8}
              roughness={0.1}
              metalness={0}
              clearcoat={1}
              ior={1.6}
              transparent
              opacity={0.95}
            />
          </RoundedBox>

     

          {NAV_ITEMS.map((item, i) => (
            <Text
              key={item.href}
              position={[
                -panelWidth / 2 +
                  gap * (i + 0.5),
                0,
                0.09,
              ]}
              fontSize={fontSize}
              color={
                activeIdx === i
                  ? "#ffffff"
                  : "#e6f2f0"
              }
              fillOpacity={
                activeIdx === null ||
                activeIdx === i
                  ? 1
                  : 0.6
              }
              anchorX="center"
              anchorY="middle"
              onClick={(e) => {
                e.stopPropagation();

                onNavigate?.(item.label);

                setOpen(false);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();

                openMenu();
                setActiveIdx(i);

                document.body.style.cursor =
                  "pointer";
              }}
              onPointerOut={(e) => {
                e.stopPropagation();

                setActiveIdx(null);
                closeMenu();

                document.body.style.cursor =
                  "default";
              }}
            >
              {item.label}
            </Text>
          ))}
        </group>
      )}



      {is3D &&
        NAV_ITEMS.map((item) => (
          <group
            key={item.href}
            position={[
              item.position[0],
              y + item.position[1],
              item.position[2],
            ]}
            rotation={item.rotation}
          >
            <Center>
              <Text3D
                font="/helvetiker_regular.typeface.json"
                size={0.35}
                height={0.08}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.015}
                bevelSize={0.01}
                bevelSegments={3}
                onClick={(e) => {
                  e.stopPropagation();

                  onNavigate?.(item.label);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();

                  document.body.style.cursor =
                    "pointer";
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();

                  document.body.style.cursor =
                    "default";
                }}
              >
                {item.label}

                <meshStandardMaterial
                  color="#ffffff"
                  roughness={0.25}
                  metalness={0.2}
                />
              </Text3D>
            </Center>
          </group>
        ))}
    </group>
  );
};

export default Header3D;