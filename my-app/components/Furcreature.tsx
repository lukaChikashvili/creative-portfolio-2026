import { useMemo, useRef, useEffect } from 'react'
import { useFrame, extend, type ThreeElement } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const VERTEX_SHADER = /* glsl */ `
  uniform float uShellOffset;
  uniform float uFurLength;
  uniform float uTime;
  uniform vec3  uPointer;
  uniform float uPointerStrength;
  uniform float uPointerRadius;
  uniform float uBendAmount;

  varying vec2 vUv;
  varying float vShell;
  varying float vOcclusion;

  void main() {
    vUv = uv;
    vShell = uShellOffset;

    vec3 displaced = position + normal * uFurLength * uShellOffset;

    float sway = sin(uTime * 1.4 + position.x * 1.5 + position.y * 1.2);
    displaced += normal * sway * 0.01 * uShellOffset;

    float dist = distance(position, uPointer);
    float influence = (1.0 - smoothstep(0.0, uPointerRadius, dist)) * uPointerStrength;
    vec3 bendDir = normalize(position - uPointer + 0.0001);
    displaced += bendDir * influence * uShellOffset * uBendAmount;
    displaced -= normal * influence * uShellOffset * uFurLength * 0.6;

    vOcclusion = 1.0 - uShellOffset * 0.5;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uMap;
  uniform sampler2D uMapNext; // Next incoming texture
  uniform float uTransition; // Progress [0.0 to 1.0]
  uniform sampler2D uNoise;
  uniform vec3 uTipColor;
  uniform float uNoiseRepeat;
  uniform float uTipMix;
  uniform vec2 uAspect;

  varying vec2 vUv;
  varying float vShell;
  varying float vOcclusion;

  void main() {
    // Dynamic noise-wipe transition calculation
    float wipeNoise = texture2D(uNoise, vUv * uAspect * 5.0).r;
    float wipeProgress = smoothstep(wipeNoise - 0.2, wipeNoise + 0.2, uTransition * 1.4 - 0.2);

    vec4 colorCurrent = texture2D(uMap, vUv);
    vec4 colorNext = texture2D(uMapNext, vUv);
    vec4 mapColor = mix(colorCurrent, colorNext, wipeProgress);

    if (vShell > 0.02) {
      vec2 noiseUv = vUv * uAspect * uNoiseRepeat;
      float n = texture2D(uNoise, noiseUv).r;
      float threshold = mix(0.02, 0.9, vShell);
      if (n < threshold) discard;
    }

    vec3 color = mix(mapColor.rgb, uTipColor, vShell * uTipMix) * vOcclusion;
    gl_FragColor = vec4(color, 1.0);
  }
`

const FurPlaneMaterialImpl = shaderMaterial(
  {
    uShellOffset: 0,
    uFurLength: 0.35,
    uTime: 0,
    uPointer: new THREE.Vector3(9999, 9999, 9999),
    uPointerStrength: 0,
    uPointerRadius: 3,
    uBendAmount: 1.2,
    uMap: null as THREE.Texture | null,
    uMapNext: null as THREE.Texture | null,
    uTransition: 1.0,
    uNoise: null as THREE.Texture | null,
    uNoiseRepeat: 40,
    uTipColor: new THREE.Color('#e0995a'),
    uTipMix: 0.35,
    uAspect: new THREE.Vector2(1, 1),
  },
  VERTEX_SHADER,
  FRAGMENT_SHADER
)

extend({ FurPlaneMaterialImpl })

declare module '@react-three/fiber' {
  interface ThreeElements {
    furPlaneMaterialImpl: ThreeElement<typeof FurPlaneMaterialImpl> & {
      uShellOffset?: number
      uFurLength?: number
      uTime?: number
      uPointer?: THREE.Vector3
      uPointerStrength?: number
      uPointerRadius?: number
      uBendAmount?: number
      uMap?: THREE.Texture | null
      uMapNext?: THREE.Texture | null
      uTransition?: number
      uNoise?: THREE.Texture | null
      uNoiseRepeat?: number
      uTipColor?: THREE.Color | string
      uTipMix?: number
      uAspect?: THREE.Vector2
    }
  }
}

function makeNoiseTexture(size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const imgData = ctx.createImageData(size, size)
  for (let i = 0; i < size * size; i++) {
    const v = Math.pow(Math.random(), 1.6) * 255
    imgData.data[i * 4 + 0] = v
    imgData.data[i * 4 + 1] = v
    imgData.data[i * 4 + 2] = v
    imgData.data[i * 4 + 3] = 255
  }
  ctx.putImageData(imgData, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  return tex
}

type FurPlaneProps = {
  map: THREE.Texture
  position?: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  widthSegments?: number
  heightSegments?: number
  shellCount?: number
  furLength?: number
  bendAmount?: number
  pointerRadius?: number
  noiseRepeat?: number
  tipColor?: string
  tipMix?: number
}

export default function FurPlane({
  map,
  position = [0, 0, -4],
  rotation = [0, 0, 0],
  width = 40,
  height = 40,
  widthSegments = 64,
  heightSegments = 64,
  shellCount = 18,
  furLength = 0.35,
  bendAmount = 1.2,
  pointerRadius = 3,
  noiseRepeat = 40,
  tipColor = '#e0995a',
  tipMix = 0.35,
}: FurPlaneProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const proxyRef = useRef<THREE.Mesh>(null!)
  const materialRefs = useRef<(THREE.ShaderMaterial | null)[]>([])

  const currentTex = useRef<THREE.Texture>(map)
  const nextTex = useRef<THREE.Texture>(map)
  const transitionProgress = useRef(1)

  useEffect(() => {
    if (map !== nextTex.current) {
      currentTex.current = nextTex.current
      nextTex.current = map
      transitionProgress.current = 0
    }
  }, [map])

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(width, height, widthSegments, heightSegments),
    [width, height, widthSegments, heightSegments]
  )
  const noiseTexture = useMemo(() => makeNoiseTexture(), [])
  const aspectVector = useMemo(
    () => new THREE.Vector2(1, height / width),
    [width, height]
  )

  const targetLocal = useRef(new THREE.Vector3())
  const currentLocal = useRef(new THREE.Vector3())
  const currentStrength = useRef(0)
  const isHovering = useRef(false)

  const shellOffsets = useMemo(
    () => Array.from({ length: shellCount }, (_, i) => i / (shellCount - 1)),
    [shellCount]
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    if (transitionProgress.current < 1) {
      transitionProgress.current = Math.min(1, transitionProgress.current + delta * 1.2)
    }

    currentStrength.current = THREE.MathUtils.lerp(
      currentStrength.current,
      isHovering.current ? 1 : 0,
      isHovering.current ? 0.15 : 0.1
    )
    currentLocal.current.lerp(targetLocal.current, 0.2)

    for (const mat of materialRefs.current) {
      if (!mat) continue
      mat.uniforms.uTime.value = t
      mat.uniforms.uPointer.value.copy(currentLocal.current)
      mat.uniforms.uPointerStrength.value = currentStrength.current
      mat.uniforms.uFurLength.value = furLength
      mat.uniforms.uBendAmount.value = bendAmount
      mat.uniforms.uPointerRadius.value = pointerRadius
      mat.uniforms.uMap.value = currentTex.current
      mat.uniforms.uMapNext.value = nextTex.current
      mat.uniforms.uTransition.value = transitionProgress.current
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh
        ref={proxyRef}
        geometry={geometry}
        onPointerMove={(e) => {
          e.stopPropagation()
          isHovering.current = true
          if (proxyRef.current) {
            targetLocal.current.copy(proxyRef.current.worldToLocal(e.point.clone()))
          }
        }}
        onPointerOut={() => {
          isHovering.current = false
        }}
      >
        <meshBasicMaterial visible={false} />
      </mesh>

      {shellOffsets.map((shellOffset, i) => (
        <mesh key={i} geometry={geometry} raycast={() => null}>
          <furPlaneMaterialImpl
            ref={(el) => {
              materialRefs.current[i] = el
            }}
            uShellOffset={shellOffset}
            uMap={currentTex.current}
            uMapNext={nextTex.current}
            uTransition={1.0}
            uNoise={noiseTexture}
            uNoiseRepeat={noiseRepeat}
            uTipColor={new THREE.Color(tipColor)}
            uTipMix={tipMix}
            uAspect={aspectVector}
          />
        </mesh>
      ))}
    </group>
  )
}