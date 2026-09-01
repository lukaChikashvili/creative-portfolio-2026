import { useMemo, useRef } from 'react'
import { useFrame, extend, type ThreeElement } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const MAX_RINGS = 8

const VERTEX_SHADER = /* glsl */ `
  const int MAX_RINGS = ${MAX_RINGS};

  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uMouseStrength;
  uniform float uPlaneWidth;
  uniform float uPlaneHeight;

  uniform float uWobbleAmount;
  uniform float uWobbleSpeed;
  uniform float uPushStrength;
  uniform float uPushRadius;

  uniform vec3  uRings[MAX_RINGS];     
  uniform float uRingStrength[MAX_RINGS];
  uniform float uRingSpeed;
  uniform float uRingWidth;
  uniform float uMaxAge;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vRingGlow;

  void main() {
    vUv = uv;

    float ws = uWobbleSpeed;
    float A = uv.x * 6.0 + uTime * ws;
    float B = uv.y * 5.0 - uTime * ws * 0.8;
    float C = (uv.x + uv.y) * 8.0 + uTime * ws * 1.3;

    float wobble = uWobbleAmount * (sin(A) * sin(B) + 0.5 * sin(C));
    float dWobbleDx = uWobbleAmount * (6.0 * cos(A) * sin(B) + 4.0 * cos(C));
    float dWobbleDy = uWobbleAmount * (sin(A) * 5.0 * cos(B) + 4.0 * cos(C));

    vec2 delta = uv - uMouse;
    float d2 = dot(delta, delta);
    float r2 = uPushRadius * uPushRadius;
    float g = exp(-d2 / r2);
    float push = uPushStrength * uMouseStrength * g;
    float dPushDx = push * (-2.0 * delta.x / r2);
    float dPushDy = push * (-2.0 * delta.y / r2);

    float ringGlow = 0.0;
    float ringHeight = 0.0;
    float dRingDx = 0.0;
    float dRingDy = 0.0;

    for (int i = 0; i < MAX_RINGS; i++) {
      float strength = uRingStrength[i];
      if (strength <= 0.0001) continue;

      float age = uTime - uRings[i].z;
      if (age < 0.0 || age > uMaxAge) continue;

      vec2 rd = uv - uRings[i].xy;
      float dist = length(rd);
      float radius = age * uRingSpeed;
      float sigma = uRingWidth * (0.6 + age * 0.4);
      float diff = dist - radius;
      float gauss = exp(-(diff * diff) / (2.0 * sigma * sigma));
      float decay = exp(-age * 1.1) * strength;

      ringHeight += decay * gauss;
      ringGlow += decay * gauss;

      float dGauss = -diff / (sigma * sigma) * gauss;
      float invDist = 1.0 / max(dist, 0.0001);
      dRingDx += decay * dGauss * rd.x * invDist;
      dRingDy += decay * dGauss * rd.y * invDist;
    }

    float height = wobble + push + ringHeight * 1.5;
    float dHdx = (dWobbleDx + dPushDx + dRingDx * 1.5) / uPlaneWidth;
    float dHdy = (dWobbleDy + dPushDy + dRingDy * 1.5) / uPlaneHeight;

    vNormal = normalize(vec3(-dHdx, -dHdy, 1.0));
    vRingGlow = ringGlow;

    vec3 displaced = vec3(position.xy, position.z + height);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uGlowColor;
  uniform vec3 uLightDir;
  uniform float uShininess;
  uniform float uRimStrength;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vRingGlow;

  void main() {
    float diag = clamp((vUv.x + vUv.y) * 0.5, 0.0, 1.0);
    vec3 base = mix(uColorA, uColorB, smoothstep(0.0, 1.0, diag));

    vec3 lightDir = normalize(uLightDir);
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);

    float diffuse = dot(vNormal, lightDir) * 0.5 + 0.5;
    float spec = pow(max(dot(vNormal, halfDir), 0.0), uShininess);
    float rim = pow(1.0 - max(vNormal.z, 0.0), 3.0) * uRimStrength;

    vec3 color = base * mix(0.8, 1.2, diffuse);
    color += uGlowColor * spec * 0.5;
    color += uGlowColor * rim;
    color += uGlowColor * vRingGlow * 0.8;

    gl_FragColor = vec4(color, 1.0);
  }
`

const DeformGradientMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0.5, 0.5),
    uMouseStrength: 0,
    uPlaneWidth: 50,
    uPlaneHeight: 25,
    uWobbleAmount: 1.5,
    uWobbleSpeed: 0.6,
    uPushStrength: 1.2,
    uPushRadius: 0.22,
    uRings: Array.from({ length: MAX_RINGS }, () => new THREE.Vector3(0, 0, -9999)),
    uRingStrength: new Array(MAX_RINGS).fill(0),
    uRingSpeed: 0.6,
    uRingWidth: 0.05,
    uMaxAge: 2.5,
    uColorA: new THREE.Color('#9564DD'),
    uColorB: new THREE.Color('#c81428'),
    uGlowColor: new THREE.Color('#9564DD'),
    uLightDir: new THREE.Vector3(0.4, 0.5, 1.0),
    uShininess: 40,
    uRimStrength: 0.35,
  },
  VERTEX_SHADER,
  FRAGMENT_SHADER
)

extend({ DeformGradientMaterialImpl })

declare module '@react-three/fiber' {
  interface ThreeElements {
    deformGradientMaterialImpl: ThreeElement<typeof DeformGradientMaterialImpl> & {
      uTime?: number
      uMouse?: THREE.Vector2
      uMouseStrength?: number
      uPlaneWidth?: number
      uPlaneHeight?: number
      uWobbleAmount?: number
      uWobbleSpeed?: number
      uPushStrength?: number
      uPushRadius?: number
      uRings?: THREE.Vector3[]
      uRingStrength?: number[]
      uRingSpeed?: number
      uRingWidth?: number
      uMaxAge?: number
      uColorA?: THREE.Color | string
      uColorB?: THREE.Color | string
      uGlowColor?: THREE.Color | string
      uLightDir?: THREE.Vector3
      uShininess?: number
      uRimStrength?: number
    }
  }
}

type DeformingGradientBackgroundProps = {
  position?: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  widthSegments?: number
  heightSegments?: number
  colorA?: string
  colorB?: string
  glowColor?: string
  wobbleAmount?: number
  wobbleSpeed?: number
  pushStrength?: number
  pushRadius?: number
  ringSpeed?: number
  ringWidth?: number
  maxAge?: number
  shininess?: number
  rimStrength?: number
  mouseLerp?: number
  strengthLerp?: number
}

export type DeformingGradientBackgroundHandle = {
  addRipple: (localX: number, localY: number, strength?: number) => void
}

export default function DeformingGradientBackground({
  position = [0, 0, -9],
  rotation = [0, 0, 0],
  width = 50,
  height = 25,
  widthSegments = 128,
  heightSegments = 64,
  colorA = '#000000',
  colorB = '#5B23FF',
  glowColor = '#F375C2',
  wobbleAmount = 0.25,
  wobbleSpeed = 0.6,
  pushStrength = 1.2,
  pushRadius = 0.22,
  ringSpeed = 0.6,
  ringWidth = 0.05,
  maxAge = 2.5,
  shininess = 40,
  rimStrength = 0.35,
  mouseLerp = 0.12,
  strengthLerp = 0.1,
}: DeformingGradientBackgroundProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(width, height, widthSegments, heightSegments),
    [width, height, widthSegments, heightSegments]
  )

  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5))
  const currentMouse = useRef(new THREE.Vector2(0.5, 0.5))
  const targetStrength = useRef(0)
  const currentStrength = useRef(0)

  const ringPositions = useRef(
    Array.from({ length: MAX_RINGS }, () => new THREE.Vector3(0, 0, -9999))
  )
  const ringStrengths = useRef(new Array(MAX_RINGS).fill(0))
  const cursor = useRef(0)
  const currentTime = useRef(0)

  function addRing(u: number, v: number, time: number, strength: number) {
    const i = cursor.current
    ringPositions.current[i].set(u, v, time)
    ringStrengths.current[i] = strength
    cursor.current = (i + 1) % MAX_RINGS
  }

  function toUv(localPoint: THREE.Vector3) {
    return { u: localPoint.x / width + 0.5, v: localPoint.y / height + 0.5 }
  }

  useFrame((state) => {
    const t = state.clock.elapsedTime
    currentTime.current = t

    currentMouse.current.lerp(targetMouse.current, mouseLerp)
    currentStrength.current = THREE.MathUtils.lerp(
      currentStrength.current,
      targetStrength.current,
      strengthLerp
    )

    const mat = materialRef.current
    if (!mat) return
    mat.uniforms.uTime.value = t
    mat.uniforms.uMouse.value.copy(currentMouse.current)
    mat.uniforms.uMouseStrength.value = currentStrength.current
    mat.uniforms.uWobbleAmount.value = wobbleAmount
    mat.uniforms.uWobbleSpeed.value = wobbleSpeed
    mat.uniforms.uPushStrength.value = pushStrength
    mat.uniforms.uPushRadius.value = pushRadius
    mat.uniforms.uRingSpeed.value = ringSpeed
    mat.uniforms.uRingWidth.value = ringWidth
    mat.uniforms.uMaxAge.value = maxAge
    mat.uniforms.uShininess.value = shininess
    mat.uniforms.uRimStrength.value = rimStrength
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={position}
      rotation={rotation}
      onPointerMove={(e) => {
        e.stopPropagation()
        if (!meshRef.current) return
        const local = meshRef.current.worldToLocal(e.point.clone())
        const { u, v } = toUv(local)
        targetMouse.current.set(u, v)
        targetStrength.current = 1
      }}
      onPointerOut={() => {
        targetStrength.current = 0
      }}
      onPointerDown={(e) => {
        e.stopPropagation()
        if (!meshRef.current) return
        const local = meshRef.current.worldToLocal(e.point.clone())
        const { u, v } = toUv(local)
        addRing(u, v, currentTime.current, 1.0)
      }}
    >
      <deformGradientMaterialImpl
        ref={materialRef}
        uPlaneWidth={width}
        uPlaneHeight={height}
        uColorA={new THREE.Color(colorA)}
        uColorB={new THREE.Color(colorB)}
        uGlowColor={new THREE.Color(glowColor)}
        uRings={ringPositions.current}
        uRingStrength={ringStrengths.current}
      />
    </mesh>
  )
}