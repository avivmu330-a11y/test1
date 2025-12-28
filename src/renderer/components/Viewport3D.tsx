import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useAppState } from '../state/store';
import { buildChunkedMesh } from '../../common/geometry/pipeline';

export function Viewport3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { plan } = useAppState();

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b1224');
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(10, 20, 20);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    const controls = new OrbitControls(camera, renderer.domElement);

    const light = new THREE.DirectionalLight('#ffffff', 1);
    light.position.set(10, 25, 10);
    scene.add(light);

    const grid = new THREE.GridHelper(64, 64, '#1e293b', '#1e293b');
    scene.add(grid);

    const chunks = buildChunkedMesh(plan);
    chunks.forEach((chunk) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(chunk.vertices, 3));
      geometry.setIndex(new THREE.BufferAttribute(chunk.indices, 1));
      geometry.computeVertexNormals();
      const material = new THREE.MeshStandardMaterial({ color: '#22c55e', wireframe: chunk.vertices.length > 5000 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    });

    const handleResize = () => {
      const parent = canvasRef.current?.parentElement;
      if (!parent) return;
      const { clientWidth, clientHeight } = parent;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [plan]);

  return (
    <div style={{ position: 'relative' }}>
      <h2 style={{ padding: '0.75rem', margin: 0 }}>3D Viewport</h2>
      <canvas ref={canvasRef} style={{ width: '100%', height: 'calc(100% - 48px)', display: 'block' }} />
      <div style={{ position: 'absolute', top: 8, right: 8, background: '#0f172a99', padding: '0.5rem 0.75rem', borderRadius: 8, fontSize: 12 }}>
        LOD toggles automatically via wireframe when meshes exceed 5k vertices.
      </div>
    </div>
  );
}
