import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { SORTING_HAT_OBJ } from '../data/sortingHatModel';
import { HouseId } from '../data/houses';

interface ThreeHatSceneProps {
  mode: 'idle' | 'question' | 'thinking' | 'reveal';
  activeHouse?: HouseId;
  themeColor?: string;
}

export const ThreeHatScene: React.FC<ThreeHatSceneProps> = ({
  mode,
  themeColor = '#d4af37'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    hatGroup: THREE.Group;
    candleLights: THREE.PointLight[];
    particles: THREE.Points;
    frameId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0.35, 7.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Warm Hogwarts Lighting (Optimized for Low-Poly Facets)
    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff3dc, 2.2);
    keyLight.position.set(3.8, 5.0, 4.2);
    scene.add(keyLight);

    const candleLight1 = new THREE.PointLight(0xff9820, 4.2, 22);
    candleLight1.position.set(2.8, 2.2, 3.4);
    scene.add(candleLight1);

    const candleLight2 = new THREE.PointLight(0xfeb226, 2.6, 16);
    candleLight2.position.set(-3.2, 1.4, 3.0);
    scene.add(candleLight2);

    const rimLight = new THREE.DirectionalLight(0xf7df9c, 1.8);
    rimLight.position.set(0, 5.5, -4.2);
    scene.add(rimLight);

    // 3. Load & Parse Nyte's Low-Poly Sorting Hat (Harry.obj)
    const hatGroup = new THREE.Group();
    scene.add(hatGroup);

    const loader = new OBJLoader();
    const hatMeshGroup = loader.parse(SORTING_HAT_OBJ);

    // Warm Antique Wizard Leather Material with Crisp Low-Poly Flat Shading
    const hatMat = new THREE.MeshStandardMaterial({
      color: 0x583920,
      roughness: 0.72,
      metalness: 0.12,
      flatShading: true // Gives Nyte's exact polygonal facets!
    });

    hatMeshGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = hatMat;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.center();
      }
    });

    // Auto-scale & position Nyte's model cleanly in the scene
    const scale = 0.155;
    hatMeshGroup.scale.set(scale, scale, scale);
    hatMeshGroup.position.set(0, -0.25, 0);
    hatGroup.add(hatMeshGroup);

    // 4. Floating Warm Candlelight Sparkles
    const particleCount = 110;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) + Math.random() * 2.5 - 1.2;
      particlePositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const isGold = Math.random() > 0.4;
      particleColors[i * 3] = isGold ? 0.98 : 1.0;
      particleColors[i * 3 + 1] = isGold ? 0.72 : 0.48;
      particleColors[i * 3 + 2] = isGold ? 0.15 : 0.08;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 235, 180, 1)');
      grad.addColorStop(0.35, 'rgba(235, 165, 30, 0.75)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const emberTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.14,
      map: emberTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 5. Phone Gyroscope & Touch Drag Rotation Engine
    let baseAlpha: number | null = null;
    let phoneRotationY = 0;
    let phoneRotationZ = 0;
    let phoneRotationX = 0;

    let dragRotationY = 0;
    let dragRotationX = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;

    const onOrientation = (e: DeviceOrientationEvent) => {
      // 1. Horizontal turning of the phone (Compass Yaw)
      if (typeof e.alpha === 'number' && e.alpha !== null) {
        if (baseAlpha === null) {
          baseAlpha = e.alpha;
        }
        let diffAlpha = e.alpha - baseAlpha;
        while (diffAlpha > 180) diffAlpha -= 360;
        while (diffAlpha < -180) diffAlpha += 360;
        phoneRotationY = -(diffAlpha * Math.PI) / 180;
      }

      // 2. Roll (steering wheel rotation of phone in hand)
      if (typeof e.gamma === 'number' && e.gamma !== null) {
        phoneRotationZ = (e.gamma * Math.PI) / 180 * 0.95;
        if (baseAlpha === null) {
          phoneRotationY = (e.gamma / 45) * 0.85;
        }
      }

      // 3. Pitch (tilting phone up/down)
      if (typeof e.beta === 'number' && e.beta !== null) {
        const pitchDelta = e.beta - 48;
        phoneRotationX = (pitchDelta * Math.PI) / 180 * 0.75;
      }
    };

    window.addEventListener('deviceorientation', onOrientation, true);
    window.addEventListener('deviceorientationabsolute' as any, onOrientation, true);

    const requestDevicePermission = () => {
      const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<'granted' | 'denied'> };
      if (typeof DOE !== 'undefined' && typeof DOE.requestPermission === 'function') {
        DOE.requestPermission()
          .then(res => {
            if (res === 'granted') {
              window.addEventListener('deviceorientation', onOrientation, true);
            }
          })
          .catch(() => {});
      }
    };
    window.addEventListener('touchstart', requestDevicePermission, { once: true, passive: true });
    window.addEventListener('click', requestDevicePermission, { once: true, passive: true });

    // Interactive Touch & Mouse Drag on the Scene
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      container.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;

      dragRotationY += dx * 0.015;
      dragRotationX += dy * 0.01;
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {}
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);

    // 6. Animation Render Loop
    const clock = new THREE.Clock();

    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      if (sceneRef.current) {
        sceneRef.current.frameId = frameId;
      }

      const elapsedTime = clock.getElapsedTime();

      // Fluid interpolation following phone rotation and drag
      const targetY = phoneRotationY + dragRotationY;
      const targetX = phoneRotationX + dragRotationX;
      const targetZ = phoneRotationZ;

      hatGroup.rotation.y += (targetY - hatGroup.rotation.y) * 0.09;
      hatGroup.rotation.x += (targetX - hatGroup.rotation.x) * 0.09;
      hatGroup.rotation.z += (targetZ - hatGroup.rotation.z) * 0.09;

      // Candlelight ambient flicker
      candleLight1.intensity = 4.2 + Math.sin(elapsedTime * 8.0) * 0.25;
      candleLight2.intensity = 2.6 + Math.cos(elapsedTime * 7.0) * 0.2;

      // Mode-based character animations
      if (mode === 'idle') {
        hatGroup.position.y = Math.sin(elapsedTime * 1.3) * 0.08;
      } else if (mode === 'question') {
        hatGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.05;
      } else if (mode === 'thinking') {
        hatGroup.position.y = Math.sin(elapsedTime * 4.0) * 0.12;
        hatGroup.rotation.z += Math.sin(elapsedTime * 5.0) * 0.05;
      } else if (mode === 'reveal') {
        hatGroup.position.y = 0.2 + Math.sin(elapsedTime * 2.2) * 0.08;
      }

      particles.rotation.y = elapsedTime * 0.05;
      particles.position.y = Math.sin(elapsedTime * 0.4) * 0.12;

      renderer.render(scene, camera);
    };

    const initialFrameId = requestAnimationFrame(animate);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      hatGroup,
      candleLights: [candleLight1, candleLight2],
      particles,
      frameId: initialFrameId
    };

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
      window.removeEventListener('deviceorientation', onOrientation, true);
      window.removeEventListener('deviceorientationabsolute' as any, onOrientation, true);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.frameId);
        renderer.dispose();
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mode]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[160px] sm:min-h-[220px] md:min-h-[280px] relative cursor-grab active:cursor-grabbing touch-none select-none"
    />
  );
};
