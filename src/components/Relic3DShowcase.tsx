import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { StageData } from '../types/game';
import { observeElementResize } from '../utils/canvasHelpers';
import { RelicIcon } from './RelicIcon';

interface Relic3DShowcaseProps {
  icon: StageData['relicIcon'];
  className?: string;
}

function createChakanaShape(scale = 1): THREE.Shape {
  // 12-step Andean Chakana cross profile centered at (0, 0)
  const s = scale;
  const pts: [number, number][] = [
    [-0.34, 1.0],
    [0.34, 1.0],
    [0.34, 0.68],
    [0.68, 0.68],
    [0.68, 0.34],
    [1.0, 0.34],
    [1.0, -0.34],
    [0.68, -0.34],
    [0.68, -0.68],
    [0.34, -0.68],
    [0.34, -1.0],
    [-0.34, -1.0],
    [-0.34, -0.68],
    [-0.68, -0.68],
    [-0.68, -0.34],
    [-1.0, -0.34],
    [-1.0, 0.34],
    [-0.68, 0.34],
    [-0.68, 0.68],
    [-0.34, 0.68]
  ];
  const shape = new THREE.Shape();
  shape.moveTo(pts[0][0] * s, pts[0][1] * s);
  for (let i = 1; i < pts.length; i++) {
    shape.lineTo(pts[i][0] * s, pts[i][1] * s);
  }
  shape.closePath();

  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.25 * s, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return shape;
}

export const Relic3DShowcase: React.FC<Relic3DShowcaseProps> = ({ icon, className = '' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    setWebglUnavailable(false);

    const width = Math.max(container.clientWidth, 240);
    const height = Math.max(container.clientHeight, 220);

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

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 40);
    camera.position.set(0.35, 0.75, 4.15);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.4;
    controls.minPolarAngle = Math.PI * 0.25;
    controls.maxPolarAngle = Math.PI * 0.75;

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };

    // Studio ceremonial lighting
    scene.add(new THREE.AmbientLight(0xfff1d6, 0.65));

    const keyLight = new THREE.DirectionalLight(0xffdfb0, 2.3);
    keyLight.position.set(3.5, 4.5, 4.0);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x4ea8de, 1.35);
    rimLight.position.set(-4.0, 1.8, -3.2);
    scene.add(rimLight);

    const warmUnderLight = new THREE.PointLight(0xf5b700, 1.8, 12);
    warmUnderLight.position.set(0, -1.6, 1.8);
    scene.add(warmUnderLight);

    // Shared high-craft materials
    const goldMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf5b700,
        metalness: 0.88,
        roughness: 0.22
      })
    );
    const brightGoldMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffdf78,
        metalness: 0.9,
        roughness: 0.16
      })
    );
    const bronzeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb97132,
        metalness: 0.84,
        roughness: 0.28
      })
    );
    const darkBronzeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x6b3e1b,
        metalness: 0.78,
        roughness: 0.34
      })
    );
    const woodMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x5c3419,
        metalness: 0.08,
        roughness: 0.62
      })
    );
    const stoneMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x7b746b,
        metalness: 0.06,
        roughness: 0.84,
        flatShading: true
      })
    );
    const jadeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x2d8a68,
        metalness: 0.12,
        roughness: 0.35
      })
    );
    const lapisMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x2268a8,
        metalness: 0.28,
        roughness: 0.25,
        emissive: 0x0b2545,
        emissiveIntensity: 0.45
      })
    );

    // Pedestal halo ring beneath relic
    const relicGroup = new THREE.Group();
    scene.add(relicGroup);

    const haloRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.18, 0.025, 12, 48)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xf5b700,
          emissive: 0xd99b26,
          emissiveIntensity: 0.55,
          metalness: 0.85,
          roughness: 0.2
        })
      )
    );
    haloRing.rotation.x = Math.PI / 2;
    haloRing.position.y = -1.25;
    scene.add(haloRing);

    // Build authentic 3D mesh per relic type
    if (icon === 'chakana') {
      const baseShape = createChakanaShape(1.12);
      const outerGeo = trackGeo(
        new THREE.ExtrudeGeometry(baseShape, {
          depth: 0.24,
          bevelEnabled: true,
          bevelSegments: 3,
          steps: 1,
          bevelSize: 0.035,
          bevelThickness: 0.035
        })
      );
      outerGeo.center();
      const outerMesh = new THREE.Mesh(outerGeo, bronzeMat);
      relicGroup.add(outerMesh);

      const innerShape = createChakanaShape(0.84);
      const innerGeo = trackGeo(
        new THREE.ExtrudeGeometry(innerShape, {
          depth: 0.31,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.02,
          bevelThickness: 0.02
        })
      );
      innerGeo.center();
      const innerMesh = new THREE.Mesh(innerGeo, goldMat);
      relicGroup.add(innerMesh);

      const coreRing = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.28, 0.045, 14, 32)),
        brightGoldMat
      );
      coreRing.position.z = 0.16;
      relicGroup.add(coreRing);

      const coreRingBack = coreRing.clone();
      coreRingBack.position.z = -0.16;
      relicGroup.add(coreRingBack);

      const jewel = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.21, 0)), lapisMat);
      relicGroup.add(jewel);
    } else if (icon === 'bell') {
      const bellPts = [
        new THREE.Vector2(0.05, 0.85),
        new THREE.Vector2(0.24, 0.82),
        new THREE.Vector2(0.42, 0.62),
        new THREE.Vector2(0.48, 0.18),
        new THREE.Vector2(0.56, -0.35),
        new THREE.Vector2(0.76, -0.72),
        new THREE.Vector2(0.82, -0.82),
        new THREE.Vector2(0.68, -0.84),
        new THREE.Vector2(0.58, -0.68)
      ];
      const bellGeo = trackGeo(new THREE.LatheGeometry(bellPts, 36));
      const bellMesh = new THREE.Mesh(bellGeo, goldMat);
      bellMesh.position.y = -0.05;
      relicGroup.add(bellMesh);

      // Decorative bands
      const bandTop = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.46, 0.032, 12, 32)), bronzeMat);
      bandTop.rotation.x = Math.PI / 2;
      bandTop.position.y = 0.44;
      relicGroup.add(bandTop);

      const bandLow = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.67, 0.036, 12, 32)), brightGoldMat);
      bandLow.rotation.x = Math.PI / 2;
      bandLow.position.y = -0.58;
      relicGroup.add(bandLow);

      // Clapper
      const clapperRod = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 0.85, 10)),
        darkBronzeMat
      );
      clapperRod.position.y = -0.45;
      relicGroup.add(clapperRod);

      const clapperBall = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.14, 16, 14)), bronzeMat);
      clapperBall.position.y = -0.85;
      relicGroup.add(clapperBall);

      // Carved wooden yoke & bronze crown at top
      const yoke = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.18, 0.22, 0.28)), woodMat);
      yoke.position.y = 0.96;
      relicGroup.add(yoke);

      const ringLoop = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.16, 0.04, 10, 24)), bronzeMat);
      ringLoop.position.y = 1.15;
      relicGroup.add(ringLoop);
    } else if (icon === 'loom') {
      // Spindle & woven Andean trade spool ("Hilo del Trueque")
      const spindle = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.06, 0.04, 2.25, 14)),
        woodMat
      );
      relicGroup.add(spindle);

      const whorl = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.48, 0.54, 0.14, 24)),
        bronzeMat
      );
      whorl.position.y = -0.78;
      relicGroup.add(whorl);

      const threadPalette = [0xd64550, 0xf5b700, 0x52b788, 0x38bdf8, 0xd64550, 0xf5b700];
      threadPalette.forEach((hex, idx) => {
        const yOff = -0.52 + idx * 0.22;
        const radius = 0.42 - Math.abs(idx - 2.5) * 0.045;
        const coilMat = trackMat(
          new THREE.MeshStandardMaterial({
            color: hex,
            metalness: 0.18,
            roughness: 0.58
          })
        );
        const coil = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(radius, 0.115, 14, 28)),
          coilMat
        );
        coil.rotation.x = Math.PI / 2;
        coil.rotation.y = (idx % 2 === 0 ? 1 : -1) * 0.08;
        coil.position.y = yOff;
        relicGroup.add(coil);
      });

      const tipCap = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.1, 0.26, 14)), goldMat);
      tipCap.position.y = 1.16;
      relicGroup.add(tipCap);
      relicGroup.rotation.z = -0.22;
    } else if (icon === 'quinoa') {
      // Sacred K'oa Stone ("Piedra de K'oa")
      const rockGeo = trackGeo(new THREE.IcosahedronGeometry(0.88, 1));
      const pos = rockGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const scale = 1 + Math.sin(x * 3.1 + z * 2.4) * 0.12;
        pos.setXYZ(i, x * 1.15 * scale, y * 0.72 * scale, z * 0.96 * scale);
      }
      rockGeo.computeVertexNormals();
      const rockMesh = new THREE.Mesh(rockGeo, stoneMat);
      rockMesh.position.y = -0.32;
      relicGroup.add(rockMesh);

      // Embedded golden Chakana medallion on the stone front
      const miniChakanaGeo = trackGeo(
        new THREE.ExtrudeGeometry(createChakanaShape(0.28), {
          depth: 0.06,
          bevelEnabled: true,
          bevelSize: 0.01,
          bevelThickness: 0.01
        })
      );
      miniChakanaGeo.center();
      const miniChakana = new THREE.Mesh(miniChakanaGeo, goldMat);
      miniChakana.position.set(0, -0.28, 0.78);
      relicGroup.add(miniChakana);

      // Ceremonial K'oa herbal sprigs growing from crown of stone
      const leafAngles = [-0.55, -0.2, 0.15, 0.5, 0.82];
      leafAngles.forEach((ang, idx) => {
        const stemPivot = new THREE.Group();
        stemPivot.position.set((idx - 2) * 0.14, 0.22, (idx % 2 === 0 ? 1 : -1) * 0.12);
        stemPivot.rotation.z = ang * 0.5;
        stemPivot.rotation.x = (idx % 2 === 0 ? 1 : -1) * 0.18;

        const stem = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.025, 0.035, 0.75, 8)),
          jadeMat
        );
        stem.position.y = 0.35;
        stemPivot.add(stem);

        const blossom = new THREE.Mesh(
          trackGeo(new THREE.SphereGeometry(0.11, 10, 10)),
          idx % 2 === 0 ? brightGoldMat : jadeMat
        );
        blossom.scale.set(1, 1.35, 0.75);
        blossom.position.y = 0.75;
        stemPivot.add(blossom);

        relicGroup.add(stemPivot);
      });
    } else if (icon === 'wiphala') {
      // Ceremonial Yaya-Mama Ocher Brush & Pigment Palette
      const brushPivot = new THREE.Group();
      brushPivot.rotation.z = -0.35;

      const handle = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.08, 0.055, 1.55, 14)),
        woodMat
      );
      handle.position.y = -0.22;
      brushPivot.add(handle);

      const bandHexes = [0xc84b31, 0xf5b700, 0x52b788, 0x4ea8de];
      bandHexes.forEach((hex, idx) => {
        const band = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.084, 0.082, 0.07, 14)),
          trackMat(new THREE.MeshStandardMaterial({ color: hex, roughness: 0.35 }))
        );
        band.position.y = -0.35 + idx * 0.12;
        brushPivot.add(band);
      });

      const ferrule = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.11, 0.085, 0.28, 16)),
        goldMat
      );
      ferrule.position.y = 0.65;
      brushPivot.add(ferrule);

      const bristles = new THREE.Mesh(
        trackGeo(new THREE.ConeGeometry(0.16, 0.48, 16)),
        trackMat(
          new THREE.MeshStandardMaterial({
            color: 0xc84b31,
            emissive: 0x5c180c,
            emissiveIntensity: 0.25,
            roughness: 0.55
          })
        )
      );
      bristles.position.y = 1.02;
      brushPivot.add(bristles);

      const pigmentTip = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.075, 12, 12)),
        brightGoldMat
      );
      pigmentTip.position.y = 1.24;
      brushPivot.add(pigmentTip);
      relicGroup.add(brushPivot);

      // Small mineral palette stone beside brush
      const palette = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.62, 0.66, 0.12, 20)),
        stoneMat
      );
      palette.rotation.x = 0.72;
      palette.position.set(0.32, -0.58, 0.25);
      relicGroup.add(palette);
    } else if (icon === 'key') {
      // Cruz de Piedra del Calvario
      const stepBase = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.15, 0.22, 0.65)), stoneMat);
      stepBase.position.y = -0.96;
      relicGroup.add(stepBase);

      const stepMid = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.76, 0.22, 0.48)), stoneMat);
      stepMid.position.y = -0.74;
      relicGroup.add(stepMid);

      const pillar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.32, 1.75, 0.28)), stoneMat);
      pillar.position.y = 0.2;
      relicGroup.add(pillar);

      const crossbar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.18, 0.3, 0.26)), stoneMat);
      crossbar.position.y = 0.54;
      relicGroup.add(crossbar);

      // Inlaid golden sunburst medallion at intersection
      const centerDisc = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.32, 20)),
        goldMat
      );
      centerDisc.rotation.x = Math.PI / 2;
      centerDisc.position.y = 0.54;
      relicGroup.add(centerDisc);

      const halo = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.34, 0.035, 10, 28)), brightGoldMat);
      halo.position.y = 0.54;
      relicGroup.add(halo);
    } else {
      // 'carabiner': Mosquetón del Cóndor
      const dPath = new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(-0.35, 0.92, 0),
          new THREE.Vector3(0.28, 0.85, 0),
          new THREE.Vector3(0.58, 0.35, 0),
          new THREE.Vector3(0.58, -0.42, 0),
          new THREE.Vector3(0.25, -0.92, 0),
          new THREE.Vector3(-0.36, -0.88, 0),
          new THREE.Vector3(-0.56, -0.35, 0),
          new THREE.Vector3(-0.56, 0.42, 0)
        ],
        true
      );
      const bodyGeo = trackGeo(new THREE.TubeGeometry(dPath, 56, 0.13, 14, true));
      const carabinerBody = new THREE.Mesh(bodyGeo, goldMat);
      relicGroup.add(carabinerBody);

      // Anodized alpine blue screw-lock gate sleeve on right leg
      const gateSleeve = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.175, 0.175, 0.58, 16)),
        lapisMat
      );
      gateSleeve.position.set(0.58, -0.02, 0);
      relicGroup.add(gateSleeve);

      // Condor crest wing accent along left spine
      const wingMat = brightGoldMat;
      [-1, 1].forEach((side) => {
        const wing = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.55, 0.16, 0.08)), wingMat);
        wing.position.set(-0.78, 0.12, side * 0.04);
        wing.rotation.z = 0.42;
        wing.rotation.y = side * 0.25;
        relicGroup.add(wing);
      });
      relicGroup.rotation.z = -0.18;
    }

    // Subtle floating golden motes around the relic
    const moteCount = 18;
    const motes: THREE.Mesh[] = [];
    const moteGeo = trackGeo(new THREE.SphereGeometry(0.032, 8, 8));
    const moteMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xffdf78,
        transparent: true,
        opacity: 0.75
      })
    );
    for (let i = 0; i < moteCount; i++) {
      const m = new THREE.Mesh(moteGeo, moteMat);
      m.userData = {
        angle: (i / moteCount) * Math.PI * 2,
        radius: 1.05 + (i % 4) * 0.22,
        height: ((i % 5) - 2) * 0.42,
        speed: 0.45 + (i % 3) * 0.18
      };
      scene.add(m);
      motes.push(m);
    }

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = Math.max(mountRef.current.clientWidth, 240);
      const h = Math.max(mountRef.current.clientHeight, 220);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const stopResizeObserver = observeElementResize(container, handleResize);

    const clock = new THREE.Clock();
    let rafId = 0;
    let disposed = false;

    const tick = () => {
      if (disposed) return;
      const t = clock.getElapsedTime();
      relicGroup.position.y = Math.sin(t * 1.8) * 0.09;
      haloRing.rotation.z = t * 0.35;

      motes.forEach((m) => {
        const d = m.userData;
        const a = d.angle + t * d.speed;
        m.position.set(
          Math.cos(a) * d.radius,
          d.height + Math.sin(t * 1.4 + d.angle) * 0.16,
          Math.sin(a) * d.radius
        );
      });

      controls.update();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      stopResizeObserver();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();
      envTarget.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [icon]);

  return (
    <div className={`relative w-full h-[240px] sm:h-[280px] select-none ${className}`}>
      {/* Soft Radial Backlight Behind 3D Relic */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-full bg-[radial-gradient(circle,rgba(245,183,0,0.28)_0%,rgba(78,168,222,0.1)_48%,transparent_72%)]"
      />

      {!webglUnavailable ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-[#F5B700] via-[#D99B26] to-[#7A4921] border-4 border-[#FFF8E7] flex items-center justify-center shadow-[0_14px_38px_rgba(245,183,0,0.45)] animate-float-slow">
            <RelicIcon icon={icon} unlocked className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-xl" />
          </div>
        </div>
      )}
    </div>
  );
};
