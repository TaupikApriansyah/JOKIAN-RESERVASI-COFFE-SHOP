import { useGLTF } from '@react-three/drei';

export default function ModelLokal3D({ sumber, posisi, skala, rotasi }) {
  const { scene } = useGLTF(sumber);
  return <primitive object={scene} position={posisi} scale={skala} rotation={rotasi} />;
}

useGLTF.preload('/models/coffee-cup/scene.gltf');
