import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Sparkles, ArrowUpRight, HardDriveDownload } from 'lucide-react';

interface SDCardProps {
  inserted: boolean;
  inserting: boolean;
  onTriggerInsert: () => void;
  onTriggerEject: () => void;
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

/* Classic Game Boy Cartridge Silhouette (top-right step notch, crisp chamfered corners) */
function createCartridgeShellGeometry(): THREE.ExtrudeGeometry {
  const w = 2.02;
  const h = 2.34;
  const r = 0.05;
  const notchW = 0.28;
  const notchH = 0.14;

  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  // Right edge up to notch
  s.lineTo(w / 2, h / 2 - notchH);
  s.lineTo(w / 2 - notchW, h / 2 - notchH);
  s.lineTo(w / 2 - notchW, h / 2);
  // Top edge leftwards
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: 0.028,
    bevelSize: 0.022,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}

/* Pill Geometry for the recessed GAME BOY header plate */
function createRoundedRectGeometry(w: number, h: number, r: number, depth: number): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

  const geo = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}

/* Downward Triangle Detail near Bottom Center */
function createTriangleGeometry(): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(-0.11, 0.06);
  s.lineTo(0.11, 0.06);
  s.lineTo(0, -0.07);
  s.closePath();

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.02,
    bevelEnabled: false,
  });
  geo.center();
  return geo;
}

/* Embossed "GAME BOY" Header Plate Texture (Dark Charcoal / Gunmetal Silver) */
function createHeaderPlateTexture(maxAniso: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#090B0E';
    ctx.fillRect(0, 0, 512, 160);

    // Subtle inset metallic border pill
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.roundRect(14, 14, 484, 132, 66);
    ctx.stroke();

    // Embossed GAME BOY lettering
    ctx.font = 'italic 900 58px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#020304';
    ctx.fillText('GAME BOY', 258, 84);
    ctx.fillStyle = '#64748B';
    ctx.fillText('GAME BOY', 256, 80);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  tex.needsUpdate = true;
  return tex;
}

/* Reference-Inspired Cartridge Artwork Sticker (Black & Holographic Emerald Edition for Lie) */
function createCartridgeStickerTexture(maxAniso: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // White-silver outer sticker trim
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(0, 0, 512, 480);

    // Metallic silver left & right side rails (matching reference layout)
    const railGrad = ctx.createLinearGradient(0, 0, 0, 480);
    railGrad.addColorStop(0, '#CBD5E1');
    railGrad.addColorStop(0.5, '#94A3B8');
    railGrad.addColorStop(1, '#CBD5E1');
    ctx.fillStyle = railGrad;
    ctx.fillRect(10, 10, 46, 460);
    ctx.fillRect(456, 10, 46, 460);

    // Inner dark obsidian artwork area
    ctx.save();
    ctx.beginPath();
    ctx.rect(56, 10, 400, 460);
    ctx.clip();

    ctx.fillStyle = '#070A0D';
    ctx.fillRect(56, 10, 400, 460);

    // Concentric retro spiral / radial rings (like reference card)
    const cx = 256;
    const cy = 262;
    for (let r = 280; r >= 24; r -= 24) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = r % 48 === 0 ? '#0E1C16' : '#090D10';
      ctx.fill();
    }

    // Diagonal holographic foil prism sheen
    ctx.save();
    ctx.translate(256, 240);
    ctx.rotate(-0.46);
    const holo = ctx.createLinearGradient(-260, 0, 260, 0);
    holo.addColorStop(0, 'rgba(52,211,153,0)');
    holo.addColorStop(0.28, 'rgba(52,211,153,0.18)');
    holo.addColorStop(0.48, 'rgba(248,250,252,0.28)');
    holo.addColorStop(0.68, 'rgba(163,230,53,0.16)');
    holo.addColorStop(1, 'rgba(52,211,153,0)');
    ctx.fillStyle = holo;
    ctx.fillRect(-350, -350, 700, 700);
    ctx.restore();

    // Retro pixel puff clouds & sparkles (matching reference playful energy)
    const drawCloud = (x: number, y: number, s: number) => {
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.arc(x, y, 13 * s, 0, Math.PI * 2);
      ctx.arc(x - 10 * s, y + 4 * s, 9 * s, 0, Math.PI * 2);
      ctx.arc(x + 10 * s, y + 4 * s, 9 * s, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCloud(114, 246, 0.95);
    drawCloud(176, 360, 0.85);

    // Sparkle asterisks
    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 26px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✦', 120, 178);
    ctx.fillText('✦', 392, 200);
    ctx.fillStyle = '#A3E635';
    ctx.fillText('★', 380, 326);

    // Center Geometric Retro Console Crest / Holographic Emblem
    ctx.save();
    ctx.translate(256, 274);
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 7;
    ctx.fillStyle = '#0D1F18';
    ctx.beginPath();
    ctx.moveTo(0, -76);
    ctx.lineTo(74, 0);
    ctx.lineTo(0, 76);
    ctx.lineTo(-74, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -52);
    ctx.lineTo(50, 0);
    ctx.lineTo(0, 52);
    ctx.lineTo(-50, 0);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = '#A3E635';
    ctx.font = 'bold 38px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LIE', 0, 2);
    ctx.restore();

    // Bold Arcade Title at Top ("LIE'S" / "MEMORY")
    ctx.save();
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.font = '900 54px sans-serif';
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#050608';
    ctx.strokeText("LIE'S", 252, 92);
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#10B981';
    ctx.strokeText("LIE'S", 252, 92);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText("LIE'S", 252, 92);

    ctx.font = '900 32px monospace';
    ctx.lineWidth = 9;
    ctx.strokeStyle = '#050608';
    ctx.strokeText('MEMORY CARD', 256, 138);
    ctx.fillStyle = '#34D399';
    ctx.fillText('MEMORY CARD', 256, 138);

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('TM', 356, 70);
    ctx.restore();

    // Bottom-Left Classic Rating Badge ("EVERYONE E")
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(72, 376, 62, 78);
    ctx.strokeStyle = '#050608';
    ctx.lineWidth = 3;
    ctx.strokeRect(72, 376, 62, 78);
    ctx.fillStyle = '#050608';
    ctx.fillRect(75, 379, 56, 14);
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EVERYONE', 103, 390);
    ctx.save();
    ctx.translate(103, 422);
    ctx.rotate(-0.14);
    ctx.fillStyle = '#050608';
    ctx.font = '900 40px sans-serif';
    ctx.fillText('E', 0, 12);
    ctx.restore();
    ctx.fillStyle = '#050608';
    ctx.fillRect(75, 439, 56, 12);
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('EDITION', 103, 448);

    // Bottom-Right Edition Pill Badge
    ctx.fillStyle = '#091410';
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(354, 426, 86, 26, 13);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FOR LIE', 397, 443);

    ctx.restore();

    // Vertical text along the silver side rails (exact homage to reference)
    ctx.save();
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.translate(33, 240);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('HOLODISK // 64MB', 0, 5);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.translate(479, 240);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('THIS SIDE OUT', 0, 5);
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  tex.needsUpdate = true;
  return tex;
}

export const SDCard: React.FC<SDCardProps> = ({
  inserted,
  inserting,
  onTriggerInsert,
  onTriggerEject,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const pointerTiltRef = useRef({ x: 0, y: 0 });
  const insertingRef = useRef(inserting);

  useEffect(() => {
    insertingRef.current = inserting;
  }, [inserting]);

  useEffect(() => {
    if (inserted) return;
    const mountEl = mountRef.current;
    if (!mountEl) return;

    const isSoftwareGl = detectSoftwareGl();
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    const w = mountEl.clientWidth || 192;
    const h = mountEl.clientHeight || 214;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 30);
    camera.position.set(0, 0.02, 5.45);

    const hemi = new THREE.HemisphereLight(0xe2e8f0, 0x050608, 1.1);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xf8fafc, 2.0);
    key.position.set(3.4, 4.8, 6.2);
    scene.add(key);

    const silverFill = new THREE.DirectionalLight(0xcbd5e1, 1.15);
    silverFill.position.set(-3.2, 3.2, 4.0);
    scene.add(silverFill);

    const emeraldRim = new THREE.DirectionalLight(0x34d399, 2.2);
    emeraldRim.position.set(-4.0, -2.2, 3.8);
    scene.add(emeraldRim);

    const cartGroup = new THREE.Group();
    scene.add(cartGroup);

    // 1. Main Pitch-Black Game Boy Cartridge Shell
    const shellGeo = createCartridgeShellGeometry();
    const blackShellMat = new THREE.MeshPhysicalMaterial({
      color: 0x111419,
      roughness: 0.36,
      metalness: 0.16,
      clearcoat: 0.45,
      clearcoatRoughness: 0.18,
      iridescence: 0.35,
      iridescenceIOR: 1.4,
      iridescenceThicknessRange: [140, 420],
    });
    const shellMesh = new THREE.Mesh(shellGeo, blackShellMat);
    cartGroup.add(shellMesh);

    // 2. Left & Right Shoulder Horizontal Grip Ribs (5 per side, matching reference)
    const ribGeo = new THREE.BoxGeometry(0.28, 0.036, 0.055);
    const ribMat = new THREE.MeshStandardMaterial({
      color: 0x1b212a,
      roughness: 0.24,
      metalness: 0.28,
    });
    const ribInstanced = new THREE.InstancedMesh(ribGeo, ribMat, 10);
    const dummy = new THREE.Object3D();
    let ribIdx = 0;
    for (let side = -1; side <= 1; side += 2) {
      for (let row = 0; row < 5; row++) {
        dummy.position.set(side * 0.87, 0.56 + row * 0.088, 0.128);
        dummy.updateMatrix();
        ribInstanced.setMatrixAt(ribIdx++, dummy.matrix);
      }
    }
    ribInstanced.instanceMatrix.needsUpdate = true;
    cartGroup.add(ribInstanced);

    // 3. Recessed Oval/Pill Header Frame + Embossed "GAME BOY" Plate
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const headerRimGeo = createRoundedRectGeometry(1.42, 0.44, 0.21, 0.036);
    const headerRimMat = new THREE.MeshStandardMaterial({
      color: 0x191e26,
      roughness: 0.28,
      metalness: 0.25,
    });
    const headerRimMesh = new THREE.Mesh(headerRimGeo, headerRimMat);
    headerRimMesh.position.set(-0.02, 0.74, 0.122);
    cartGroup.add(headerRimMesh);

    const headerTex = createHeaderPlateTexture(maxAniso);
    const headerPlateGeo = new THREE.PlaneGeometry(1.32, 0.36);
    const headerPlateMat = new THREE.MeshStandardMaterial({
      map: headerTex,
      roughness: 0.35,
      metalness: 0.22,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const headerPlateMesh = new THREE.Mesh(headerPlateGeo, headerPlateMat);
    headerPlateMesh.position.set(-0.02, 0.74, 0.154);
    cartGroup.add(headerPlateMesh);

    // 4. Recessed Label Well Bezel
    const wellRimGeo = createRoundedRectGeometry(1.62, 1.48, 0.08, 0.024);
    const wellRimMesh = new THREE.Mesh(wellRimGeo, headerRimMat);
    wellRimMesh.position.set(0, -0.22, 0.122);
    cartGroup.add(wellRimMesh);

    // 5. Holographic Cartridge Artwork Sticker
    const stickerTex = createCartridgeStickerTexture(maxAniso);
    const stickerGeo = new THREE.PlaneGeometry(1.5, 1.38);
    const stickerMat = new THREE.MeshPhysicalMaterial({
      map: stickerTex,
      roughness: 0.14,
      metalness: 0.18,
      iridescence: 1.0,
      iridescenceIOR: 1.46,
      iridescenceThicknessRange: [180, 580],
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const stickerMesh = new THREE.Mesh(stickerGeo, stickerMat);
    stickerMesh.position.set(0, -0.22, 0.147);
    cartGroup.add(stickerMesh);

    // 6. Bottom Center Downward Triangle
    const triGeo = createTriangleGeometry();
    const triMat = new THREE.MeshStandardMaterial({
      color: 0x262f3c,
      roughness: 0.3,
      metalness: 0.35,
    });
    const triMesh = new THREE.Mesh(triGeo, triMat);
    triMesh.position.set(0, -1.04, 0.132);
    cartGroup.add(triMesh);

    // 7. Subtle Metallic Gold/Silver Connector Contacts Peeking on Bottom Edge
    const pinGeo = new THREE.BoxGeometry(0.08, 0.08, 0.03);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.92,
    });
    const pinInstanced = new THREE.InstancedMesh(pinGeo, pinMat, 8);
    for (let i = 0; i < 8; i++) {
      dummy.position.set(-0.56 + i * 0.16, -1.16, -0.02);
      dummy.updateMatrix();
      pinInstanced.setMatrixAt(i, dummy.matrix);
    }
    pinInstanced.instanceMatrix.needsUpdate = true;
    cartGroup.add(pinInstanced);

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

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      if (!prefersReduced) {
        const targetRotY = insertingRef.current
          ? -0.22
          : Math.sin(elapsed * 1.35) * 0.26 + pointerTiltRef.current.x * 0.42;
        const targetRotX = insertingRef.current
          ? -0.18
          : Math.cos(elapsed * 1.0) * 0.08 + pointerTiltRef.current.y * 0.32;

        cartGroup.rotation.y = THREE.MathUtils.damp(cartGroup.rotation.y, targetRotY, 7, delta);
        cartGroup.rotation.x = THREE.MathUtils.damp(cartGroup.rotation.x, targetRotX, 7, delta);
        cartGroup.position.y = Math.sin(elapsed * 2.0) * 0.06;
      }

      renderer.render(scene, camera);
      if (prefersReduced) return;
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    };

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
      shellGeo.dispose();
      ribGeo.dispose();
      headerRimGeo.dispose();
      headerPlateGeo.dispose();
      wellRimGeo.dispose();
      stickerGeo.dispose();
      triGeo.dispose();
      pinGeo.dispose();
      headerTex.dispose();
      stickerTex.dispose();
      blackShellMat.dispose();
      ribMat.dispose();
      headerRimMat.dispose();
      headerPlateMat.dispose();
      stickerMat.dispose();
      triMat.dispose();
      pinMat.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mountEl) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, [inserted]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    pointerTiltRef.current = { x: nx, y: ny };
  };

  if (inserted) {
    return (
      <div className="w-full max-w-[260px] rounded-2xl border border-[#34D399]/35 bg-[#0C0F12]/90 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.75)]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-silk text-[10px] tracking-[0.18em] text-[#34D399]">
            MEMORY SLOT // LOCKED IN
          </span>
          <span className="w-2 h-2 rounded-full bg-[#34D399] shadow-[0_0_8px_#34D399]" />
        </div>
        <p className="font-pixel text-[10px] leading-relaxed text-[#E2E8F0] mb-3">
          LIE&apos;S MEMORY CARD
        </p>
        <p className="font-vt text-[17px] leading-tight text-[#94A3B8] mb-3.5">
          Black cartridge mounted inside console slot. Letter, music &amp; mini-games unlocked.
        </p>
        <button
          type="button"
          onClick={onTriggerEject}
          className="w-full py-2 px-3 rounded-lg border border-[#CBD5E1]/25 bg-[#161B22] hover:border-[#34D399]/60 hover:text-[#34D399] font-pixel text-[9px] tracking-[0.12em] text-[#CBD5E1] transition-colors cursor-pointer"
        >
          [ EJECT MEMORY CARD ]
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[270px] flex flex-col items-center rounded-2xl border border-[#CBD5E1]/20 bg-[#0C0F12]/85 p-4 shadow-[0_24px_48px_rgba(0,0,0,0.85)] relative overflow-hidden">
      {/* Subtle Holographic Iridescent Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full holo-silver-foil opacity-30 blur-2xl"
      />

      <div className="w-full flex items-center justify-between mb-1">
        <span className="font-silk text-[9px] tracking-[0.2em] text-[#34D399] flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> BLACK CARTRIDGE
        </span>
        <span className="font-silk text-[9px] text-[#94A3B8]">DRAG OR CLICK</span>
      </div>

      {/* Draggable + Clickable 3D Black Game Boy Cartridge */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Drag or click to insert Lie's Black Memory Cartridge"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', 'lie-memory-card');
          e.dataTransfer.effectAllowed = 'move';
        }}
        onClick={onTriggerInsert}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onTriggerInsert();
          }
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          pointerTiltRef.current = { x: 0, y: 0 };
        }}
        className={`relative cursor-grab active:cursor-grabbing select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#34D399] rounded-xl transition-transform duration-300 ${
          inserting ? 'animate-sd-slide pointer-events-none' : 'hover:scale-105'
        }`}
      >
        <div
          ref={mountRef}
          className="w-[180px] h-[202px] sm:w-[194px] sm:h-[216px] drop-shadow-[0_14px_26px_rgba(16,185,129,0.22)]"
        />
      </div>

      <div className="text-center space-y-2 mt-1 w-full">
        <p className="font-pixel text-[9px] leading-relaxed text-[#E2E8F0]">
          YOUR LITTLE WORLD IS WAITING.
        </p>
        <p className="font-vt text-[17px] leading-tight text-[#94A3B8]">
          Drag black cartridge into the console slot or tap below to unlock.
        </p>
        <button
          type="button"
          onClick={onTriggerInsert}
          disabled={inserting}
          className="w-full mt-1 py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#10B981] to-[#34D399] hover:from-[#34D399] hover:to-[#4ADE80] text-[#050608] font-pixel text-[9px] tracking-[0.1em] shadow-[0_0_20px_rgba(16,185,129,0.38)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
        >
          <HardDriveDownload className="w-3.5 h-3.5" />
          <span>{inserting ? 'INSERTING...' : 'INSERT MEMORY CARD'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
