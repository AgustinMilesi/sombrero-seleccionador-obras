import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { HouseId } from '../data/houses';
import { AudioController } from './AudioController';

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
    mouthMesh: THREE.Mesh;
    tipMesh: THREE.Mesh;
    oscRingGeom: THREE.BufferGeometry;
    oscRingMat: THREE.LineBasicMaterial;
    candleLights: THREE.PointLight[];
    particles: THREE.Points;
    frameId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0.3, 7.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Warm Hogwarts Candle Lighting
    const ambientLight = new THREE.AmbientLight(0xffecd0, 0.75);
    scene.add(ambientLight);

    const candleLight1 = new THREE.PointLight(0xff9d26, 3.2, 18);
    candleLight1.position.set(2.5, 2.2, 3.5);
    scene.add(candleLight1);

    const candleLight2 = new THREE.PointLight(0xfdb913, 2.2, 14);
    candleLight2.position.set(-2.8, 1.2, 3.0);
    scene.add(candleLight2);

    const rimLight = new THREE.DirectionalLight(0xfff5dd, 1.1);
    rimLight.position.set(0, 6, -4);
    scene.add(rimLight);

    // 3. Build Detailed Procedural 3D Sorting Hat
    const hatGroup = new THREE.Group();

    // Worn Ancient Leather Materials
    const mainLeatherMat = new THREE.MeshStandardMaterial({
      color: 0x362113,
      roughness: 0.88,
      metalness: 0.12,
      flatShading: true
    });

    const deepFoldMat = new THREE.MeshStandardMaterial({
      color: 0x1d1007,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true
    });

    const strapMat = new THREE.MeshStandardMaterial({
      color: 0x221308,
      roughness: 0.7,
      metalness: 0.2
    });

    const bronzeBuckleMat = new THREE.MeshStandardMaterial({
      color: 0xb58934,
      roughness: 0.35,
      metalness: 0.85
    });

    // 3.1 Wide Wavy Brim with organic ripples
    const brimGeom = new THREE.CylinderGeometry(2.45, 2.65, 0.14, 36, 3);
    const pos = brimGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      if (dist > 1.1) {
        const wave = Math.sin(x * 3.2) * 0.18 + Math.cos(z * 3.6) * 0.14 + Math.sin(x * z * 0.8) * 0.1;
        pos.setY(i, pos.getY(i) + wave);
      }
    }
    brimGeom.computeVertexNormals();
    const brim = new THREE.Mesh(brimGeom, mainLeatherMat);
    brim.position.y = -1.25;
    hatGroup.add(brim);

    // 3.2 Lower Crown with wrinkled folds
    const lowerCrownGeom = new THREE.CylinderGeometry(1.45, 1.95, 1.15, 28, 4);
    const lcPos = lowerCrownGeom.attributes.position;
    for (let i = 0; i < lcPos.count; i++) {
      const y = lcPos.getY(i);
      const angle = Math.atan2(lcPos.getZ(i), lcPos.getX(i));
      const bump = Math.sin(angle * 3 + y * 2) * 0.08;
      lcPos.setX(i, lcPos.getX(i) + bump * Math.cos(angle));
      lcPos.setZ(i, lcPos.getZ(i) + bump * Math.sin(angle));
    }
    lowerCrownGeom.computeVertexNormals();
    const lowerCrown = new THREE.Mesh(lowerCrownGeom, mainLeatherMat);
    lowerCrown.position.y = -0.68;
    hatGroup.add(lowerCrown);

    // 3.3 Leather Hatband and Antique Bronze Buckle
    const hatbandGeom = new THREE.CylinderGeometry(1.7, 1.85, 0.18, 28);
    const hatband = new THREE.Mesh(hatbandGeom, strapMat);
    hatband.position.set(0, -1.08, 0);
    hatGroup.add(hatband);

    const buckleGeom = new THREE.TorusGeometry(0.18, 0.045, 10, 18);
    const buckle = new THREE.Mesh(buckleGeom, bronzeBuckleMat);
    buckle.position.set(0.65, -1.08, 1.58);
    buckle.rotation.y = 0.38;
    hatGroup.add(buckle);

    // 3.4 Expressive Eyebrow Brow Ridge
    const browGeom = new THREE.TorusGeometry(1.22, 0.22, 14, 28, Math.PI * 0.82);
    const brow = new THREE.Mesh(browGeom, deepFoldMat);
    brow.position.set(0, -0.32, 0.52);
    brow.rotation.x = Math.PI * 0.12;
    hatGroup.add(brow);

    // 3.5 Deep Eye Sockets with internal shadows
    const eyeGeom = new THREE.SphereGeometry(0.14, 10, 10);
    eyeGeom.scale(1.9, 0.55, 0.65);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0c0704 });

    const eyeLeft = new THREE.Mesh(eyeGeom, eyeMat);
    eyeLeft.position.set(-0.48, -0.42, 1.28);
    eyeLeft.rotation.z = 0.24;
    hatGroup.add(eyeLeft);

    const eyeRight = new THREE.Mesh(eyeGeom, eyeMat);
    eyeRight.position.set(0.48, -0.42, 1.28);
    eyeRight.rotation.z = -0.24;
    hatGroup.add(eyeRight);

    // 3.6 Animated Mouth Fold (opens when talking/shouting & reacts to oscilloscope wave)
    const mouthGeom = new THREE.CylinderGeometry(0.09, 0.09, 1.1, 12);
    mouthGeom.scale(1.3, 0.45, 0.9);
    const mouthMesh = new THREE.Mesh(mouthGeom, new THREE.MeshBasicMaterial({ color: 0x080402 }));
    mouthMesh.position.set(0, -0.88, 1.38);
    mouthMesh.rotation.z = Math.PI / 2;
    hatGroup.add(mouthMesh);

    // 3.7 Mid Crown Section (twisted cone)
    const midCrownGeom = new THREE.CylinderGeometry(0.9, 1.35, 1.25, 24);
    const midCrown = new THREE.Mesh(midCrownGeom, mainLeatherMat);
    midCrown.position.set(0.12, 0.42, -0.12);
    midCrown.rotation.z = -0.1;
    hatGroup.add(midCrown);

    // Additional side wrinkle fold
    const sideFoldGeom = new THREE.TorusGeometry(0.85, 0.12, 10, 20, Math.PI * 0.6);
    const sideFold = new THREE.Mesh(sideFoldGeom, deepFoldMat);
    sideFold.position.set(-0.6, 0.35, 0.3);
    sideFold.rotation.y = -0.8;
    sideFold.rotation.z = 0.4;
    hatGroup.add(sideFold);

    // 3.8 Upper Curved Cone with Classic Hogwarts Droop
    const topConeGeom = new THREE.ConeGeometry(0.85, 1.65, 20);
    const topCone = new THREE.Mesh(topConeGeom, mainLeatherMat);
    topCone.position.set(0.4, 1.65, -0.28);
    topCone.rotation.z = -0.36;
    topCone.rotation.x = -0.18;
    hatGroup.add(topCone);

    // 3.9 Bent Tip (drooping backwards/sideways, wobbles with phone movement & oscilloscope)
    const tipGeom = new THREE.ConeGeometry(0.38, 0.95, 14);
    const tip = new THREE.Mesh(tipGeom, deepFoldMat);
    tip.position.set(0.95, 2.38, -0.52);
    tip.rotation.z = -1.05;
    tip.rotation.y = 0.45;
    hatGroup.add(tip);

    // 3.10 Leather Stitches & Repair Patches
    const patchMat = new THREE.MeshStandardMaterial({ color: 0x422a18, roughness: 0.9 });
    const patch1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.05), patchMat);
    patch1.position.set(-0.95, 0.25, 0.72);
    patch1.rotation.y = -0.65;
    patch1.rotation.z = 0.25;
    hatGroup.add(patch1);

    const patch2 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.04), patchMat);
    patch2.position.set(0.82, 0.65, 0.45);
    patch2.rotation.y = 0.7;
    patch2.rotation.z = -0.3;
    hatGroup.add(patch2);

    // 3.11 Enchanted Golden Oscilloscope Halo Ring (reacts to real-time audio wave)
    const ringVertexCount = 64;
    const ringPoints = new Float32Array(ringVertexCount * 3);
    for (let i = 0; i < ringVertexCount; i++) {
      const theta = (i / ringVertexCount) * Math.PI * 2;
      ringPoints[i * 3] = Math.cos(theta) * 2.75;
      ringPoints[i * 3 + 1] = -1.24;
      ringPoints[i * 3 + 2] = Math.sin(theta) * 2.75;
    }
    const oscRingGeom = new THREE.BufferGeometry();
    oscRingGeom.setAttribute('position', new THREE.BufferAttribute(ringPoints, 3));
    const oscRingMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.45
    });
    const oscRing = new THREE.LineLoop(oscRingGeom, oscRingMat);
    hatGroup.add(oscRing);

    scene.add(hatGroup);

    // 4. Floating Warm Candlelight Sparkles & Embers
    const particleCount = 200;
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

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const cctx = canvas.getContext('2d');
    if (cctx) {
      const grad = cctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 235, 180, 1)');
      grad.addColorStop(0.35, 'rgba(235, 165, 30, 0.75)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      cctx.fillStyle = grad;
      cctx.fillRect(0, 0, 32, 32);
    }
    const emberTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.17,
      map: emberTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 5. Phone Gyroscope & Accelerometer ("Osciloscopio / Giroscopio del Celular")
    let targetRotationX = 0;
    let targetRotationY = 0;
    let phoneTiltX = 0;
    let phoneTiltY = 0;
    let phoneWiggle = 0;

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma: roll left-to-right (-90 to +90)
        // beta: pitch forward-to-back (-180 to +180), holding angle ~45-55 deg
        const gamma = Math.max(-45, Math.min(45, e.gamma));
        const beta = Math.max(-40, Math.min(40, e.beta - 50));

        phoneTiltY = (gamma / 45) * 0.75; // Hat rotates left/right
        phoneTiltX = (beta / 40) * 0.45;  // Hat tilts up/down
      }
    };

    const onMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (acc && acc.x !== null && acc.y !== null && acc.z !== null) {
        const magnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
        const delta = Math.abs(magnitude - 9.8);
        if (delta > 1.4) {
          phoneWiggle = Math.min(0.85, phoneWiggle + delta * 0.08);
        }
      }
    };

    window.addEventListener('deviceorientation', onOrientation, { passive: true });
    window.addEventListener('devicemotion', onMotion, { passive: true });

    // iOS 13+ device orientation permission request on first interaction
    const requestMotionPermission = () => {
      const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<'granted' | 'denied'> };
      if (typeof DOE !== 'undefined' && typeof DOE.requestPermission === 'function') {
        DOE.requestPermission()
          .then(res => {
            if (res === 'granted') {
              window.addEventListener('deviceorientation', onOrientation, { passive: true });
            }
          })
          .catch(() => {});
      }
    };
    window.addEventListener('touchstart', requestMotionPermission, { once: true, passive: true });
    window.addEventListener('click', requestMotionPermission, { once: true, passive: true });

    // Desktop Mouse Fallback
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.45;
      targetRotationX = -y * 0.28;
    };
    window.addEventListener('mousemove', onMouseMove);

    // 6. Animation Loop (Driven by Real-time Oscilloscope & Gyroscope)
    const clock = new THREE.Clock();

    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      if (sceneRef.current) {
        sceneRef.current.frameId = frameId;
      }

      const elapsedTime = clock.getElapsedTime();

      // Read real-time audio oscilloscope data
      const oscData = AudioController.getOscilloscopeData();
      const { wave, amplitude, bass, isSpeaking } = oscData;

      // Blend phone gyroscope and mouse parallax
      const desiredY = Math.abs(phoneTiltY) > 0.02 ? phoneTiltY : targetRotationY;
      const desiredX = Math.abs(phoneTiltX) > 0.02 ? phoneTiltX : targetRotationX;

      hatGroup.rotation.y += (desiredY - hatGroup.rotation.y) * 0.07;
      hatGroup.rotation.x += (desiredX - hatGroup.rotation.x) * 0.07;

      // Phone shake decay
      phoneWiggle *= 0.91;

      // Candle flicker effect modulated slightly by bass audio
      candleLight1.intensity = 3.2 + Math.sin(elapsedTime * 9.0) * 0.25 + bass * 0.6;
      candleLight2.intensity = 2.2 + Math.cos(elapsedTime * 8.0) * 0.2 + bass * 0.4;

      // Update Oscilloscope Golden Ring vertices in real-time
      if (wave && wave.length >= ringVertexCount) {
        const ringPos = oscRingGeom.attributes.position;
        const ringStep = Math.floor(wave.length / ringVertexCount);

        for (let i = 0; i < ringVertexCount; i++) {
          const theta = (i / ringVertexCount) * Math.PI * 2;
          const sample = wave[i * ringStep] ?? 128;
          // Normalized deviation from 128 (oscilloscope wave)
          const waveDelta = ((sample - 128) / 128) * (0.35 + amplitude * 0.6);
          const r = 2.75 + waveDelta;
          const yPos = -1.24 + Math.sin(elapsedTime * 2.5 + i * 0.15) * 0.03 + (amplitude * 0.08);

          ringPos.setXYZ(i, Math.cos(theta) * r, yPos, Math.sin(theta) * r);
        }
        ringPos.needsUpdate = true;
        oscRingMat.opacity = 0.35 + amplitude * 0.55;
      }

      // Mode-based & Audio-Reactive Behavior
      if (mode === 'idle') {
        hatGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.1 + bass * 0.04;
        hatGroup.rotation.z = Math.sin(elapsedTime * 0.9) * 0.03 + (phoneTiltY * 0.1);

        // Mouth reacts to music / voice oscilloscope
        const mouthOpen = 0.45 + (amplitude * 1.8) + (isSpeaking ? Math.sin(elapsedTime * 11) * 0.3 : 0);
        mouthMesh.scale.set(1.3, Math.min(2.0, mouthOpen), 0.9);

        // Hat tip wiggles with music beat and phone shake
        tip.rotation.z = -1.05 + Math.sin(elapsedTime * 2.2) * 0.05 + (phoneWiggle * 0.4) + (amplitude * 0.2);
        tip.rotation.y = 0.45 + Math.cos(elapsedTime * 1.8) * 0.04;

      } else if (mode === 'question') {
        hatGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.07 + bass * 0.03;
        hatGroup.rotation.z = Math.sin(elapsedTime * 1.1) * 0.02;

        const mouthOpen = 0.42 + (amplitude * 1.4);
        mouthMesh.scale.set(1.3, Math.min(1.8, mouthOpen), 0.9);

        tip.rotation.z = -1.05 + Math.sin(elapsedTime * 1.5) * 0.04 + (phoneWiggle * 0.35);

      } else if (mode === 'thinking') {
        // Dramatic deliberation animation
        hatGroup.position.y = Math.sin(elapsedTime * 4.5) * 0.14 + bass * 0.08;
        hatGroup.rotation.y = Math.sin(elapsedTime * 3.5) * 0.28 + desiredY;
        hatGroup.rotation.z = Math.cos(elapsedTime * 4.0) * 0.12 + (phoneWiggle * 0.3);

        // Mouth moving like speaking, boosted by audio oscilloscope
        const talkAmp = Math.max(amplitude * 2.2, Math.abs(Math.sin(elapsedTime * 8.0)) * 0.85);
        mouthMesh.scale.y = 0.55 + talkAmp;
        mouthMesh.scale.x = 1.1 + Math.sin(elapsedTime * 6.0) * 0.25;

        // Tip swings enthusiastically
        tip.rotation.z = -1.05 + Math.sin(elapsedTime * 6.0) * 0.25;

      } else if (mode === 'reveal') {
        hatGroup.position.y = 0.25 + Math.sin(elapsedTime * 2.5) * 0.12 + bass * 0.1;
        hatGroup.rotation.x = -0.12 + Math.sin(elapsedTime * 1.8) * 0.04 + desiredX;

        // Wide shouting mouth boosted by reveal fanfare
        const shoutScale = 1.5 + amplitude * 1.2;
        mouthMesh.scale.set(1.7, Math.min(2.5, shoutScale), 1.0);

        tip.rotation.z = -1.05 + Math.sin(elapsedTime * 8.0) * 0.35;
      }

      // Rotate particle cloud gently
      particles.rotation.y = elapsedTime * 0.06;
      particles.position.y = Math.sin(elapsedTime * 0.5) * 0.15;

      renderer.render(scene, camera);
    };

    const initialFrameId = requestAnimationFrame(animate);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      hatGroup,
      mouthMesh,
      tipMesh: tip,
      oscRingGeom,
      oscRingMat,
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
      window.removeEventListener('deviceorientation', onOrientation);
      window.removeEventListener('devicemotion', onMotion);
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

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[260px] sm:min-h-[340px] md:min-h-[420px] pointer-events-none relative"
      style={{ touchAction: 'none' }}
    />
  );
};
