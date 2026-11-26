import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { observeElementResize } from '../utils/canvasHelpers';

interface TravelGuide3DIconProps {
  className?: string;
}

function createMapCanvasTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Warm parchment base
    const bgGrad = ctx.createLinearGradient(0, 0, 768, 512);
    bgGrad.addColorStop(0, '#F7ECD2');
    bgGrad.addColorStop(0.5, '#EFE0BC');
    bgGrad.addColorStop(1, '#E6D2A4');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 768, 512);

    // Subtle cartographic grid lines
    ctx.strokeStyle = 'rgba(139, 98, 52, 0.14)';
    ctx.lineWidth = 2;
    for (let x = 64; x < 768; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 18);
      ctx.lineTo(x, 494);
      ctx.stroke();
    }
    for (let y = 64; y < 512; y += 64) {
      ctx.beginPath();
      ctx.moveTo(18, y);
      ctx.lineTo(750, y);
      ctx.stroke();
    }

    // Lake Titicaca on the left panel
    const lakeGrad = ctx.createLinearGradient(24, 90, 235, 390);
    lakeGrad.addColorStop(0, '#3D88C8');
    lakeGrad.addColorStop(1, '#225D99');
    ctx.fillStyle = lakeGrad;
    ctx.beginPath();
    ctx.moveTo(22, 110);
    ctx.bezierCurveTo(135, 95, 225, 165, 210, 260);
    ctx.bezierCurveTo(195, 345, 140, 405, 22, 395);
    ctx.closePath();
    ctx.fill();

    // Soft shoreline ripple
    ctx.strokeStyle = '#9ED8F6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(32, 126);
    ctx.bezierCurveTo(126, 116, 204, 178, 192, 256);
    ctx.bezierCurveTo(180, 330, 128, 386, 32, 380);
    ctx.stroke();

    // Altiplano sage & golden plains
    ctx.fillStyle = 'rgba(116, 162, 102, 0.34)';
    ctx.beginPath();
    ctx.ellipse(395, 325, 165, 105, -0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(217, 160, 91, 0.28)';
    ctx.beginPath();
    ctx.ellipse(540, 190, 150, 100, 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Illustrated mountain contour lines on the right panel
    ctx.strokeStyle = 'rgba(112, 74, 42, 0.42)';
    ctx.lineWidth = 3;
    const drawPeakLine = (cx: number, cy: number, w: number, h: number) => {
      ctx.beginPath();
      ctx.moveTo(cx - w, cy);
      ctx.lineTo(cx, cy - h);
      ctx.lineTo(cx + w, cy);
      ctx.stroke();
    };
    drawPeakLine(595, 220, 62, 78);
    drawPeakLine(665, 255, 58, 70);
    drawPeakLine(625, 335, 54, 62);

    // Dotted golden-terracotta route path across the 3 panels
    ctx.save();
    ctx.strokeStyle = '#C84B31';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.setLineDash([14, 14]);
    ctx.beginPath();
    ctx.moveTo(135, 365);
    ctx.bezierCurveTo(235, 340, 290, 230, 392, 248);
    ctx.bezierCurveTo(475, 262, 515, 170, 565, 185);
    ctx.stroke();
    ctx.restore();

    // Waypoint dots along route
    const waypoints: Array<[number, number, string]> = [
      [135, 365, '#1D4E89'],
      [286, 272, '#D97706'],
      [392, 248, '#F5B700'],
      [565, 185, '#C84B31']
    ];
    waypoints.forEach(([wx, wy, col]) => {
      ctx.beginPath();
      ctx.arc(wx, wy, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF8E7';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(wx, wy, 7, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    });

    // Fold crease shadows at 1/3 and 2/3
    [256, 512].forEach((foldX) => {
      const crease = ctx.createLinearGradient(foldX - 16, 0, foldX + 16, 0);
      crease.addColorStop(0, 'rgba(65, 40, 18, 0)');
      crease.addColorStop(0.5, 'rgba(65, 40, 18, 0.24)');
      crease.addColorStop(1, 'rgba(65, 40, 18, 0)');
      ctx.fillStyle = crease;
      ctx.fillRect(foldX - 16, 0, 32, 512);
    });

    // Outer double border
    ctx.strokeStyle = '#9E6B3B';
    ctx.lineWidth = 10;
    ctx.strokeRect(14, 14, 740, 484);
    ctx.strokeStyle = '#C69254';
    ctx.lineWidth = 3;
    ctx.strokeRect(26, 26, 716, 460);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function createCompassDialTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const cx = 256;
    const cy = 256;

    // Ivory dial face
    const radial = ctx.createRadialGradient(cx, cy, 30, cx, cy, 248);
    radial.addColorStop(0, '#FFFDF7');
    radial.addColorStop(0.82, '#F7ECD2');
    radial.addColorStop(1, '#DFC48C');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(cx, cy, 250, 0, Math.PI * 2);
    ctx.fill();

    // Outer ring ticks
    ctx.save();
    ctx.translate(cx, cy);
    for (let i = 0; i < 36; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 36);
      const isMajor = i % 3 === 0;
      ctx.strokeStyle = isMajor ? '#3D2512' : 'rgba(61, 37, 18, 0.45)';
      ctx.lineWidth = isMajor ? 5 : 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -234);
      ctx.lineTo(0, isMajor ? -206 : -218);
      ctx.stroke();
      ctx.restore();
    }

    // Inner compass star rose
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 2);
      ctx.beginPath();
      ctx.moveTo(0, -135);
      ctx.lineTo(24, -22);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = i === 0 ? '#C84B31' : '#D9A05B';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, -135);
      ctx.lineTo(-24, -22);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = i === 0 ? '#8E2A17' : '#8C5E2A';
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // Cardinal letters
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 42px Georgia, serif';
    ctx.fillStyle = '#C84B31';
    ctx.fillText('N', cx, cy - 170);
    ctx.fillStyle = '#2B1B0E';
    ctx.font = 'bold 34px Georgia, serif';
    ctx.fillText('S', cx, cy + 170);
    ctx.fillText('E', cx + 170, cy);
    ctx.fillText('O', cx - 170, cy);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function setBoxTopPanelUVs(geo: THREE.BoxGeometry, uStart: number, uEnd: number) {
  const uv = geo.attributes.uv;
  const norm = geo.attributes.normal;
  for (let i = 0; i < uv.count; i++) {
    // Top face (+Y) carries the slice of the map texture
    if (norm.getY(i) > 0.8) {
      const u = uv.getX(i);
      uv.setX(i, uStart + u * (uEnd - uStart));
    }
  }
  uv.needsUpdate = true;
}

export const TravelGuide3DIcon: React.FC<TravelGuide3DIconProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const pointerOffsetRef = useRef({ x: 0, y: 0 });
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    setWebglUnavailable(false);

    const width = Math.max(container.clientWidth, 180);
    const height = Math.max(container.clientHeight, 150);

    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: isSoftwareGl ? 'default' : 'high-performance'
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    const onContextRestored = () => {
      setWebglUnavailable(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 30);
    camera.position.set(0.1, 2.35, 3.65);
    camera.lookAt(0.05, 0.08, 0);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };
    const trackTex = <T extends THREE.Texture>(t: T): T => {
      textures.push(t);
      return t;
    };

    // Warm/Cool Studio Lighting
    scene.add(new THREE.HemisphereLight(0xcbe8ff, 0x3b2614, 0.95));
    const keyLight = new THREE.DirectionalLight(0xffe6bd, 2.35);
    keyLight.position.set(3.2, 4.8, 3.6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x63c7a6, 1.15);
    rimLight.position.set(-3.6, 2.2, -2.5);
    scene.add(rimLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const mapTex = trackTex(createMapCanvasTexture(maxAniso));
    const dialTex = trackTex(createCompassDialTexture(maxAniso));

    const parchmentEdgeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd9be8a,
        roughness: 0.72,
        metalness: 0.05
      })
    );
    const mapFaceMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: mapTex,
        roughness: 0.62,
        metalness: 0.04
      })
    );
    const goldMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf5b700,
        metalness: 0.9,
        roughness: 0.18
      })
    );
    const brassMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xc58528,
        metalness: 0.85,
        roughness: 0.28
      })
    );
    const redMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd64550,
        roughness: 0.32,
        metalness: 0.14
      })
    );
    const silverMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe8edf2,
        roughness: 0.22,
        metalness: 0.82
      })
    );
    const mountainMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x8b6239,
        roughness: 0.82,
        metalness: 0.05,
        flatShading: true
      })
    );
    const snowMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfffaf0,
        roughness: 0.45,
        metalness: 0.04
      })
    );

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Folded 3-Panel Topographic Map Group
    const mapGroup = new THREE.Group();
    mapGroup.position.set(-0.22, -0.08, -0.05);
    mapGroup.rotation.x = 0.18;
    rootGroup.add(mapGroup);

    const panelW = 0.76;
    const panelH = 0.065;
    const panelD = 1.56;
    const foldAngle = 0.26;
    const sideOffsetX = Math.cos(foldAngle) * panelW;
    const sideOffsetZ = Math.sin(foldAngle) * panelW * 0.5;

    const createPanel = (uStart: number, uEnd: number) => {
      const geo = trackGeo(new THREE.BoxGeometry(panelW, panelH, panelD));
      setBoxTopPanelUVs(geo, uStart, uEnd);
      const mats = [
        parchmentEdgeMat,
        parchmentEdgeMat,
        mapFaceMat,
        parchmentEdgeMat,
        parchmentEdgeMat,
        parchmentEdgeMat
      ];
      return new THREE.Mesh(geo, mats);
    };

    const centerPanel = createPanel(1 / 3, 2 / 3);
    mapGroup.add(centerPanel);

    const leftPanel = createPanel(0, 1 / 3);
    leftPanel.position.set(-sideOffsetX + 0.02, 0.035, sideOffsetZ * 0.55);
    leftPanel.rotation.y = foldAngle;
    leftPanel.rotation.z = -0.14;
    mapGroup.add(leftPanel);

    const rightPanel = createPanel(2 / 3, 1);
    rightPanel.position.set(sideOffsetX - 0.02, 0.035, -sideOffsetZ * 0.55);
    rightPanel.rotation.y = -foldAngle;
    rightPanel.rotation.z = 0.14;
    mapGroup.add(rightPanel);

    // Miniature 3D Cordillera peaks on the right panel
    const peak1 = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.14, 0.24, 5)), mountainMat);
    peak1.position.set(0.11, 0.15, -0.22);
    rightPanel.add(peak1);
    const cap1 = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.065, 0.11, 5)), snowMat);
    cap1.position.set(0.11, 0.23, -0.22);
    rightPanel.add(cap1);

    const peak2 = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.11, 0.19, 5)), mountainMat);
    peak2.position.set(-0.08, 0.125, -0.38);
    rightPanel.add(peak2);
    const cap2 = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.05, 0.085, 5)), snowMat);
    cap2.position.set(-0.08, 0.19, -0.38);
    rightPanel.add(cap2);

    // Animated floating 3D location pin above Peñas
    const pinGroup = new THREE.Group();
    pinGroup.position.set(0.12, 0.28, -0.05);
    centerPanel.add(pinGroup);

    const pinStem = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.055, 0.18, 12)), goldMat);
    pinStem.rotation.x = Math.PI;
    pinStem.position.y = 0.09;
    pinGroup.add(pinStem);

    const pinHead = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.095, 16, 14)), redMat);
    pinHead.position.y = 0.22;
    pinGroup.add(pinHead);

    const pinHalo = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.12, 0.016, 10, 24)), goldMat);
    pinHalo.rotation.x = Math.PI / 2;
    pinHalo.position.y = -0.2;
    pinGroup.add(pinHalo);

    // 2. Ornate 3D Brass Compass Group hovering/resting cleanly alongside the map
    const compassGroup = new THREE.Group();
    compassGroup.position.set(0.68, 0.44, 0.42);
    compassGroup.rotation.set(0.62, -0.22, -0.14);
    rootGroup.add(compassGroup);

    const compassBody = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.56, 0.59, 0.16, 36)),
      brassMat
    );
    compassGroup.add(compassBody);

    const compassBezel = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.56, 0.055, 16, 40)),
      goldMat
    );
    compassBezel.rotation.x = Math.PI / 2;
    compassBezel.position.y = 0.075;
    compassGroup.add(compassBezel);

    // Top crown stem & pendant ring
    const crownStem = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.06, 0.07, 0.14, 14)),
      goldMat
    );
    crownStem.position.set(0, 0.01, -0.64);
    crownStem.rotation.x = Math.PI / 2;
    compassGroup.add(crownStem);

    const pendantRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.11, 0.025, 12, 24)),
      goldMat
    );
    pendantRing.position.set(0, 0.01, -0.77);
    compassGroup.add(pendantRing);

    // Compass rose dial
    const dialMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: dialTex,
        roughness: 0.42,
        metalness: 0.08
      })
    );
    const dialDisc = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.51, 0.51, 0.02, 36)),
      dialMat
    );
    dialDisc.position.y = 0.076;
    compassGroup.add(dialDisc);

    // Animated 3D Compass Needle
    const needleGroup = new THREE.Group();
    needleGroup.position.y = 0.105;
    compassGroup.add(needleGroup);

    const northTip = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.058, 0.34, 4)), redMat);
    northTip.rotation.x = -Math.PI / 2;
    northTip.position.z = -0.17;
    northTip.scale.y = 0.45;
    needleGroup.add(northTip);

    const southTip = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.058, 0.34, 4)), silverMat);
    southTip.rotation.x = Math.PI / 2;
    southTip.position.z = 0.17;
    southTip.scale.y = 0.45;
    needleGroup.add(southTip);

    const centerCap = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.062, 16, 12)), goldMat);
    centerCap.scale.y = 0.6;
    needleGroup.add(centerCap);

    // Clear glass cover
    const glassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.06,
        metalness: 0,
        transparent: true,
        opacity: isSoftwareGl ? 0.2 : 0.28,
        clearcoat: 1.0,
        depthWrite: false
      })
    );
    const glassDisc = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.52, 0.52, 0.015, 32)),
      glassMat
    );
    glassDisc.position.y = 0.13;
    glassDisc.renderOrder = 2;
    compassGroup.add(glassDisc);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerOffsetRef.current.x = THREE.MathUtils.clamp(nx, -1, 1);
      pointerOffsetRef.current.y = THREE.MathUtils.clamp(ny, -1, 1);
    };
    const handlePointerLeave = () => {
      pointerOffsetRef.current.x = 0;
      pointerOffsetRef.current.y = 0;
    };
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = Math.max(mountRef.current.clientWidth, 180);
      const h = Math.max(mountRef.current.clientHeight, 150);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const stopResizeObserver = observeElementResize(container, handleResize);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (sync && state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      // Gentle floating & interactive tilt on the entire map+compass icon
      rootGroup.position.y = Math.sin(t * 1.9) * 0.07;
      const targetRotY = Math.sin(t * 0.9) * 0.16 + pointerOffsetRef.current.x * 0.25;
      const targetRotX = Math.cos(t * 1.1) * 0.05 + pointerOffsetRef.current.y * 0.12;
      rootGroup.rotation.y = THREE.MathUtils.damp(rootGroup.rotation.y, targetRotY, 5, dt);
      rootGroup.rotation.x = THREE.MathUtils.damp(rootGroup.rotation.x, targetRotX, 5, dt);

      // Pin bobs smoothly above Peñas
      pinGroup.position.y = 0.26 + Math.sin(t * 3.1) * 0.055;
      pinHalo.scale.setScalar(1 + Math.sin(t * 3.1) * 0.14);

      // Compass hovers slightly and needle sweeps & settles toward North
      compassGroup.position.y = 0.44 + Math.sin(t * 2.3 + 0.8) * 0.045;
      needleGroup.rotation.y =
        Math.sin(t * 1.65) * 0.42 + Math.sin(t * 4.2) * 0.14 - rootGroup.rotation.y * 0.6;

      renderer.render(scene, camera);
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      stopResizeObserver();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      envTarget.dispose();
      textures.forEach((tex) => tex.dispose());
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-52 h-40 sm:w-64 sm:h-48 select-none ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(82,183,136,0.28)_0%,rgba(245,183,0,0.16)_48%,transparent_72%)]"
      />
      {!webglUnavailable ? (
        <div ref={mountRef} className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex items-center justify-center animate-float-slow">
          <svg viewBox="0 0 140 110" className="w-44 h-36 drop-shadow-xl" aria-hidden="true">
            <polygon points="16,28 46,20 46,84 16,92" fill="#EFE0BC" stroke="#9E6B3B" strokeWidth="2.5" />
            <polygon points="46,20 78,28 78,92 46,84" fill="#F7ECD2" stroke="#9E6B3B" strokeWidth="2.5" />
            <polygon points="78,28 110,20 110,84 78,92" fill="#E6D2A4" stroke="#9E6B3B" strokeWidth="2.5" />
            <path d="M26,74 Q54,60 72,56 T96,40" fill="none" stroke="#C84B31" strokeWidth="3.5" strokeDasharray="5 4" />
            <circle cx="98" cy="64" r="24" fill="#C58528" stroke="#F5B700" strokeWidth="3" />
            <circle cx="98" cy="64" r="18" fill="#FFF8E7" />
            <polygon points="98,49 102,64 94,64" fill="#C84B31" />
            <polygon points="98,79 102,64 94,64" fill="#94A3B8" />
            <circle cx="98" cy="64" r="3" fill="#F5B700" />
          </svg>
        </div>
      )}
    </div>
  );
};
