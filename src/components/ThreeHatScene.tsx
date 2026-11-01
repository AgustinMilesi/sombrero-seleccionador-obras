import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
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
    mouthMesh: THREE.Mesh;
    tipMesh: THREE.Mesh;
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
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0.35, 7.0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Warm Hogwarts Candle Lighting
    const ambientLight = new THREE.AmbientLight(0xffecd0, 0.85);
    scene.add(ambientLight);

    const candleLight1 = new THREE.PointLight(0xff9d26, 3.2, 18);
    candleLight1.position.set(2.5, 2.2, 3.5);
    scene.add(candleLight1);

    const candleLight2 = new THREE.PointLight(0xfdb913, 2.2, 14);
    candleLight2.position.set(-2.8, 1.2, 3.0);
    scene.add(candleLight2);

    const rimLight = new THREE.DirectionalLight(0xfff5dd, 1.2);
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

    // 3.6 Animated Mouth Fold (opens when deliberating/shouting house name)
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

    // 3.9 Bent Tip (drooping backwards/sideways, moves as phone turns)
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

    scene.add(hatGroup);

    // 4. Floating Warm Candlelight Sparkles & Embers
    const particleCount = 140;
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
      size: 0.15,
      map: emberTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 5. PHONE ROTATION ENGINE ("Mover con el celular mientras lo vas girando")
    let baseAlpha: number | null = null;
    let phoneRotationY = 0; // Turning phone left/right (yaw / compass)
    let phoneRotationZ = 0; // Tilting phone like a steering wheel (roll / gamma)
    let phoneRotationX = 0; // Tilting phone forward/back (pitch / beta)

    // Touch / Mouse Drag Rotation (seamless manual spin)
    let dragRotationY = 0;
    let dragRotationX = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;

    const onOrientation = (e: DeviceOrientationEvent) => {
      // 1. Turning the phone around (Compass / Yaw): Hat turns with the phone!
      if (typeof e.alpha === 'number' && e.alpha !== null) {
        if (baseAlpha === null) {
          baseAlpha = e.alpha;
        }
        let diffAlpha = e.alpha - baseAlpha;
        while (diffAlpha > 180) diffAlpha -= 360;
        while (diffAlpha < -180) diffAlpha += 360;
        // As you rotate the phone horizontally, the hat turns smoothly!
        phoneRotationY = -(diffAlpha * Math.PI) / 180;
      }

      // 2. Rotating the phone in hand like a steering wheel (Roll / Gamma)
      if (typeof e.gamma === 'number' && e.gamma !== null) {
        // e.gamma is -90 to +90 deg
        phoneRotationZ = (e.gamma * Math.PI) / 180 * 0.9;
        // Also feed into Y turn if alpha isn't available
        if (baseAlpha === null) {
          phoneRotationY = (e.gamma / 45) * 0.85;
        }
      }

      // 3. Tilting phone up/down (Pitch / Beta)
      if (typeof e.beta === 'number' && e.beta !== null) {
        // Standard reading angle is around 45 to 55 degrees
        const pitchDelta = e.beta - 48;
        phoneRotationX = (pitchDelta * Math.PI) / 180 * 0.75;
      }
    };

    window.addEventListener('deviceorientation', onOrientation, true);
    window.addEventListener('deviceorientationabsolute' as any, onOrientation, true);

    // iOS 13+ Device Orientation Permission Trigger
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

      // Spin the hat with finger / mouse
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

    // 6. Animation Loop (Strictly Phone Movement & Character Animation - NO MUSIC REACTIVITY)
    const clock = new THREE.Clock();

    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      if (sceneRef.current) {
        sceneRef.current.frameId = frameId;
      }

      const elapsedTime = clock.getElapsedTime();

      // Combine phone rotation + drag rotation
      const targetY = phoneRotationY + dragRotationY;
      const targetX = phoneRotationX + dragRotationX;
      const targetZ = phoneRotationZ;

      // Smooth fluid interpolation as you rotate the phone
      hatGroup.rotation.y += (targetY - hatGroup.rotation.y) * 0.09;
      hatGroup.rotation.x += (targetX - hatGroup.rotation.x) * 0.09;
      hatGroup.rotation.z += (targetZ - hatGroup.rotation.z) * 0.09;

      // Gentle candle flicker
      candleLight1.intensity = 3.2 + Math.sin(elapsedTime * 8.0) * 0.2;
      candleLight2.intensity = 2.2 + Math.cos(elapsedTime * 7.0) * 0.18;

      // Mode-based behavior (No music audio wave)
      if (mode === 'idle') {
        hatGroup.position.y = Math.sin(elapsedTime * 1.3) * 0.08;
        mouthMesh.scale.set(1.3, 0.45, 0.9);
        tip.rotation.z = -1.05 + Math.sin(elapsedTime * 1.8) * 0.04;
      } else if (mode === 'question') {
        // Attentive listening posture
        hatGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.05;
        mouthMesh.scale.set(1.3, 0.42, 0.9);
        tip.rotation.z = -1.05 + Math.sin(elapsedTime * 1.4) * 0.03;
      } else if (mode === 'thinking') {
        // Deliberation talking animation
        hatGroup.position.y = Math.sin(elapsedTime * 4.0) * 0.12;
        mouthMesh.scale.y = 0.55 + Math.abs(Math.sin(elapsedTime * 8.5)) * 0.8;
        mouthMesh.scale.x = 1.1 + Math.sin(elapsedTime * 6.0) * 0.2;
        tip.rotation.z = -1.05 + Math.sin(elapsedTime * 5.0) * 0.2;
      } else if (mode === 'reveal') {
        // Triumphant open shout
        hatGroup.position.y = 0.2 + Math.sin(elapsedTime * 2.2) * 0.08;
        mouthMesh.scale.set(1.7, 1.8, 1.0);
        tip.rotation.z = -1.05 + Math.sin(elapsedTime * 6.0) * 0.28;
      }

      // Rotate particle cloud gently
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
      mouthMesh,
      tipMesh: tip,
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
      title="Gira tu celular o arrastra con el dedo para rotar el Sombrero en 3D"
    />
  );
};
