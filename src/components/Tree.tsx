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

    // Create an outline mesh
    const trunkOutlineGeometry = new THREE.EdgesGeometry(trunkGeometry);
    const foliageOutlineGeometry = new THREE.EdgesGeometry(foliageGeometry);

    // const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2, transparent: true, opacity: 1 });
    const trunkOutline = new THREE.LineSegments(trunkOutlineGeometry, outlineMaterial);
    const foliageOutline = new THREE.LineSegments(foliageOutlineGeometry, outlineMaterial);
    foliageOutline.position.y = 0.75;

    const outlineMesh = new THREE.Group();
    outlineMesh.add(trunkOutline);
    outlineMesh.add(foliageOutline);
    outlineMesh.visible = true; // Initially hidden

    tree.add(outlineMesh);

    // @ts-ignore
    ref.current = tree;

    return () => {
      tree.remove(trunk);
      tree.remove(foliage);
      tree.remove(outlineMesh);
    };
  }, [position, ref]);

  return null; // This component doesn't render anything directly
});

Tree.displayName = 'Tree';

export default Tree;