import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
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

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 7.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Warm Hogwarts Lighting (Highlights Low-Poly Facets)
    const ambientLight = new THREE.AmbientLight(0xffecd0, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff1d6, 1.8);
    keyLight.position.set(3.5, 4.5, 4.0);
    scene.add(keyLight);

    const candleLight1 = new THREE.PointLight(0xff9820, 3.8, 22);
    candleLight1.position.set(2.6, 2.2, 3.4);
    scene.add(candleLight1);

    const candleLight2 = new THREE.PointLight(0xfeb226, 2.2, 16);
    candleLight2.position.set(-3.0, 1.2, 3.0);
    scene.add(candleLight2);

    const rimLight = new THREE.DirectionalLight(0xf5d996, 1.5);
    rimLight.position.set(0, 5.5, -4.0);
    scene.add(rimLight);

    // 3. Materials - Stylized Low-Poly Matte Antique Leather (Flat Shading)
    const lowPolyLeatherMat = new THREE.MeshStandardMaterial({
      color: 0x4e331e,
      roughness: 0.82,
      metalness: 0.12,
      flatShading: true
    });

    const lowPolyDarkCreaseMat = new THREE.MeshStandardMaterial({
      color: 0x221308,
      roughness: 0.9,
      metalness: 0.08,
      flatShading: true
    });

    const beltMat = new THREE.MeshStandardMaterial({
      color: 0x1f1207,
      roughness: 0.75,
      metalness: 0.25,
      flatShading: true
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xbfa04b,
      roughness: 0.4,
      metalness: 0.85,
      flatShading: true
    });

    const eyeCavityMat = new THREE.MeshBasicMaterial({ color: 0x0a0502 });

    const hatGroup = new THREE.Group();
    scene.add(hatGroup);

    // 4. Stylized Low-Poly Sorting Hat Geometry (Faceted Origami / Papercraft Style like Nyte's model)
    const buildLowPolyHat = () => {
      hatGroup.clear();

      // 4.1 Faceted 16-Sided Angular Brim
      const brimGeom = new THREE.CylinderGeometry(2.5, 2.75, 0.12, 16, 2);
      const brimPos = brimGeom.attributes.position;
      for (let i = 0; i < brimPos.count; i++) {
        const x = brimPos.getX(i);
        const z = brimPos.getZ(i);
        const dist = Math.sqrt(x * x + z * z);
        if (dist > 0.9) {
          // Sharp polygonal wave creases
          const wave = Math.sin(x * 2.5) * 0.24 + Math.cos(z * 3.0) * 0.18;
          brimPos.setY(i, brimPos.getY(i) + wave);
        }
      }
      brimGeom.computeVertexNormals();
      const brim = new THREE.Mesh(brimGeom, lowPolyLeatherMat);
      brim.position.y = -1.25;
      hatGroup.add(brim);

      // 4.2 Angular Faceted Base Crown (12-sided)
      const baseCrownGeom = new THREE.CylinderGeometry(1.65, 2.05, 0.95, 12, 2);
      const baseCrown = new THREE.Mesh(baseCrownGeom, lowPolyLeatherMat);
      baseCrown.position.y = -0.76;
      hatGroup.add(baseCrown);

      // 4.3 Low-Poly Hatband & Bronze Buckle
      const bandGeom = new THREE.CylinderGeometry(1.88, 2.02, 0.18, 12);
      const band = new THREE.Mesh(bandGeom, beltMat);
      band.position.set(0, -1.12, 0);
      hatGroup.add(band);

      const buckleGeom = new THREE.TorusGeometry(0.2, 0.05, 6, 8);
      const buckle = new THREE.Mesh(buckleGeom, bronzeMat);
      buckle.position.set(0.72, -1.12, 1.7);
      buckle.rotation.y = 0.42;
      hatGroup.add(buckle);

      // 4.4 THE FACETED LOW-POLY FACE (Sharp Origami Brow & Eyes)
      // Angular Brow Ridge (Hexagonal cross section torus segment)
      const browGeom = new THREE.TorusGeometry(1.28, 0.24, 6, 10, Math.PI * 0.85);
      const brow = new THREE.Mesh(browGeom, lowPolyDarkCreaseMat);
      brow.position.set(0, -0.26, 0.72);
      brow.rotation.x = Math.PI * 0.18;
      hatGroup.add(brow);

      // Secondary Upper Forehead Crease
      const foreCreaseGeom = new THREE.TorusGeometry(1.1, 0.16, 5, 8, Math.PI * 0.75);
      const foreCrease = new THREE.Mesh(foreCreaseGeom, lowPolyDarkCreaseMat);
      foreCrease.position.set(0, 0.12, 0.72);
      foreCrease.rotation.x = Math.PI * 0.14;
      hatGroup.add(foreCrease);

      // Deep Low-Poly Triangular Eye Cavities
      const eyeGeom = new THREE.ConeGeometry(0.26, 0.65, 3);
      eyeGeom.rotateX(Math.PI / 2);

      const eyeLeft = new THREE.Mesh(eyeGeom, eyeCavityMat);
      eyeLeft.position.set(-0.52, -0.38, 1.48);
      eyeLeft.rotation.z = 0.4;
      hatGroup.add(eyeLeft);

      const eyeRight = new THREE.Mesh(eyeGeom, eyeCavityMat);
      eyeRight.position.set(0.52, -0.38, 1.48);
      eyeRight.rotation.z = -0.4;
      hatGroup.add(eyeRight);

      // Low-Poly Pinched Nose Fold
      const noseGeom = new THREE.ConeGeometry(0.16, 0.45, 4);
      const nose = new THREE.Mesh(noseGeom, lowPolyDarkCreaseMat);
      nose.position.set(0, -0.36, 1.6);
      nose.rotation.x = 0.35;
      hatGroup.add(nose);

      // 4.5 Low-Poly Talking Mouth Folds (Upper fold, lower fold, inner slit)
      const mouth = new THREE.Group();
      mouth.position.set(0, -0.84, 1.55);

      const upperLipGeom = new THREE.TorusGeometry(0.62, 0.12, 5, 8, Math.PI * 0.75);
      const upperLip = new THREE.Mesh(upperLipGeom, lowPolyDarkCreaseMat);
      upperLip.position.set(0, 0.08, 0.05);
      upperLip.rotation.x = Math.PI * 0.15;
      mouth.add(upperLip);

      const mouthInnerGeom = new THREE.BoxGeometry(1.2, 0.12, 0.3);
      const mouthInner = new THREE.Mesh(mouthInnerGeom, eyeCavityMat);
      mouth.add(mouthInner);

      const lowerLipGeom = new THREE.TorusGeometry(0.65, 0.14, 5, 8, Math.PI * 0.72);
      const lowerLip = new THREE.Mesh(lowerLipGeom, lowPolyDarkCreaseMat);
      lowerLip.position.set(0, -0.12, 0.02);
      lowerLip.rotation.x = -Math.PI * 0.12;
      mouth.add(lowerLip);

      hatGroup.add(mouth);

      // 4.6 Cascading Low-Poly Crown Cones (8-sided Faceted Frustums)
      // Tier 1 Cone
      const midCrownGeom = new THREE.CylinderGeometry(0.95, 1.45, 1.35, 8);
      const midCrown = new THREE.Mesh(midCrownGeom, lowPolyLeatherMat);
      midCrown.position.set(0.12, 0.52, -0.1);
      midCrown.rotation.z = -0.16;
      midCrown.rotation.x = -0.12;
      hatGroup.add(midCrown);

      // Tier 1 Crease Roll
      const midRollGeom = new THREE.TorusGeometry(1.15, 0.2, 5, 8);
      const midRoll = new THREE.Mesh(midRollGeom, lowPolyDarkCreaseMat);
      midRoll.position.set(0.08, 0.42, 0.12);
      midRoll.rotation.x = 0.25;
      midRoll.rotation.z = -0.16;
      hatGroup.add(midRoll);

      // Tier 2 Arched Cone (Curving backwards & right)
      const upperConeGeom = new THREE.ConeGeometry(0.88, 1.75, 8);
      const upperCone = new THREE.Mesh(upperConeGeom, lowPolyLeatherMat);
      upperCone.position.set(0.48, 1.75, -0.32);
      upperCone.rotation.z = -0.44;
      upperCone.rotation.x = -0.24;
      hatGroup.add(upperCone);

      // 4.7 Sharp Low-Poly Drooping Pointed Tip
      const tipGeom = new THREE.ConeGeometry(0.38, 1.15, 6);
      const tipMesh = new THREE.Mesh(tipGeom, lowPolyDarkCreaseMat);
      tipMesh.position.set(1.15, 2.45, -0.6);
      tipMesh.rotation.z = -1.22;
      tipMesh.rotation.y = 0.5;
      hatGroup.add(tipMesh);

      return { mouthGroup: mouth, tipMesh };
    };

    let { mouthGroup, tipMesh } = buildLowPolyHat();

    // 5. AUTO-LOADER: Check if user put Nyte's STL or OBJ into public/models/
    const stlLoader = new STLLoader();
    const objLoader = new OBJLoader();

    const applyImportedModel = (geometry: THREE.BufferGeometry) => {
      geometry.computeVertexNormals();
      geometry.center();

      // Auto-scale to fit scene
      geometry.computeBoundingBox();
      const bb = geometry.boundingBox;
      if (bb) {
        const size = new THREE.Vector3();
        bb.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4.8 / maxDim;
        geometry.scale(scale, scale, scale);
      }

      const importedMat = new THREE.MeshStandardMaterial({
        color: 0x54361e,
        roughness: 0.8,
        metalness: 0.12,
        flatShading: true
      });

      const importedMesh = new THREE.Mesh(geometry, importedMat);
      hatGroup.clear();
      hatGroup.add(importedMesh);
    };

    // Try loading STL
    stlLoader.load(
      './models/sorting-hat.stl',
      (geom) => {
        applyImportedModel(geom);
      },
      undefined,
      () => {
        // Try loading OBJ
        objLoader.load(
          './models/sorting-hat.obj',
          (obj) => {
            hatGroup.clear();
            obj.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh;
                m.material = lowPolyLeatherMat;
              }
            });
            // Center and scale obj
            const box = new THREE.Box3().setFromObject(obj);
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 4.8 / maxDim;
            obj.scale.set(scale, scale, scale);
            const center = new THREE.Vector3();
            box.getCenter(center);
            obj.position.sub(center.multiplyScalar(scale));
            hatGroup.add(obj);
          },
          undefined,
          () => {
            // Keep procedural low-poly hat
          }
        );
      }
    );

    // Support Drag-and-Drop of STL / OBJ files directly into the window!
    const onWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith('.stl')) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const buffer = ev.target?.result as ArrayBuffer;
            if (buffer) {
              const geom = stlLoader.parse(buffer);
              applyImportedModel(geom);
            }
          };
          reader.readAsArrayBuffer(file);
        } else if (fileName.endsWith('.obj')) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const text = ev.target?.result as string;
            if (text) {
              const obj = objLoader.parse(text);
              hatGroup.clear();
              obj.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                  (child as THREE.Mesh).material = lowPolyLeatherMat;
                }
              });
              const box = new THREE.Box3().setFromObject(obj);
              const size = new THREE.Vector3();
              box.getSize(size);
              const maxDim = Math.max(size.x, size.y, size.z);
              const scale = 4.8 / maxDim;
              obj.scale.set(scale, scale, scale);
              const center = new THREE.Vector3();
              box.getCenter(center);
              obj.position.sub(center.multiplyScalar(scale));
              hatGroup.add(obj);
            }
          };
          reader.readAsText(file);
        }
      }
    };

    const onWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('drop', onWindowDrop);
    window.addEventListener('dragover', onWindowDragOver);

    // 6. Floating Warm Candlelight Sparkles
    const particleCount = 100;
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

    // 7. Phone Gyroscope & Touch Drag Rotation Engine
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
      if (typeof e.alpha === 'number' && e.alpha !== null) {
        if (baseAlpha === null) {
          baseAlpha = e.alpha;
        }
        let diffAlpha = e.alpha - baseAlpha;
        while (diffAlpha > 180) diffAlpha -= 360;
        while (diffAlpha < -180) diffAlpha += 360;
        phoneRotationY = -(diffAlpha * Math.PI) / 180;
      }

      if (typeof e.gamma === 'number' && e.gamma !== null) {
        phoneRotationZ = (e.gamma * Math.PI) / 180 * 0.95;
        if (baseAlpha === null) {
          phoneRotationY = (e.gamma / 45) * 0.85;
        }
      }

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

    // 8. Render Animation Loop
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
      candleLight1.intensity = 3.8 + Math.sin(elapsedTime * 8.0) * 0.22;
      candleLight2.intensity = 2.2 + Math.cos(elapsedTime * 7.0) * 0.18;

      // Mode-based character animations
      if (mouthGroup && tipMesh) {
        if (mode === 'idle') {
          hatGroup.position.y = Math.sin(elapsedTime * 1.3) * 0.08;
          mouthGroup.scale.set(1.0, 1.0, 1.0);
          tipMesh.rotation.z = -1.22 + Math.sin(elapsedTime * 1.8) * 0.04;
        } else if (mode === 'question') {
          hatGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.05;
          mouthGroup.scale.set(1.0, 0.95, 1.0);
          tipMesh.rotation.z = -1.22 + Math.sin(elapsedTime * 1.4) * 0.03;
        } else if (mode === 'thinking') {
          hatGroup.position.y = Math.sin(elapsedTime * 4.0) * 0.12;
          const mouthOpen = 0.9 + Math.abs(Math.sin(elapsedTime * 8.5)) * 0.85;
          mouthGroup.scale.set(1.05, mouthOpen, 1.0);
          tipMesh.rotation.z = -1.22 + Math.sin(elapsedTime * 5.0) * 0.2;
        } else if (mode === 'reveal') {
          hatGroup.position.y = 0.2 + Math.sin(elapsedTime * 2.2) * 0.08;
          mouthGroup.scale.set(1.15, 1.9, 1.05);
          tipMesh.rotation.z = -1.22 + Math.sin(elapsedTime * 6.0) * 0.28;
        }
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
      mouthGroup,
      tipMesh,
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
      window.removeEventListener('drop', onWindowDrop);
      window.removeEventListener('dragover', onWindowDragOver);
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
