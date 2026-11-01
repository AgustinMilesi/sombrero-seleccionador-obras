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
    mouthGroup: THREE.Group;
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

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0.35, 7.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Warm Hogwarts Chiaroscuro Lighting
    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.85);
    scene.add(ambientLight);

    const candleLight1 = new THREE.PointLight(0xffa233, 3.6, 20);
    candleLight1.position.set(2.8, 2.4, 3.6);
    scene.add(candleLight1);

    const candleLight2 = new THREE.PointLight(0xfeb226, 2.4, 15);
    candleLight2.position.set(-3.0, 1.4, 3.2);
    scene.add(candleLight2);

    const rimLight = new THREE.DirectionalLight(0xfff7e6, 1.4);
    rimLight.position.set(0, 6.5, -4.5);
    scene.add(rimLight);

    // 3. Procedural Weathered Leather & Bump Textures
    const createProceduralTextures = () => {
      // Color texture
      const cCanvas = document.createElement('canvas');
      cCanvas.width = 512;
      cCanvas.height = 512;
      const cCtx = cCanvas.getContext('2d');
      if (cCtx) {
        cCtx.fillStyle = '#341f11';
        cCtx.fillRect(0, 0, 512, 512);

        // Organic leather patches and tone variations
        for (let i = 0; i < 350; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const r = 12 + Math.random() * 55;
          const grad = cCtx.createRadialGradient(x, y, 0, x, y, r);
          const isDark = Math.random() > 0.45;
          grad.addColorStop(0, isDark ? 'rgba(25, 12, 6, 0.45)' : 'rgba(85, 52, 28, 0.35)');
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          cCtx.fillStyle = grad;
          cCtx.beginPath();
          cCtx.arc(x, y, r, 0, Math.PI * 2);
          cCtx.fill();
        }

        // Leather grain lines & fissures
        cCtx.strokeStyle = 'rgba(20, 10, 5, 0.28)';
        cCtx.lineWidth = 1.3;
        for (let i = 0; i < 60; i++) {
          cCtx.beginPath();
          let px = Math.random() * 512;
          let py = Math.random() * 512;
          cCtx.moveTo(px, py);
          for (let j = 0; j < 4; j++) {
            px += (Math.random() - 0.5) * 35;
            py += (Math.random() - 0.5) * 35;
            cCtx.lineTo(px, py);
          }
          cCtx.stroke();
        }
      }
      const leatherColorTex = new THREE.CanvasTexture(cCanvas);
      leatherColorTex.wrapS = THREE.RepeatWrapping;
      leatherColorTex.wrapT = THREE.RepeatWrapping;
      leatherColorTex.repeat.set(2, 2);

      // Bump texture for pores & micro-wrinkles
      const bCanvas = document.createElement('canvas');
      bCanvas.width = 256;
      bCanvas.height = 256;
      const bCtx = bCanvas.getContext('2d');
      if (bCtx) {
        bCtx.fillStyle = '#808080';
        bCtx.fillRect(0, 0, 256, 256);
        const img = bCtx.getImageData(0, 0, 256, 256);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const val = 128 + (Math.random() - 0.5) * 55;
          d[i] = val;
          d[i + 1] = val;
          d[i + 2] = val;
        }
        bCtx.putImageData(img, 0, 0);
      }
      const leatherBumpTex = new THREE.CanvasTexture(bCanvas);
      leatherBumpTex.wrapS = THREE.RepeatWrapping;
      leatherBumpTex.wrapT = THREE.RepeatWrapping;
      leatherBumpTex.repeat.set(4, 4);

      return { leatherColorTex, leatherBumpTex };
    };

    const { leatherColorTex, leatherBumpTex } = createProceduralTextures();

    // 4. Cinema Materials
    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x3d2516,
      map: leatherColorTex,
      bumpMap: leatherBumpTex,
      bumpScale: 0.045,
      roughness: 0.78,
      metalness: 0.1,
      flatShading: false
    });

    const deepCreaseMat = new THREE.MeshStandardMaterial({
      color: 0x180d07,
      bumpMap: leatherBumpTex,
      bumpScale: 0.03,
      roughness: 0.92,
      metalness: 0.05,
      flatShading: false
    });

    const beltMat = new THREE.MeshStandardMaterial({
      color: 0x22140a,
      roughness: 0.65,
      metalness: 0.2
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xb58934,
      roughness: 0.38,
      metalness: 0.88
    });

    const threadMat = new THREE.MeshStandardMaterial({
      color: 0xc4a475,
      roughness: 0.85,
      metalness: 0.05
    });

    // 5. Build Upgraded Organic Sorting Hat Model
    const hatGroup = new THREE.Group();

    // 5.1 Organic Wide Wavy Brim
    const brimGeom = new THREE.CylinderGeometry(2.5, 2.75, 0.12, 48, 4);
    const brimPos = brimGeom.attributes.position;
    for (let i = 0; i < brimPos.count; i++) {
      const x = brimPos.getX(i);
      const z = brimPos.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      if (dist > 1.0) {
        // Multi-frequency organic undulating waves: front dip, back roll, side sags
        const wave = Math.sin(x * 2.8) * 0.22 + Math.cos(z * 3.4) * 0.18 + Math.sin(x * z * 0.6) * 0.12;
        brimPos.setY(i, brimPos.getY(i) + wave);
      }
    }
    brimGeom.computeVertexNormals();
    const brim = new THREE.Mesh(brimGeom, leatherMat);
    brim.position.y = -1.25;
    hatGroup.add(brim);

    // Brim Rolled Outer Edge Seam
    const brimSeamGeom = new THREE.TorusGeometry(2.65, 0.08, 10, 48);
    brimSeamGeom.rotateX(Math.PI / 2);
    const brimSeam = new THREE.Mesh(brimSeamGeom, deepCreaseMat);
    brimSeam.position.y = -1.25;
    hatGroup.add(brimSeam);

    // 5.2 Lower Crown / Base of Hat
    const baseCrownGeom = new THREE.CylinderGeometry(1.65, 2.1, 0.95, 36, 4);
    const bcPos = baseCrownGeom.attributes.position;
    for (let i = 0; i < bcPos.count; i++) {
      const y = bcPos.getY(i);
      const angle = Math.atan2(bcPos.getZ(i), bcPos.getX(i));
      const bump = Math.sin(angle * 4 + y * 2.5) * 0.08 + Math.cos(angle * 2) * 0.05;
      bcPos.setX(i, bcPos.getX(i) + bump * Math.cos(angle));
      bcPos.setZ(i, bcPos.getZ(i) + bump * Math.sin(angle));
    }
    baseCrownGeom.computeVertexNormals();
    const baseCrown = new THREE.Mesh(baseCrownGeom, leatherMat);
    baseCrown.position.y = -0.78;
    hatGroup.add(baseCrown);

    // 5.3 Distressed Leather Hatband & Antique Bronze Buckle
    const bandGeom = new THREE.CylinderGeometry(1.9, 2.05, 0.2, 36);
    const band = new THREE.Mesh(bandGeom, beltMat);
    band.position.set(0, -1.14, 0);
    hatGroup.add(band);

    const buckleGeom = new THREE.TorusGeometry(0.2, 0.05, 12, 24);
    const buckle = new THREE.Mesh(buckleGeom, bronzeMat);
    buckle.position.set(0.72, -1.14, 1.75);
    buckle.rotation.y = 0.38;
    hatGroup.add(buckle);

    // 5.4 THE ICONIC FACE IN THE LEATHER FOLDS

    // Heavy Drooping Brow Ridge (The forehead overhang)
    const browGeom = new THREE.TorusGeometry(1.35, 0.26, 16, 32, Math.PI * 0.88);
    const brow = new THREE.Mesh(browGeom, deepCreaseMat);
    brow.position.set(0, -0.28, 0.72);
    brow.rotation.x = Math.PI * 0.16;
    hatGroup.add(brow);

    // Secondary Forehead Crease Fold above brow
    const foreCreaseGeom = new THREE.TorusGeometry(1.15, 0.16, 12, 28, Math.PI * 0.75);
    const foreCrease = new THREE.Mesh(foreCreaseGeom, deepCreaseMat);
    foreCrease.position.set(0, 0.08, 0.75);
    foreCrease.rotation.x = Math.PI * 0.12;
    hatGroup.add(foreCrease);

    // Deep Shadowed Eye Sockets (Deep hollow crevices)
    const eyeCavityMat = new THREE.MeshBasicMaterial({ color: 0x070402 });
    const eyeGeom = new THREE.SphereGeometry(0.18, 12, 12);
    eyeGeom.scale(2.2, 0.55, 0.7);

    const eyeLeft = new THREE.Mesh(eyeGeom, eyeCavityMat);
    eyeLeft.position.set(-0.52, -0.38, 1.42);
    eyeLeft.rotation.z = 0.22;
    hatGroup.add(eyeLeft);

    const eyeRight = new THREE.Mesh(eyeGeom, eyeCavityMat);
    eyeRight.position.set(0.52, -0.38, 1.42);
    eyeRight.rotation.z = -0.22;
    hatGroup.add(eyeRight);

    // Vertical Pinched Bridge of the Nose Fold
    const noseFoldGeom = new THREE.CylinderGeometry(0.12, 0.18, 0.45, 12);
    const noseFold = new THREE.Mesh(noseFoldGeom, deepCreaseMat);
    noseFold.position.set(0, -0.38, 1.58);
    hatGroup.add(noseFold);

    // 5.5 Talking Mouth Folds (Upper lip fold, Lower lip fold, Inner Shadow Cavity)
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(0, -0.84, 1.55);

    // Upper Lip Fold
    const upperLipGeom = new THREE.TorusGeometry(0.65, 0.12, 12, 24, Math.PI * 0.75);
    const upperLip = new THREE.Mesh(upperLipGeom, deepCreaseMat);
    upperLip.position.set(0, 0.08, 0.05);
    upperLip.rotation.x = Math.PI * 0.15;
    mouthGroup.add(upperLip);

    // Dark Mouth Crevice Interior
    const mouthInnerGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 12);
    mouthInnerGeom.scale(1.4, 0.5, 0.8);
    const mouthInner = new THREE.Mesh(mouthInnerGeom, new THREE.MeshBasicMaterial({ color: 0x050201 }));
    mouthInner.rotation.z = Math.PI / 2;
    mouthGroup.add(mouthInner);

    // Lower Lip / Chin Fold
    const lowerLipGeom = new THREE.TorusGeometry(0.68, 0.14, 12, 24, Math.PI * 0.72);
    const lowerLip = new THREE.Mesh(lowerLipGeom, deepCreaseMat);
    lowerLip.position.set(0, -0.12, 0.02);
    lowerLip.rotation.x = -Math.PI * 0.12;
    mouthGroup.add(lowerLip);

    hatGroup.add(mouthGroup);

    // Cheek Folds flanking the mouth
    const leftCheekGeom = new THREE.TorusGeometry(0.7, 0.12, 10, 18, Math.PI * 0.5);
    const leftCheek = new THREE.Mesh(leftCheekGeom, deepCreaseMat);
    leftCheek.position.set(-0.75, -0.72, 1.25);
    leftCheek.rotation.y = -0.65;
    leftCheek.rotation.z = 0.55;
    hatGroup.add(leftCheek);

    const rightCheekGeom = new THREE.TorusGeometry(0.7, 0.12, 10, 18, Math.PI * 0.5);
    const rightCheek = new THREE.Mesh(rightCheekGeom, deepCreaseMat);
    rightCheek.position.set(0.75, -0.72, 1.25);
    rightCheek.rotation.y = 0.65;
    rightCheek.rotation.z = -0.55;
    hatGroup.add(rightCheek);

    // 5.6 Cascading Crown Cone & Sagging Leather Rolls
    // Mid Crown Roll
    const midRollGeom = new THREE.TorusGeometry(1.2, 0.22, 14, 28);
    const midRoll = new THREE.Mesh(midRollGeom, deepCreaseMat);
    midRoll.position.set(0.08, 0.42, 0.12);
    midRoll.rotation.x = 0.25;
    midRoll.rotation.z = -0.15;
    hatGroup.add(midRoll);

    const midCrownGeom = new THREE.CylinderGeometry(0.95, 1.45, 1.35, 28);
    const midCrown = new THREE.Mesh(midCrownGeom, leatherMat);
    midCrown.position.set(0.12, 0.52, -0.1);
    midCrown.rotation.z = -0.14;
    midCrown.rotation.x = -0.1;
    hatGroup.add(midCrown);

    // Upper Crown Roll
    const upperRollGeom = new THREE.TorusGeometry(0.85, 0.18, 12, 24);
    const upperRoll = new THREE.Mesh(upperRollGeom, deepCreaseMat);
    upperRoll.position.set(0.25, 1.15, -0.18);
    upperRoll.rotation.x = 0.32;
    upperRoll.rotation.z = -0.28;
    hatGroup.add(upperRoll);

    // 5.7 Upper Arched Cone with Classic Movie Droop
    const upperConeGeom = new THREE.ConeGeometry(0.88, 1.75, 24);
    const upperCone = new THREE.Mesh(upperConeGeom, leatherMat);
    upperCone.position.set(0.48, 1.75, -0.32);
    upperCone.rotation.z = -0.42;
    upperCone.rotation.x = -0.22;
    hatGroup.add(upperCone);

    // 5.8 Drooping Pointed Tip (curves down sideways towards shoulder)
    const tipGeom = new THREE.ConeGeometry(0.42, 1.1, 16);
    const tip = new THREE.Mesh(tipGeom, deepCreaseMat);
    tip.position.set(1.12, 2.45, -0.58);
    tip.rotation.z = -1.18;
    tip.rotation.y = 0.48;
    hatGroup.add(tip);

    // 5.9 Antique Repair Patches with Visible Twine Cross-Stitches
    const patchMat = new THREE.MeshStandardMaterial({
      color: 0x4a2c16,
      roughness: 0.88,
      metalness: 0.12
    });

    // Patch 1: Left cheek patch
    const patch1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.32, 0.06), patchMat);
    patch1.position.set(-1.02, 0.22, 0.78);
    patch1.rotation.y = -0.7;
    patch1.rotation.z = 0.3;
    hatGroup.add(patch1);

    // Stitches on Patch 1
    const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.28, 6), threadMat);
    s1.position.set(-1.04, 0.22, 0.82);
    s1.rotation.z = 0.75;
    s1.rotation.y = -0.7;
    hatGroup.add(s1);

    const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.28, 6), threadMat);
    s2.position.set(-1.04, 0.22, 0.82);
    s2.rotation.z = -0.75;
    s2.rotation.y = -0.7;
    hatGroup.add(s2);

    // Patch 2: Upper cone patch
    const patch2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.26, 0.05), patchMat);
    patch2.position.set(0.88, 0.75, 0.48);
    patch2.rotation.y = 0.75;
    patch2.rotation.z = -0.35;
    hatGroup.add(patch2);

    scene.add(hatGroup);

    // 6. Floating Warm Candlelight Sparkles
    const particleCount = 120;
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
      size: 0.15,
      map: emberTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 7. PHONE GYROSCOPE & TOUCH ROTATION ENGINE
    let baseAlpha: number | null = null;
    let phoneRotationY = 0; // Compass yaw (turning phone left/right)
    let phoneRotationZ = 0; // Roll (tilting phone like steering wheel)
    let phoneRotationX = 0; // Pitch (tilting phone up/down)

    // Touch & Mouse Drag Rotation (Direct 3D spin)
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

    // 8. Animation Loop
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
      candleLight1.intensity = 3.6 + Math.sin(elapsedTime * 8.0) * 0.22;
      candleLight2.intensity = 2.4 + Math.cos(elapsedTime * 7.0) * 0.18;

      // Mode-based character animations
      if (mode === 'idle') {
        hatGroup.position.y = Math.sin(elapsedTime * 1.3) * 0.08;
        mouthGroup.scale.set(1.0, 1.0, 1.0);
        tip.rotation.z = -1.18 + Math.sin(elapsedTime * 1.8) * 0.04;
      } else if (mode === 'question') {
        // Attentive listening posture
        hatGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.05;
        mouthGroup.scale.set(1.0, 0.95, 1.0);
        tip.rotation.z = -1.18 + Math.sin(elapsedTime * 1.4) * 0.03;
      } else if (mode === 'thinking') {
        // Deliberation talking animation (mouth flexes open & shut)
        hatGroup.position.y = Math.sin(elapsedTime * 4.0) * 0.12;
        const mouthOpen = 0.9 + Math.abs(Math.sin(elapsedTime * 8.5)) * 0.85;
        mouthGroup.scale.set(1.05, mouthOpen, 1.0);
        tip.rotation.z = -1.18 + Math.sin(elapsedTime * 5.0) * 0.2;
      } else if (mode === 'reveal') {
        // Triumphant shouting mouth open
        hatGroup.position.y = 0.2 + Math.sin(elapsedTime * 2.2) * 0.08;
        mouthGroup.scale.set(1.15, 1.9, 1.05);
        tip.rotation.z = -1.18 + Math.sin(elapsedTime * 6.0) * 0.28;
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
      mouthGroup,
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
    />
  );
};
