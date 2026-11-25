import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface FloatingProp {
  group: THREE.Group;
  baseX: number;
  baseY: number;
  baseZ: number;
  speed: number;
  phase: number;
  rotSpeedX: number;
  rotSpeedY: number;
}

function detectSoftwareGl(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createFourPointStarGeometry(): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  const points = 4;
  const outer = 0.42;
  const inner = 0.14;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}

export const ThreeAmbientScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(
      mountEl.clientWidth || window.innerWidth,
      mountEl.clientHeight || window.innerHeight
    );
    renderer.shadowMap.enabled = false;
    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050608, 0.046);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const width = mountEl.clientWidth || window.innerWidth;
    const height = mountEl.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 60);
    camera.position.set(0, 0, 10.8);

    const hemi = new THREE.HemisphereLight(0xcbd5e1, 0x050608, 0.8);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xe2e8f0, 1.3);
    keyLight.position.set(6, 7, 8);
    scene.add(keyLight);

    const emeraldRim = new THREE.DirectionalLight(0x10b981, 1.65);
    emeraldRim.position.set(-7, -3, -3);
    scene.add(emeraldRim);

    const gunmetalMat = new THREE.MeshPhysicalMaterial({
      color: 0x161b22,
      roughness: 0.28,
      metalness: 0.72,
      clearcoat: 0.85,
      clearcoatRoughness: 0.16,
    });

    const holoSilverMat = new THREE.MeshPhysicalMaterial({
      color: 0xcbd5e1,
      roughness: 0.16,
      metalness: 0.82,
      iridescence: 1.0,
      iridescenceIOR: 1.45,
      clearcoat: 1.0,
    });

    const emeraldGlowMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 0.9,
      roughness: 0.24,
      metalness: 0.35,
    });

    const starGeo = createFourPointStarGeometry();
    const ringGeo = new THREE.TorusGeometry(0.46, 0.055, 12, 32);
    const octGeo = new THREE.OctahedronGeometry(0.38, 0);
    const cartBodyGeo = new THREE.BoxGeometry(0.62, 0.7, 0.12);
    const cartGripGeo = new THREE.BoxGeometry(0.54, 0.09, 0.14);
    const cartPlateGeo = new THREE.BoxGeometry(0.42, 0.34, 0.02);

    const props: FloatingProp[] = [];

    const addOrbitalRing = (x: number, y: number, z: number, scale: number, phase: number) => {
      const g = new THREE.Group();
      const ring = new THREE.Mesh(ringGeo, holoSilverMat);
      const core = new THREE.Mesh(octGeo, gunmetalMat);
      core.scale.setScalar(0.55);
      const beacon = new THREE.Mesh(starGeo, emeraldGlowMat);
      beacon.scale.setScalar(0.32);
      beacon.position.set(0.36, 0.32, 0.1);
      g.add(ring, core, beacon);
      g.position.set(x, y, z);
      g.scale.setScalar(scale);
      scene.add(g);
      props.push({
        group: g,
        baseX: x,
        baseY: y,
        baseZ: z,
        speed: 0.56,
        phase,
        rotSpeedX: 0.18,
        rotSpeedY: 0.36,
      });
    };

    const addDarkCartridge = (x: number, y: number, z: number, scale: number, phase: number) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(cartBodyGeo, gunmetalMat);
      const grip = new THREE.Mesh(cartGripGeo, holoSilverMat);
      grip.position.set(0, 0.27, 0);
      const label = new THREE.Mesh(cartPlateGeo, emeraldGlowMat);
      label.position.set(0, -0.05, 0.065);
      g.add(body, grip, label);
      g.position.set(x, y, z);
      g.scale.setScalar(scale);
      scene.add(g);
      props.push({
        group: g,
        baseX: x,
        baseY: y,
        baseZ: z,
        speed: 0.62,
        phase,
        rotSpeedX: 0.14,
        rotSpeedY: -0.32,
      });
    };

    const addPrismStar = (x: number, y: number, z: number, scale: number, phase: number) => {
      const g = new THREE.Group();
      const outer = new THREE.Mesh(starGeo, holoSilverMat);
      const inner = new THREE.Mesh(starGeo, emeraldGlowMat);
      inner.scale.setScalar(0.42);
      inner.position.z = 0.06;
      g.add(outer, inner);
      g.position.set(x, y, z);
      g.scale.setScalar(scale);
      scene.add(g);
      props.push({
        group: g,
        baseX: x,
        baseY: y,
        baseZ: z,
        speed: 0.7,
        phase,
        rotSpeedX: -0.18,
        rotSpeedY: 0.4,
      });
    };

    // Flanking props leaving center stage completely open for Arcade & Game Boy
    addOrbitalRing(-5.4, 2.3, -1.2, 0.92, 0.4);
    addOrbitalRing(5.5, -1.9, -1.3, 0.88, 2.5);
    addDarkCartridge(-4.9, -1.65, -2.1, 0.85, 1.6);
    addDarkCartridge(4.9, 2.1, -2.0, 0.8, 3.8);
    addPrismStar(-4.0, 0.25, -2.6, 0.72, 4.9);
    addPrismStar(4.15, 0.15, -2.5, 0.76, 5.7);

    // Floating emerald & silver dust particles
    const PARTICLE_COUNT = 84;
    const particleGeo = new THREE.BoxGeometry(0.055, 0.055, 0.055);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.65,
    });
    const instancedParticles = new THREE.InstancedMesh(particleGeo, particleMat, PARTICLE_COUNT);
    const pData: { x: number; y: number; z: number; s: number; speed: number; phase: number }[] =
      [];
    const _dummy = new THREE.Object3D();
    const _color = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 18;
      const y = (Math.random() - 0.5) * 11;
      const z = -2 - Math.random() * 7;
      const s = 0.45 + Math.random() * 1.0;
      pData.push({
        x,
        y,
        z,
        s,
        speed: 0.32 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
      });
      _dummy.position.set(x, y, z);
      _dummy.scale.setScalar(s);
      _dummy.updateMatrix();
      instancedParticles.setMatrixAt(i, _dummy.matrix);
      _color.setHex(i % 3 === 0 ? 0x34d399 : i % 3 === 1 ? 0xcbd5e1 : 0x10b981);
      instancedParticles.setColorAt(i, _color);
    }
    instancedParticles.instanceMatrix.needsUpdate = true;
    if (instancedParticles.instanceColor) instancedParticles.instanceColor.needsUpdate = true;
    instancedParticles.computeBoundingSphere();
    scene.add(instancedParticles);

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const updateScene = (elapsed: number, delta: number) => {
      for (let i = 0; i < props.length; i++) {
        const c = props[i];
        c.group.position.y = c.baseY + Math.sin(elapsed * c.speed + c.phase) * 0.3;
        c.group.rotation.x += c.rotSpeedX * delta;
        c.group.rotation.y += c.rotSpeedY * delta;
      }
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = pData[i];
        const yOffset = Math.sin(elapsed * p.speed + p.phase) * 0.24;
        const pulse = p.s * (0.7 + 0.3 * Math.sin(elapsed * 1.4 + p.phase));
        _dummy.position.set(p.x, p.y + yOffset, p.z);
        _dummy.rotation.y = elapsed * 0.4 + p.phase;
        _dummy.scale.setScalar(pulse);
        _dummy.updateMatrix();
        instancedParticles.setMatrixAt(i, _dummy.matrix);
      }
      instancedParticles.instanceMatrix.needsUpdate = true;
    };

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      if (!prefersReduced) {
        updateScene(elapsed, delta);
      }
      renderer.render(scene, camera);
      if (prefersReduced) return;
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    const handleResize = () => {
      if (disposed || !mountEl) return;
      const w = mountEl.clientWidth || window.innerWidth;
      const h = mountEl.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
    };
    const onContextRestored = () => {
      if (!disposed) tick();
    };

    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    try {
      if (!isSoftwareGl) renderer.compile(scene, camera);
    } catch {
      // Safe fallback
    }
    tick();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      starGeo.dispose();
      ringGeo.dispose();
      octGeo.dispose();
      cartBodyGeo.dispose();
      cartGripGeo.dispose();
      cartPlateGeo.dispose();
      particleGeo.dispose();

      gunmetalMat.dispose();
      holoSilverMat.dispose();
      emeraldGlowMat.dispose();
      particleMat.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mountEl) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};
