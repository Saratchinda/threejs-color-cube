import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function Scene3D() {
  
  const mountRef = useRef(null);

  const [color, setColor] = useState('#ff0000');

  
  const cubeRef = useRef(null);

  useEffect(() => {
    // === Création de la scène ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0); 

    // === Caméra ===
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    // === Renderer ===
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );

    if (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    mountRef.current.appendChild(renderer.domElement);

    // === Contrôles souris ===
    const controls = new OrbitControls(camera, renderer.domElement);

    // === Lumières ===
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // === Cube ===
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cubeRef.current = cube;
    scene.add(cube);

    // === Animation ===
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Mise à jour de la couleur
  useEffect(() => {
    if (cubeRef.current) {
      cubeRef.current.material.color.set(color);
    }
  }, [color]);

  return (
    <>
      {/* Zone d'affichage 3D */}
      <div
        ref={mountRef}
        style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}
      />

      {/* Boutons de couleur */}
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setColor('#ff0000')}>🔴 Rouge</button>
        <button onClick={() => setColor('#00ff00')}>🟢 Vert</button>
        <button onClick={() => setColor('#0000ff')}>🔵 Bleu</button>
      </div>
    </>
  );
}
