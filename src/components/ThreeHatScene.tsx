import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { HouseId } from '../data/houses';

interface ThreeHatSceneProps {
  mode: 'idle' | 'question' | 'thinking' | 'reveal';
  activeHouse?: HouseId;
  themeColor?: string;
}

export const ThreeHatScene: React.FC<ThreeHatSceneProps> = ({
  mode,
  activeHouse,
  themeColor = '#fdb913'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    hatGroup: THREE.Group;
    mouthMesh: THREE.Mesh;
    eyeLeft: THREE.Mesh;
    eyeRight: THREE.Mesh;
    particles: THREE.Points;
    pointLight: THREE.PointLight;
    pointLight2: THREE.PointLight;
    frameId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xfff3d6, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(new THREE.Color(themeColor), 3.5, 20);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xfdb913, 2.0, 15);
    pointLight2.position.set(-3, -1, 3);
    scene.add(pointLight2);

    const backRimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    backRimLight.position.set(0, 5, -5);
    scene.add(backRimLight);

    // 3. Build Procedural 3D Sorting Hat
    const hatGroup = new THREE.Group();

    // Leather material
    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x3d2719,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true
    });

    const foldMat = new THREE.MeshStandardMaterial({
      color: 0x22140b,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true
    });

    // Hat Brim (irregular wavy disc)
    const brimGeom = new THREE.CylinderGeometry(2.3, 2.5, 0.12, 32);
    const posAttr = brimGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      if (dist > 1.2) {
        // wavy ripples
        posAttr.setY(i, posAttr.getY(i) + Math.sin(x * 3.5) * 0.15 + Math.cos(z * 3.0) * 0.12);
      }
    }
    brimGeom.computeVertexNormals();
    const brim = new THREE.Mesh(brimGeom, leatherMat);
    brim.position.y = -1.2;
    hatGroup.add(brim);

    // Lower Crown / Base
    const lowerCrownGeom = new THREE.CylinderGeometry(1.4, 1.9, 1.1, 24);
    const lowerCrown = new THREE.Mesh(lowerCrownGeom, leatherMat);
    lowerCrown.position.y = -0.65;
    hatGroup.add(lowerCrown);

    // Middle Face Fold / Eyebrow Brow Ridge
    const browGeom = new THREE.TorusGeometry(1.2, 0.18, 12, 24, Math.PI * 0.85);
    const brow = new THREE.Mesh(browGeom, foldMat);
    brow.position.set(0, -0.3, 0.4);
    brow.rotation.x = Math.PI * 0.1;
    hatGroup.add(brow);

    // Eyes (Dark Crevices with internal magic glow)
    const eyeGeom = new THREE.SphereGeometry(0.12, 8, 8);
    eyeGeom.scale(1.8, 0.5, 0.6);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x110904 });

    const eyeLeft = new THREE.Mesh(eyeGeom, eyeMat);
    eyeLeft.position.set(-0.45, -0.42, 1.25);
    eyeLeft.rotation.z = 0.2;
    hatGroup.add(eyeLeft);

    const eyeRight = new THREE.Mesh(eyeGeom, eyeMat);
    eyeRight.position.set(0.45, -0.42, 1.25);
    eyeRight.rotation.z = -0.2;
    hatGroup.add(eyeRight);

    // Mouth Crevice (deep animated tear)
    const mouthGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8);
    mouthGeom.scale(1.2, 0.4, 0.8);
    const mouthMesh = new THREE.Mesh(mouthGeom, new THREE.MeshBasicMaterial({ color: 0x0a0502 }));
    mouthMesh.position.set(0, -0.85, 1.35);
    mouthMesh.rotation.z = Math.PI / 2;
    hatGroup.add(mouthMesh);

    // Mid Section with twist
    const midCrownGeom = new THREE.CylinderGeometry(0.85, 1.3, 1.2, 24);
    const midCrown = new THREE.Mesh(midCrownGeom, leatherMat);
    midCrown.position.set(0.1, 0.4, -0.1);
    midCrown.rotation.z = -0.08;
    hatGroup.add(midCrown);

    // Upper Bent Cone
    const topConeGeom = new THREE.ConeGeometry(0.8, 1.6, 20);
    const topCone = new THREE.Mesh(topConeGeom, leatherMat);
    topCone.position.set(0.35, 1.6, -0.25);
    topCone.rotation.z = -0.32;
    topCone.rotation.x = -0.15;
    hatGroup.add(topCone);

    // Curved Hat Tip
    const tipGeom = new THREE.ConeGeometry(0.35, 0.8, 12);
    const tip = new THREE.Mesh(tipGeom, foldMat);
    tip.position.set(0.85, 2.3, -0.45);
    tip.rotation.z = -0.9;
    tip.rotation.y = 0.4;
    hatGroup.add(tip);

    // Leather patches & stitches
    const patchGeom = new THREE.BoxGeometry(0.4, 0.3, 0.04);
    const patchMat = new THREE.MeshStandardMaterial({ color: 0x4d321f, roughness: 0.9 });
    const patch1 = new THREE.Mesh(patchGeom, patchMat);
    patch1.position.set(-0.9, 0.2, 0.7);
    patch1.rotation.y = -0.6;
    patch1.rotation.z = 0.2;
    hatGroup.add(patch1);

    scene.add(hatGroup);

    // 4. Floating Magic Sparkles / Dust Particles
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const colorObj = new THREE.Color(themeColor);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) + Math.random() * 2 - 1;
      particlePositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const pCol = colorObj.clone().offsetHSL((Math.random() - 0.5) * 0.1, 0, (Math.random() - 0.5) * 0.2);
      particleColors[i * 3] = pCol.r;
      particleColors[i * 3 + 1] = pCol.g;
      particleColors[i * 3 + 2] = pCol.b;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(253, 185, 19, 0.8)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const sparkTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      map: sparkTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 5. Parallax Mouse Listener
    let targetRotationX = 0;
    let targetRotationY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.45;
      targetRotationX = -y * 0.3;
    };
    window.addEventListener('mousemove', onMouseMove);

    // 6. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      if (sceneRef.current) {
        sceneRef.current.frameId = frameId;
      }

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      hatGroup.rotation.y += (targetRotationY - hatGroup.rotation.y) * 0.05;
      hatGroup.rotation.x += (targetRotationX - hatGroup.rotation.x) * 0.05;

      // Mode-based behavior
      if (mode === 'idle') {
        hatGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
        hatGroup.rotation.z = Math.sin(elapsedTime * 0.8) * 0.04;
        mouthMesh.scale.set(1.2, 0.4 + Math.sin(elapsedTime * 2) * 0.08, 0.8);
      } else if (mode === 'question') {
        hatGroup.position.y = Math.sin(elapsedTime * 2.0) * 0.08;
        hatGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.03;
      } else if (mode === 'thinking') {
        // Wobble excitedly
        hatGroup.position.y = Math.sin(elapsedTime * 6.0) * 0.18;
        hatGroup.rotation.y = Math.sin(elapsedTime * 4.5) * 0.35 + targetRotationY;
        hatGroup.rotation.z = Math.cos(elapsedTime * 5.0) * 0.15;
        // Mouth talking
        mouthMesh.scale.y = 0.5 + Math.abs(Math.sin(elapsedTime * 10.0)) * 0.9;
        mouthMesh.scale.x = 1.0 + Math.sin(elapsedTime * 8.0) * 0.3;
      } else if (mode === 'reveal') {
        hatGroup.position.y = 0.3 + Math.sin(elapsedTime * 3.0) * 0.15;
        hatGroup.rotation.x = -0.15 + Math.sin(elapsedTime * 2.0) * 0.05;
        mouthMesh.scale.set(1.6, 1.4, 1.0); // wide open shout
      }

      // Rotate particle cloud
      particles.rotation.y = elapsedTime * 0.08;
      particles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;

      renderer.render(scene, camera);
    };

    const initialFrameId = requestAnimationFrame(animate);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      hatGroup,
      mouthMesh,
      eyeLeft,
      eyeRight,
      particles,
      pointLight,
      pointLight2,
      frameId: initialFrameId
    };

    // Resize listener
    const onResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      sceneRef.current.camera.aspect = newW / newH;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.frameId);
        renderer.dispose();
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update dynamic lights and particle colors when active house / theme color changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const { pointLight, particles, hatGroup } = sceneRef.current;

    // Smoothly morph light color with GSAP
    const targetColor = new THREE.Color(themeColor);
    gsap.to(pointLight.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.6,
      ease: 'power2.out'
    });

    // Update particle colors
    const colors = particles.geometry.attributes.color as THREE.BufferAttribute;
    if (colors) {
      for (let i = 0; i < colors.count; i++) {
        const pCol = targetColor.clone().offsetHSL((Math.random() - 0.5) * 0.08, 0, (Math.random() - 0.5) * 0.2);
        colors.setXYZ(i, pCol.r, pCol.g, pCol.b);
      }
      colors.needsUpdate = true;
    }

    // Quick reactive tilt when color shifts
    gsap.fromTo(
      hatGroup.scale,
      { x: 0.95, y: 1.05, z: 0.95 },
      { x: 1, y: 1, z: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }
    );
  }, [themeColor, activeHouse]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[260px] sm:min-h-[340px] md:min-h-[420px] pointer-events-none relative"
      style={{ touchAction: 'none' }}
    />
  );
};
