import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HERO_THREE } from './palette';

const ribbonVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vAlong;
  uniform float uTime;
  uniform float uProgress;
  uniform float uWave;
  void main() {
    vUv = uv;
    vAlong = uv.x;
    vec3 pos = position;
    float wave = sin(uv.x * 12.0 + uTime * 1.4 + uProgress * 6.0) * uWave;
    float lift = cos(uv.x * 7.0 - uTime * 0.8) * uWave * 0.45;
    pos.y += wave;
    pos.z += lift;
    pos.x += sin(uProgress * 3.14159 + uv.x * 2.0) * 0.35;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const ribbonFragment = /* glsl */ `
  varying vec2 vUv;
  varying float vAlong;
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  void main() {
    float edge = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);
    float flow = 0.55 + 0.45 * sin(vAlong * 18.0 - uTime * 2.2 + uProgress * 8.0);
    vec3 col = mix(uColorA, uColorB, vAlong * 0.7 + flow * 0.3);
    float glow = pow(edge, 1.35) * (0.55 + 0.45 * flow);
    gl_FragColor = vec4(col, glow * uOpacity);
  }
`;

const liquidVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vElevate;
  uniform float uTime;
  uniform float uProgress;
  uniform float uIntensity;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float p = uProgress;
    float waves =
      sin(pos.x * 1.8 + uTime * 0.9 + p * 4.0) * 0.22 +
      cos(pos.y * 2.2 - uTime * 0.7) * 0.16 +
      sin((pos.x + pos.y) * 1.1 + uTime * 0.5 + p * 3.0) * 0.12;
    pos.z += waves * uIntensity;
    vElevate = waves;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const liquidFragment = /* glsl */ `
  varying vec2 vUv;
  varying float vElevate;
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uOpacity;
  void main() {
    float ripple = 0.5 + 0.5 * sin(vUv.x * 20.0 + uTime + vElevate * 8.0);
    vec3 base = mix(uColorA, uColorB, vUv.x);
    base = mix(base, uColorC, smoothstep(0.2, 0.9, vUv.y + uProgress * 0.3));
    float fres = pow(1.0 - abs(vElevate) * 2.5, 2.0);
    float alpha = (0.18 + fres * 0.35 + ripple * 0.08) * uOpacity;
    gl_FragColor = vec4(base + fres * 0.25, clamp(alpha, 0.0, 0.85));
  }
`;

function makeRibbonCurve(seed, travel) {
  const pts = [];
  for (let i = 0; i < 10; i += 1) {
    const t = i / 9;
    const x = THREE.MathUtils.lerp(-7.5, 7.5, t) + Math.sin(seed + t * 4) * 0.6 + travel;
    const y = Math.sin(seed * 1.7 + t * Math.PI * 2) * 1.8 + Math.cos(seed + t * 3) * 0.5;
    const z = Math.cos(seed * 0.9 + t * 5) * 1.4 - 0.4;
    pts.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(pts);
}

function FlowRibbon({
  seed,
  colorA,
  colorB,
  width = 0.22,
  progress,
  simplified,
  speed = 1,
}) {
  const matRef = useRef();
  const meshRef = useRef();
  const geometry = useMemo(() => {
    const curve = makeRibbonCurve(seed, 0);
    return new THREE.TubeGeometry(curve, simplified ? 48 : 120, width, simplified ? 6 : 12, false);
  }, [seed, width, simplified]);

  useFrame((state) => {
    if (!matRef.current || !meshRef.current) return;
    const t = state.clock.elapsedTime;
    const p = progress.current;
    matRef.current.uniforms.uTime.value = t * speed;
    matRef.current.uniforms.uProgress.value = p;
    matRef.current.uniforms.uWave.value = 0.12 + Math.sin(p * Math.PI) * 0.18;
    matRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(0.35, 0.95, Math.min(1, p * 2.2));

    // Scene-driven horizontal travel + depth
    const horizontal = Math.sin(p * Math.PI * 2 + seed) * 2.8;
    const depth = THREE.MathUtils.lerp(0.2, -1.6, Math.sin(p * Math.PI + seed) * 0.5 + 0.5);
    meshRef.current.position.x = horizontal;
    meshRef.current.position.z = depth;
    meshRef.current.rotation.z = Math.sin(t * 0.15 + seed) * 0.12 + (p - 0.5) * 0.35;
    meshRef.current.rotation.y = Math.sin(p * Math.PI + seed) * 0.4;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        vertexShader={ribbonVertex}
        fragmentShader={ribbonFragment}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uWave: { value: 0.15 },
          uOpacity: { value: 0.6 },
          uColorA: { value: new THREE.Color(colorA) },
          uColorB: { value: new THREE.Color(colorB) },
        }}
      />
    </mesh>
  );
}

function LiquidSurface({ progress, simplified }) {
  const matRef = useRef();
  const meshRef = useRef();

  useFrame((state) => {
    if (!matRef.current || !meshRef.current) return;
    const p = progress.current;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    matRef.current.uniforms.uProgress.value = p;
    // Peak liquid intensity in scene 3 (~0.45–0.7)
    const liquid = THREE.MathUtils.smoothstep(p, 0.38, 0.55) * (1 - THREE.MathUtils.smoothstep(p, 0.72, 0.9));
    matRef.current.uniforms.uIntensity.value = simplified ? liquid * 0.55 : liquid;
    matRef.current.uniforms.uOpacity.value = 0.15 + liquid * 0.7;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.12) * 0.08;
    meshRef.current.position.y = THREE.MathUtils.lerp(-0.4, 0.35, liquid);
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI * 0.42, 0, 0]} position={[0, -0.2, -1.2]}>
      <planeGeometry args={[14, 8, simplified ? 48 : 96, simplified ? 32 : 64]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        vertexShader={liquidVertex}
        fragmentShader={liquidFragment}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uIntensity: { value: 0 },
          uOpacity: { value: 0.2 },
          uColorA: { value: new THREE.Color(HERO_THREE.electric) },
          uColorB: { value: new THREE.Color(HERO_THREE.cyan) },
          uColorC: { value: new THREE.Color(HERO_THREE.violet) },
        }}
      />
    </mesh>
  );
}

function GlassPanel({ position, size, hue, progress, index, simplified }) {
  const ref = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const p = progress.current;
    const enter = THREE.MathUtils.smoothstep(p, 0.08 + index * 0.04, 0.28 + index * 0.04);
    const rearrange = Math.sin(p * Math.PI * 2 + index) * 0.85;
    const slide = THREE.MathUtils.lerp(3.8, 0, enter) + rearrange * (index % 2 === 0 ? 1 : -1);
    const depthLayer = -0.6 - index * 0.35 + Math.sin(p * Math.PI + index) * 0.5;
    const rise = THREE.MathUtils.lerp(-1.4, position[1], enter);

    ref.current.position.set(position[0] + slide * 0.35, rise + Math.sin(t * 0.6 + index) * 0.08, depthLayer);
    ref.current.rotation.y = 0.25 + Math.sin(t * 0.35 + index) * 0.15 + p * 0.55;
    ref.current.rotation.x = Math.sin(t * 0.25 + index) * 0.08 + (p - 0.5) * 0.2;
    ref.current.rotation.z = Math.cos(t * 0.2 + index) * 0.05;
    ref.current.scale.setScalar(0.55 + enter * 0.45);

    if (lightRef.current) {
      lightRef.current.intensity = (0.2 + enter * 0.9) * (simplified ? 0.55 : 1);
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <planeGeometry args={size} />
        <meshPhysicalMaterial
          color={hue}
          transparent
          opacity={simplified ? 0.22 : 0.28}
          roughness={0.12}
          metalness={0.15}
          transmission={simplified ? 0.35 : 0.65}
          thickness={0.6}
          ior={1.4}
          clearcoat={1}
          clearcoatRoughness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[size[0] * 0.92, size[1] * 0.92]} />
        <meshBasicMaterial
          color={HERO_THREE.cyan}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Holographic UI lines */}
      {!simplified && (
        <group position={[0, 0, 0.03]}>
          {[0.28, 0, -0.28].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <planeGeometry args={[size[0] * 0.7, 0.02]} />
              <meshBasicMaterial
                color={i === 1 ? HERO_THREE.softGreen : HERO_THREE.cyan}
                transparent
                opacity={0.45}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      )}
      <pointLight ref={lightRef} color={hue} intensity={0.4} distance={4} />
    </group>
  );
}

function FloatingGeom({ progress, simplified }) {
  const group = useRef();
  const items = useMemo(() => {
    const count = simplified ? 5 : 11;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      kind: i % 3,
      scale: 0.12 + (i % 4) * 0.05,
      orbit: 1.6 + (i % 5) * 0.35,
      speed: 0.25 + (i % 7) * 0.05,
      phase: i * 0.7,
      color: [HERO_THREE.cyan, HERO_THREE.violet, HERO_THREE.electric, HERO_THREE.softGreen][i % 4],
    }));
  }, [simplified]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = progress.current;
    group.current.children.forEach((child, i) => {
      const cfg = items[i];
      if (!cfg) return;
      const angle = t * cfg.speed + cfg.phase + p * Math.PI * 2;
      const radius = cfg.orbit * (0.85 + Math.sin(p * Math.PI + cfg.phase) * 0.25);
      child.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 0.7) * 1.1 + Math.cos(cfg.phase) * 0.4,
        Math.sin(angle) * radius * 0.55 - 0.5,
      );
      child.rotation.x = t * 0.6 + cfg.phase;
      child.rotation.y = t * 0.4 + p * 2;
      const appear = THREE.MathUtils.smoothstep(p, 0.05, 0.25);
      const exit = 1 - THREE.MathUtils.smoothstep(p, 0.88, 0.98);
      child.scale.setScalar(cfg.scale * appear * exit);
    });
  });

  return (
    <group ref={group}>
      {items.map((item) => (
        <mesh key={item.id}>
          {item.kind === 0 && <octahedronGeometry args={[1, 0]} />}
          {item.kind === 1 && <icosahedronGeometry args={[1, 0]} />}
          {item.kind === 2 && <tetrahedronGeometry args={[1, 0]} />}
          <meshStandardMaterial
            color={item.color}
            emissive={item.color}
            emissiveIntensity={0.55}
            metalness={0.6}
            roughness={0.25}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

function ParticleField({ progress, simplified }) {
  const points = useRef();
  const count = simplified ? 180 : 520;
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      velocities[i] = 0.2 + Math.random() * 0.8;
    }
    return { positions, velocities };
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const arr = points.current.geometry.attributes.position.array;
    const t = state.clock.elapsedTime;
    const p = progress.current;
    for (let i = 0; i < count; i += 1) {
      const ix = i * 3;
      arr[ix + 1] += Math.sin(t * velocities[i] + i) * 0.002;
      arr[ix] += Math.cos(t * 0.2 + i * 0.01 + p * 2) * 0.004 * velocities[i];
      if (arr[ix] > 8) arr[ix] = -8;
      if (arr[ix] < -8) arr[ix] = 8;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.rotation.y = t * 0.02 + p * 0.4;
    const mat = points.current.material;
    mat.opacity = 0.25 + THREE.MathUtils.smoothstep(p, 0, 0.3) * 0.45;
  });

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <points ref={points} geometry={geom}>
      <pointsMaterial
        size={simplified ? 0.035 : 0.028}
        color={HERO_THREE.cyan}
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function LightBeams({ progress, simplified }) {
  const group = useRef();
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = progress.current;
    group.current.children.forEach((beam, i) => {
      const pulse = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.7 + i + p * 4));
      beam.material.opacity = pulse * (0.08 + THREE.MathUtils.smoothstep(p, 0.1, 0.4) * 0.2);
      beam.rotation.z = Math.sin(t * 0.15 + i) * 0.15 + p * 0.5 * (i % 2 ? 1 : -1);
      beam.position.x = Math.sin(p * Math.PI * 2 + i) * (simplified ? 1.2 : 2.2);
    });
  });

  const beams = simplified ? 2 : 4;
  return (
    <group ref={group}>
      {Array.from({ length: beams }, (_, i) => (
        <mesh key={i} position={[0, 0, -2.4]} rotation={[0, 0, (i / beams) * Math.PI]}>
          <planeGeometry args={[0.08, 10]} />
          <meshBasicMaterial
            color={i % 2 ? HERO_THREE.violet : HERO_THREE.electric}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({ progress, pointer, simplified }) {
  useFrame((state) => {
    const p = progress.current;
    const px = pointer.current.x;
    const py = pointer.current.y;

    // Scene-based camera path
    let targetX = px * (simplified ? 0.25 : 0.55);
    let targetY = 0.15 + py * 0.25;
    let targetZ = 6.2;

    if (p < 0.22) {
      // Entrance — pull in
      const k = p / 0.22;
      targetZ = THREE.MathUtils.lerp(7.4, 6.2, k);
      targetY = THREE.MathUtils.lerp(0.45, 0.15, k);
    } else if (p < 0.45) {
      // Horizontal follow
      const k = (p - 0.22) / 0.23;
      targetX += THREE.MathUtils.lerp(0, 1.4, Math.sin(k * Math.PI));
      targetZ = 6.0;
    } else if (p < 0.68) {
      // Liquid — rotate forward
      const k = (p - 0.45) / 0.23;
      targetZ = THREE.MathUtils.lerp(6.0, 5.2, k);
      targetY = THREE.MathUtils.lerp(0.15, -0.1, k);
      state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, Math.sin(k * Math.PI) * 0.06, 0.08);
    } else if (p < 0.88) {
      // Typography depth
      const k = (p - 0.68) / 0.2;
      targetZ = THREE.MathUtils.lerp(5.2, 5.8, k);
      targetX += Math.sin(k * Math.PI) * 0.5;
    } else {
      // Final settle
      const k = (p - 0.88) / 0.12;
      targetX = THREE.MathUtils.lerp(targetX, px * 0.2, k);
      targetY = THREE.MathUtils.lerp(targetY, 0.1, k);
      targetZ = THREE.MathUtils.lerp(5.8, 6.3, k);
      state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, 0, 0.1);
    }

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 3.2, 0.016);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 3.2, 0.016);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 2.6, 0.016);
    state.camera.lookAt(targetX * 0.2, targetY * 0.3, 0);
  });

  return null;
}

function Atmosphere({ progress }) {
  const lightA = useRef();
  const lightB = useRef();
  const lightC = useRef();

  useFrame((state) => {
    const p = progress.current;
    const t = state.clock.elapsedTime;
    if (lightA.current) {
      lightA.current.intensity = 1.1 + Math.sin(t * 0.4) * 0.2 + p * 0.6;
      lightA.current.position.x = Math.sin(p * Math.PI * 2) * 3;
    }
    if (lightB.current) {
      lightB.current.intensity = 0.7 + Math.sin(p * Math.PI) * 0.8;
      lightB.current.position.set(-2.5 + p * 2, 1.5, 2);
    }
    if (lightC.current) {
      lightC.current.intensity = 0.35 + THREE.MathUtils.smoothstep(p, 0.4, 0.7) * 1.1;
    }
  });

  return (
    <>
      <color attach="background" args={[HERO_THREE.midnight]} />
      <fog attach="fog" args={[HERO_THREE.midnight, 6, 16]} />
      <ambientLight intensity={0.35} color={HERO_THREE.deepPurple} />
      <directionalLight ref={lightA} position={[4, 3, 5]} intensity={1.2} color={HERO_THREE.cyan} />
      <pointLight ref={lightB} position={[-3, 2, 2]} intensity={0.8} color={HERO_THREE.violet} distance={12} />
      <pointLight ref={lightC} position={[0, -2, 1]} intensity={0.4} color={HERO_THREE.electric} distance={10} />
      <spotLight
        position={[0, 5, 2]}
        angle={0.55}
        penumbra={0.7}
        intensity={1.1}
        color={HERO_THREE.turquoise}
        distance={18}
      />
    </>
  );
}

export default function HeroScene({ progress, pointer, simplified }) {
  const ribbonCount = simplified ? 2 : 4;

  return (
    <>
      <Atmosphere progress={progress} />
      <CameraRig progress={progress} pointer={pointer} simplified={simplified} />
      <ParticleField progress={progress} simplified={simplified} />
      <LightBeams progress={progress} simplified={simplified} />
      <LiquidSurface progress={progress} simplified={simplified} />

      {Array.from({ length: ribbonCount }, (_, i) => (
        <FlowRibbon
          key={i}
          seed={i * 1.7 + 0.4}
          width={simplified ? 0.18 : 0.16 + i * 0.04}
          colorA={[HERO_THREE.electric, HERO_THREE.cyan, HERO_THREE.violet, HERO_THREE.turquoise][i % 4]}
          colorB={[HERO_THREE.cyan, HERO_THREE.violet, HERO_THREE.softGreen, HERO_THREE.electric][i % 4]}
          progress={progress}
          simplified={simplified}
          speed={0.8 + i * 0.15}
        />
      ))}

      <FloatingGeom progress={progress} simplified={simplified} />

      <GlassPanel
        position={[2.6, 0.55, 0]}
        size={[1.5, 1.05]}
        hue={HERO_THREE.cyan}
        progress={progress}
        index={0}
        simplified={simplified}
      />
      <GlassPanel
        position={[3.3, -0.35, 0]}
        size={[1.15, 0.85]}
        hue={HERO_THREE.violet}
        progress={progress}
        index={1}
        simplified={simplified}
      />
      {!simplified && (
        <GlassPanel
          position={[2.1, -0.95, 0]}
          size={[0.95, 0.7]}
          hue={HERO_THREE.electric}
          progress={progress}
          index={2}
          simplified={simplified}
        />
      )}
    </>
  );
}
