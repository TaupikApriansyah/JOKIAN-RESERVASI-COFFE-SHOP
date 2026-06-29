import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, ContactShadows, Float, Html, OrbitControls, Preload } from '@react-three/drei';
import ModelLokal3D from './ModelLokal3D';

export default function VisualKafe3D() {
  return (
    <div className="scene3d refined coffee-only" aria-label="Visual 3D coffee cup Dika Coffe Shop">
      <Canvas camera={{ position: [0, 1.6, 5.4], fov: 31 }} dpr={[1, 1.5]}>
        <ambientLight intensity={2.7} />
        <directionalLight position={[4.5, 6, 4.5]} intensity={3.2} />
        <pointLight position={[-3.5, 2.2, 4]} intensity={1.05} />
        <Suspense fallback={<Html center><span className="loading-3d">Memuat visual 3D</span></Html>}>
          <Float speed={1.15} rotationIntensity={0.16} floatIntensity={0.28}>
            <Center position={[0, -0.34, 0]}>
              <ModelLokal3D sumber="/models/coffee-cup/scene.gltf" skala={0.78} rotasi={[0.12, -0.5, 0.05]} />
            </Center>
          </Float>
          <ContactShadows position={[0, -1.42, 0]} opacity={0.16} scale={4.2} blur={3.2} far={2.8} />
          <Preload all />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.36} maxPolarAngle={Math.PI / 2.15} minPolarAngle={Math.PI / 3.2} />
      </Canvas>
    </div>
  );
}
