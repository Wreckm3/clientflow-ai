import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 1800;

  const positions = useMemo(
    () => new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 12),
    []
  );

  useFrame(({ mouse, clock }) => {
    if (ref.current) {
      ref.current.rotation.x +=
        (mouse.y * 0.15 - ref.current.rotation.x) * 0.02;
      ref.current.rotation.y +=
        (mouse.x * 0.15 - ref.current.rotation.y) * 0.02;
      ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.05) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#34d399"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.45}
      />
    </Points>
  );
}

function GlassShape() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock, mouse }) => {
    if (mesh.current) {
      const t = clock.getElapsedTime();
      mesh.current.rotation.x += 0.002;
      mesh.current.rotation.y += 0.003;
      mesh.current.position.x += (mouse.x * 0.4 - mesh.current.position.x) * 0.015;
      mesh.current.position.y += (mouse.y * 0.4 - mesh.current.position.y) * 0.015;
      mesh.current.position.z = Math.sin(t * 0.15) * 0.3;
    }
  });

  return (
    <mesh ref={mesh} scale={1.6}>
      <icosahedronGeometry args={[1, 1]} />
      <MeshTransmissionMaterial
        backside
        samples={6}
        thickness={0.5}
        chromaticAberration={0.15}
        anisotropy={0.2}
        distortion={0.3}
        distortionScale={0.4}
        temporalDistortion={0.1}
        transmission={0.95}
        roughness={0.05}
        color="#34d399"
        ior={1.5}
      />
    </mesh>
  );
}

function GlowRing() {
  const ring = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ring.current) {
      const t = clock.getElapsedTime();
      ring.current.rotation.x = Math.sin(t * 0.08) * 0.4;
      ring.current.rotation.z += 0.001;
    }
  });

  return (
    <mesh ref={ring} scale={2.2}>
      <torusGeometry args={[1, 0.015, 16, 100]} />
      <meshBasicMaterial color="#34d399" transparent opacity={0.2} />
    </mesh>
  );
}

const BackgroundScene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.4} />
          <pointLight position={[-3, 2, 4]} intensity={0.6} color="#34d399" />
          <Particles />
          <GlassShape />
          <GlowRing />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BackgroundScene;
