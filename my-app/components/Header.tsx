"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text, Html } from "@react-three/drei";
import * as THREE from "three";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

type Header3DProps = {
  z?: number;
  color?: string;
  is3D?: boolean;
  onNavigate?: (section: string) => void;
};

type NavLinkProps = {
  item: NavItem;
  index: number;
  activeIdx: number | null;
  setActiveIdx: (index: number | null) => void;
  openMenu: () => void;
  closeMenu: () => void;
  onNavigate?: (section: string) => void;
  panelWidth: number;
  gap: number;
  fontSize: number;
};

const COLOR_NORMAL = new THREE.Color("#e6f2f0");
const COLOR_HOVER = new THREE.Color("#ffffff");

const EMISSIVE_NONE = new THREE.Color("#000000");
const EMISSIVE_HOVER = new THREE.Color("#b8fff4");

const NavLink = ({
  item,
  index,
  activeIdx,
  setActiveIdx,
  openMenu,
  closeMenu,
  onNavigate,
  panelWidth,
  gap,
  fontSize,
}: NavLinkProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const hovered = activeIdx === index;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const targetScale = hovered ? 1.08 : 1;
    const currentScale = groupRef.current.scale.x;

    const nextScale = THREE.MathUtils.damp(
      currentScale,
      targetScale,
      12,
      delta
    );

    groupRef.current.scale.set(nextScale, nextScale, nextScale);

    const targetZ = hovered ? 0.035 : 0;

    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      0.09 + targetZ,
      12,
      delta
    );

    if (materialRef.current) {
      const mat = materialRef.current;

      const targetOpacity =
        activeIdx === null || hovered ? 1 : 0.4;

      mat.opacity = THREE.MathUtils.damp(
        mat.opacity,
        targetOpacity,
        10,
        delta
      );

      const targetColor = hovered
        ? COLOR_HOVER
        : COLOR_NORMAL;

      mat.color.lerp(
        targetColor,
        1 - Math.exp(-10 * delta)
      );

      const targetEmissive = hovered
        ? EMISSIVE_HOVER
        : EMISSIVE_NONE;

      mat.emissive.lerp(
        targetEmissive,
        1 - Math.exp(-8 * delta)
      );

      const targetEmissiveIntensity = hovered ? 1.2 : 0;

      mat.emissiveIntensity = THREE.MathUtils.damp(
        mat.emissiveIntensity,
        targetEmissiveIntensity,
        8,
        delta
      );
    }
  });

  const xPos = -panelWidth / 2 + gap * (index + 0.5);

  return (
    <group
      ref={groupRef}
      position={[xPos, 0, 0.09]}
      onClick={(e) => {
        e.stopPropagation();
        onNavigate?.(item.label);
        setActiveIdx(null);
        document.body.style.cursor = "default";
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        openMenu();
        setActiveIdx(index);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setActiveIdx(null);
        closeMenu();
        document.body.style.cursor = "default";
      }}
    >
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry
          args={[gap * 0.9, fontSize * 2.2]}
        />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      <Text
        fontSize={fontSize}
        anchorX="center"
        anchorY="middle"
      >
        {item.label}
        <meshStandardMaterial
          ref={materialRef}
          color={COLOR_NORMAL}
          emissive={EMISSIVE_NONE}
          emissiveIntensity={0}
          transparent
          opacity={1}
        />
      </Text>
    </group>
  );
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

  const metrics = useMemo(() => {
    const barWidth = viewport.width * 0.55;
    const barHeight = viewport.width * 0.012;
    const y = viewport.height / 2 - barHeight * 2;
    const panelWidth = barWidth * 0.6;
    const panelHeight = barHeight * 3.2;
    const gap = panelWidth / NAV_ITEMS.length;
    const fontSize = barHeight * 1.1;

    return {
      barWidth,
      barHeight,
      y,
      panelWidth,
      panelHeight,
      gap,
      fontSize,
    };
  }, [viewport.width, viewport.height]);

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

  useEffect(() => {
    if (is3D) {
      setOpen(false);
      setActiveIdx(null);
      document.body.style.cursor = "default";
    }

    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
      document.body.style.cursor = "default";
    };
  }, [is3D]);

  useFrame((_, delta) => {
    progress.current = THREE.MathUtils.damp(
      progress.current,
      open ? 1 : 0,
      10,
      delta
    );

    const p = progress.current;

    if (panelRef.current) {
      panelRef.current.visible = p > 0.001;

      panelRef.current.scale.set(
        0.85 + 0.15 * p,
        p,
        1
      );

      panelRef.current.position.y =
        metrics.y -
        metrics.barHeight * 0.6 -
        metrics.panelHeight * 0.5 * p;
    }
  });

  return (
    <>
     
      <Html
        fullscreen
        style={{ pointerEvents: "none" }}
        className="md:hidden"
      >
        <header className="fixed top-0 left-0 z-[100] -mt-64 -ml-12 w-full px-6 py-2 pointer-events-auto">
          <nav className="flex items-center justify-center gap-5 backdrop-blur-md bg-black/30 rounded-full px-6 py-3 border border-white/10 shadow-lg">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.(item.label);
                }}
                className="text-sm font-medium tracking-tight text-white/80 transition-colors duration-200 hover:text-white active:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </header>
      </Html>

    
      <group position={[0, 0, z]} visible={!is3D}>
        {!is3D && (
          <mesh
            position={[
              0,
              metrics.y - metrics.panelHeight / 2,
              0.05,
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
                metrics.barWidth,
                metrics.panelHeight + metrics.barHeight * 2,
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
            metrics.barWidth,
            metrics.barHeight,
            0.15,
          ]}
          radius={metrics.barHeight / 3}
          smoothness={10}
          position={[0, metrics.y, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (!is3D) openMenu();
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            if (!is3D) closeMenu();
          }}
        >
          <meshPhysicalMaterial
            color={color}
            transmission={0.9}
            thickness={20}
            roughness={0.05}
            metalness={0}
            clearcoat={1}
            ior={1.5}
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
                metrics.panelWidth,
                metrics.panelHeight,
                0.12,
              ]}
              radius={metrics.panelHeight / 2.5}
              smoothness={10}
            >
              <meshPhysicalMaterial
                color={color}
                transmission={0.95}
                thickness={8}
                roughness={0.1}
                metalness={0}
                clearcoat={1}
                ior={1.4}
                transparent
                opacity={0.95}
              />
            </RoundedBox>

            {NAV_ITEMS.map((item, i) => (
              <NavLink
                key={item.href}
                item={item}
                index={i}
                activeIdx={activeIdx}
                setActiveIdx={setActiveIdx}
                openMenu={openMenu}
                closeMenu={closeMenu}
                onNavigate={onNavigate}
                panelWidth={metrics.panelWidth}
                gap={metrics.gap}
                fontSize={metrics.fontSize}
              />
            ))}
          </group>
        )}
      </group>
    </>
  );
};

export default Header3D;