'use client';

import { useEffect, forwardRef } from 'react';
import * as THREE from 'three';

const Tree = forwardRef<THREE.Group, { position: THREE.Vector3 }>(({ position }, ref) => {
  useEffect(() => {
    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
    const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

    const foliageGeometry = new THREE.ConeGeometry(0.5, 1, 32);
    const foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 0.75; // Position foliage on top of the trunk

    const tree = new THREE.Group();
    tree.add(trunk);
    tree.add(foliage);
    tree.position.copy(position);

    // @ts-ignore
    ref.current = tree;

    return () => {
      tree.remove(trunk);
      tree.remove(foliage);
    };
  }, [position, ref]);

  return null; // This component doesn't render anything directly
});

Tree.displayName = 'Tree';

export default Tree;