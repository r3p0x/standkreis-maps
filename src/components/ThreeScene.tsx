'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Tree from '@/components/Tree';
import { OrbitControls as ThreeOrbitControls } from 'three-stdlib';

const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const treeRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<ThreeOrbitControls | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Create a Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Light blue background for better visibility
    // @ts-ignore
    sceneRef.current = scene;

    // 2. Create a Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5); // Adjust the camera position for better visibility
    cameraRef.current = camera;

    // 3. Create a Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 4. Add Lighting
    const light = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);

    // 5. Add Tree to Scene
    if (treeRef.current) {
      scene.add(treeRef.current);
    }

    // 6. Add OrbitControls
    const controls = new ThreeOrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    // 7. Add Grid Helper
    const gridHelper = new THREE.GridHelper(200, 50, 0x000000, 0x000000);
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // 8. Add Ground Plane with Opacity
    const groundGeometry = new THREE.PlaneGeometry(120, 10);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x1E8CF2, side: THREE.DoubleSide });
    groundMaterial.transparent = true;
    groundMaterial.opacity = 0.2;
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // 9. Add Border for Ground Plane
    const borderGeometry = new THREE.EdgesGeometry(groundGeometry);
    const borderMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 });
    const border = new THREE.LineSegments(borderGeometry, borderMaterial);
    border.rotation.x = -Math.PI / 2;
    scene.add(border);

    // 10. Add Raycaster for Hover Effect
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (treeRef.current) {
        treeRef.current.traverse((child) => {
          if (child instanceof THREE.Group) {
            child.children.forEach((grandchild) => {
              if (grandchild instanceof THREE.LineSegments) {
                grandchild.visible = false; // Hide outline by default
              }
            });
          }
        });
      }

      if (intersects.length > 0) {
        console.log('Intersected object:', intersects[0].object);

        let currentObj = intersects[0].object;
        while (currentObj.parent) {
          if (currentObj.parent === treeRef.current) {
            console.log('Hovering over tree');
            treeRef.current.traverse((child) => {
              if (child instanceof THREE.Group) {
                child.children.forEach((grandchild) => {
                  if (grandchild instanceof THREE.LineSegments) {
                    console.log('Setting visibility to true for:', grandchild);
                    grandchild.visible = true; // Show outline
                  }
                });
              }
            });
            break;
          }
          currentObj = currentObj.parent;
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // Render the Scene
    const animate = () => {
      requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update(); // Update the controls
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', onMouseMove);
      controls.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100vh' }}>
      <Tree position={new THREE.Vector3(0, 0.5, 0)} ref={treeRef} />
    </div>
  );
};

export default ThreeScene;