import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Eye,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Maximize2,
  Minimize2,
  Layers,
  Info,
  X,
  Rocket,
} from 'lucide-react';
import {
  createCelestialWell,
  createStoryWorld,
  createCryptoWorld,
  createGardenWorld,
  createGuestbookWorld,
  createStarlightField,
  createSpaceShuttle,
  CelestialSubject,
} from './three/CelestialModels';

// Scratch objects allocated at module scope to avoid Garbage Collection in 60fps loop
const _vec3 = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _idealPos = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _pointer = new THREE.Vector2();
const _shuttlePos = new THREE.Vector3();
const _shuttleNext = new THREE.Vector3();
const _shuttleTangent = new THREE.Vector3();
const _shuttleTangentNext = new THREE.Vector3();
const _shuttleCross = new THREE.Vector3();

export interface CelestialWell3DProps {
  onWorldSelect?: (worldId: string) => void;
  className?: string;
}

export default function CelestialWell3D({ onWorldSelect, className = '' }: CelestialWell3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Control State
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [hoveredPos, setHoveredPos] = useState<{ x: number; y: number } | null>(null);
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [activePreset, setActivePreset] = useState<'overview' | 'well' | 'shuttle' | 'portfolio' | 'crypto' | 'garden' | 'guestbook'>('overview');

  // Mutable refs to decouple React UI re-renders from the WebGL render loop
  const stateRef = useRef({
    timeMultiplier: 1,
    selectedWorldId: null as string | null,
    targetCamPos: new THREE.Vector3(0, 22, 38),
    targetLookAt: new THREE.Vector3(0, 0, 0),
    isCamTransitioning: false,
    controls: null as OrbitControls | null,
    orbitLinesGroup: null as THREE.Group | null,
  });

  const subjectsRef = useRef<{
    well: { group: THREE.Group; update: (delta: number) => void };
    worlds: CelestialSubject[];
    starlight: { mesh: THREE.InstancedMesh; update: (delta: number) => void };
    shuttle: { group: THREE.Group; plumes: THREE.Mesh[]; thrusterLight: THREE.PointLight; update: (delta: number) => void };
  } | null>(null);

  // Sync React state to animation loop refs
  useEffect(() => {
    stateRef.current.timeMultiplier = timeMultiplier;
  }, [timeMultiplier]);

  useEffect(() => {
    stateRef.current.selectedWorldId = selectedWorldId;
  }, [selectedWorldId]);

  useEffect(() => {
    if (stateRef.current.orbitLinesGroup) {
      stateRef.current.orbitLinesGroup.visible = showOrbits;
    }
  }, [showOrbits]);

  // Handle Preset Views
  const selectPreset = useCallback((preset: 'overview' | 'well' | 'shuttle' | 'portfolio' | 'crypto' | 'garden' | 'guestbook') => {
    setActivePreset(preset);
    const state = stateRef.current;
    state.isCamTransitioning = true;

    if (preset === 'overview') {
      setSelectedWorldId(null);
      state.targetCamPos.set(0, 26, 42);
      state.targetLookAt.set(0, 0, 0);
    } else if (preset === 'well') {
      setSelectedWorldId('well');
      state.targetCamPos.set(0, 6, 12);
      state.targetLookAt.set(0, 1.2, 0);
    } else if (preset === 'shuttle') {
      setSelectedWorldId('shuttle');
      if (subjectsRef.current?.shuttle) {
        subjectsRef.current.shuttle.group.getWorldPosition(_vec3);
        state.targetLookAt.copy(_vec3);
        state.targetCamPos.set(_vec3.x + 3.2, _vec3.y + 2.0, _vec3.z + 4.5);
      }
    } else {
      setSelectedWorldId(preset);
      const world = subjectsRef.current?.worlds.find((w) => w.id === preset);
      if (world) {
        world.group.getWorldPosition(_vec3);
        state.targetLookAt.copy(_vec3);
        state.targetCamPos.set(_vec3.x + 3.5, _vec3.y + 2.5, _vec3.z + 5);
      }
    }
  }, []);

  const handleWorldClick = useCallback(
    (worldId: string) => {
      setSelectedWorldId(worldId);
      selectPreset(worldId as any);
      if (onWorldSelect) onWorldSelect(worldId);
    },
    [onWorldSelect, selectPreset]
  );

  const selectedWorldData = useMemo(() => {
    if (!selectedWorldId) return null;
    if (selectedWorldId === 'well') {
      return {
        id: 'well',
        name: '태초의 우물',
        subtitle: '심연의 원천 (The Wellspring)',
        category: 'THE WELL',
        route: '/',
        color: '#38bdf8',
        description: '모든 사유와 세계들이 탄생하고 순환하는 우주의 중심 우물입니다.',
        stats: [
          { label: '에너지 준위', value: '초임계 상태' },
          { label: '공전 중인 세계', value: '4개 위성계' },
          { label: '차원 깊이', value: '심연 (Abyss)' },
        ],
      };
    }
    if (selectedWorldId === 'shuttle') {
      return {
        id: 'shuttle',
        name: '오비터 챌린저호',
        subtitle: '행성간 순항 우주선 (Space Shuttle)',
        category: 'SPACECRAFT',
        route: '/',
        color: '#38bdf8',
        description: '심연의 우물과 4대 행성계를 영원히 순항하며 탐사 항로를 개척하는 유인 우주왕복선입니다.',
        stats: [
          { label: '추진 시스템', value: '3연장 SSME' },
          { label: '비행 상태', value: '자율 궤도 순항' },
          { label: '미션 코드', value: 'STS-CHALLENGER' },
        ],
      };
    }
    return subjectsRef.current?.worlds.find((w) => w.id === selectedWorldId) || null;
  }, [selectedWorldId]);

  // Main WebGL Initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Software-WebGL Guard (Three.js skill directive)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. High-performance PBR Renderer configuration
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setClearColor(0x020308, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 3. Scene & Horizon Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020308, 0.015);

    // 4. Camera & Damped OrbitControls
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(0, 24, 40);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 0.8;
    controls.panSpeed = 0.6;
    controls.minDistance = 3.5;
    controls.maxDistance = 80;
    controls.maxPolarAngle = Math.PI / 2 + 0.08; // Allow slight low-angle hero view
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    stateRef.current.controls = controls;

    // Stop auto camera scripting when user manually grabs the orbit controls
    controls.addEventListener('start', () => {
      stateRef.current.isCamTransitioning = false;
    });

    // 5. Studio Environment Reflection via RoomEnvironment & PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 6. Studio Balanced Lighting (Warm Key + Cool Fill + Core Point Light)
    // Warm Key Light with tight shadow bounds
    const keyLight = new THREE.DirectionalLight(0xfff6ea, 2.2);
    keyLight.position.set(15, 30, 20);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 5;
      keyLight.shadow.camera.far = 70;
      keyLight.shadow.camera.left = -20;
      keyLight.shadow.camera.right = 20;
      keyLight.shadow.camera.top = 20;
      keyLight.shadow.camera.bottom = -20;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x020617, 1.2);
    scene.add(hemiLight);

    // Central Wellspring Core Light
    const wellLight = new THREE.PointLight(0x38bdf8, 3.5, 30, 1.5);
    wellLight.position.set(0, 1.8, 0);
    scene.add(wellLight);

    // 7. Instantiate Procedural Composite Models
    const well = createCelestialWell();
    scene.add(well.group);

    const storyWorld = createStoryWorld();
    const cryptoWorld = createCryptoWorld();
    const gardenWorld = createGardenWorld();
    const guestbookWorld = createGuestbookWorld();

    const worlds = [storyWorld, cryptoWorld, gardenWorld, guestbookWorld];
    worlds.forEach((w) => scene.add(w.group));

    // Challenger Space Shuttle & 3D Celestial Flight Spline Path
    const shuttle = createSpaceShuttle();
    scene.add(shuttle.group);

    const flightPoints = [
      new THREE.Vector3(0, 4.2, 7.0),       // Well exit, climbing into space
      new THREE.Vector3(8.0, 3.5, 4.5),      // Banking near Story World
      new THREE.Vector3(13.5, 2.2, -3.0),    // Weaving between Story & Crypto
      new THREE.Vector3(16.5, 4.2, -11.0),   // High sweep past Crypto World
      new THREE.Vector3(9.0, 1.8, -17.5),    // Crossing interplanetary gulf
      new THREE.Vector3(-5.5, 3.2, -19.5),   // Approaching Botanical Garden
      new THREE.Vector3(-19.5, 2.0, -8.0),   // Banking around Botanical Garden
      new THREE.Vector3(-24.5, 4.2, 6.5),    // Cruising towards Guestbook World
      new THREE.Vector3(-14.0, 2.5, 18.5),   // Slingshot past Guestbook
      new THREE.Vector3(-5.0, 5.0, 14.0),    // High-altitude dive towards Well
    ];
    const flightCurve = new THREE.CatmullRomCurve3(flightPoints, true, 'centripetal', 0.5);
    let shuttleProgress = 0.05;

    // Instanced Cosmic Starlight Field
    const starlight = createStarlightField(500);
    scene.add(starlight.mesh);

    // Procedural Orbital Guideline Rings
    const orbitLinesGroup = new THREE.Group();
    worlds.forEach((w) => {
      const orbitGeo = new THREE.RingGeometry(w.distance - 0.04, w.distance + 0.04, 96);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(w.color),
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
      });
      const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
      orbitRing.rotation.x = Math.PI / 2;
      orbitRing.position.y = -0.8;
      orbitLinesGroup.add(orbitRing);
    });
    scene.add(orbitLinesGroup);
    stateRef.current.orbitLinesGroup = orbitLinesGroup;

    subjectsRef.current = { well, worlds, starlight, shuttle };

    // 8. Interactive Raycasting for Hover & Click
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_pointer, camera);

      // Check hits on planets, shuttle, or the well
      const clickableObjects = [well.group, shuttle.group, ...worlds.map((w) => w.group)];
      const intersects = _raycaster.intersectObjects(clickableObjects, true);

      if (intersects.length > 0) {
        let rootGroup: THREE.Object3D | null = intersects[0].object;
        while (rootGroup && rootGroup.parent && rootGroup.parent !== scene) {
          rootGroup = rootGroup.parent;
        }

        if (rootGroup === shuttle.group) {
          setHoveredName('오비터 챌린저호');
          setHoveredPos({ x: e.clientX, y: e.clientY });
          container.style.cursor = 'pointer';
          return;
        }

        const foundWorld = worlds.find((w) => w.group === rootGroup);
        if (foundWorld) {
          setHoveredName(foundWorld.name);
          setHoveredPos({ x: e.clientX, y: e.clientY });
          container.style.cursor = 'pointer';
          return;
        }
        if (rootGroup === well.group) {
          setHoveredName('태초의 우물');
          setHoveredPos({ x: e.clientX, y: e.clientY });
          container.style.cursor = 'pointer';
          return;
        }
      }

      setHoveredName(null);
      setHoveredPos(null);
      container.style.cursor = 'grab';
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_pointer, camera);
      const clickableObjects = [well.group, shuttle.group, ...worlds.map((w) => w.group)];
      const intersects = _raycaster.intersectObjects(clickableObjects, true);

      if (intersects.length > 0) {
        let rootGroup: THREE.Object3D | null = intersects[0].object;
        while (rootGroup && rootGroup.parent && rootGroup.parent !== scene) {
          rootGroup = rootGroup.parent;
        }

        if (rootGroup === shuttle.group) {
          handleWorldClick('shuttle');
          return;
        }

        const foundWorld = worlds.find((w) => w.group === rootGroup);
        if (foundWorld) {
          handleWorldClick(foundWorld.id);
          return;
        }
        if (rootGroup === well.group) {
          handleWorldClick('well');
          return;
        }
      }
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('click', handleClick);

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Lossless 60fps Animation Loop with Exponential Damping
    let frameId = 0;
    const clock = new THREE.Clock();
    let currentBankRoll = 0;

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const state = stateRef.current;

      // Update Procedural Models
      well.update(delta);
      worlds.forEach((w) => w.update(delta, state.timeMultiplier));
      starlight.update(delta);

      // Update Challenger Space Shuttle Flight Kinematics
      shuttleProgress = (shuttleProgress + delta * 0.022 * state.timeMultiplier) % 1.0;
      flightCurve.getPointAt(shuttleProgress, _shuttlePos);
      flightCurve.getPointAt((shuttleProgress + 0.005) % 1.0, _shuttleNext);
      flightCurve.getTangentAt(shuttleProgress, _shuttleTangent);
      flightCurve.getTangentAt((shuttleProgress + 0.008) % 1.0, _shuttleTangentNext);

      // Position shuttle and align nose forward along trajectory vector
      shuttle.group.position.copy(_shuttlePos);
      shuttle.group.lookAt(_shuttleNext);

      // Coordinated flight banking: calculate trajectory angular curvature around Y
      _shuttleCross.crossVectors(_shuttleTangent, _shuttleTangentNext);
      const targetBank = THREE.MathUtils.clamp(_shuttleCross.y * 14.0, -0.52, 0.52);
      currentBankRoll = THREE.MathUtils.lerp(currentBankRoll, targetBank, 1 - Math.exp(-6.0 * delta));
      shuttle.group.rotateZ(currentBankRoll);

      shuttle.update(delta);

      // Camera kinematic transition with exponential damping
      if (state.isCamTransitioning) {
        const factor = 1 - Math.exp(-6.0 * delta);
        camera.position.lerp(state.targetCamPos, factor);
        controls.target.lerp(state.targetLookAt, factor);

        if (
          camera.position.distanceTo(state.targetCamPos) < 0.15 &&
          controls.target.distanceTo(state.targetLookAt) < 0.1
        ) {
          state.isCamTransitioning = false;
        }
      } else if (state.selectedWorldId) {
        // Continuously track orbiting world or shuttle when selected
        if (state.selectedWorldId === 'shuttle') {
          controls.target.lerp(_shuttlePos, 0.08);
        } else if (state.selectedWorldId !== 'well') {
          const world = worlds.find((w) => w.id === state.selectedWorldId);
          if (world) {
            world.group.getWorldPosition(_vec3);
            controls.target.lerp(_vec3, 0.08);
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);

      frameId = requestAnimationFrame(tick);
    }

    tick();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [handleWorldClick]);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 outline-none" />

      {/* Cosmic Gradient Vignette Overlays (Non-interfering) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(2,3,8,0.7)_100%)] z-10" />
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-background/90 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

      {/* Floating Cursor Hover Label */}
      {hoveredName && hoveredPos && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-12 px-3 py-1.5 rounded-lg border border-cyan-500/40 text-cyan-200 text-xs font-mono font-semibold shadow-xl"
          style={{
            left: `${hoveredPos.x}px`,
            top: `${hoveredPos.y}px`,
            backgroundColor: 'rgba(8, 12, 24, 0.92)',
          }}
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            {hoveredName}
          </span>
        </div>
      )}

      {/* Top Left: Ultra-minimal status indicator */}
      <div className="absolute top-4 left-4 md:top-6 md:left-8 z-30 pointer-events-auto">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-white shadow-md text-xs font-mono"
          style={{ backgroundColor: 'rgba(9, 14, 28, 0.82)' }}
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-gray-300">오르러리 항해</span>
        </div>
      </div>

      {/* Top Right: Quick Reset Button */}
      <div className="absolute top-4 right-4 md:top-6 md:right-8 z-30 pointer-events-auto flex items-center gap-2">
        <button
          onClick={() => selectPreset('overview')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-xs font-medium text-gray-300 hover:text-white hover:border-cyan-500/50 transition-all shadow-lg active:scale-95"
          style={{ backgroundColor: 'rgba(9, 14, 28, 0.88)' }}
          title="전체 조망으로 시점 복귀"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">전체 조망</span>
        </button>
      </div>

      {/* Selected World Floating Telemetry Card (When an object is clicked) */}
      {selectedWorldData && (
        <div className="absolute top-20 right-4 md:top-20 md:right-8 z-30 w-72 sm:w-80 pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-300">
          <div
            className="rounded-2xl border p-4 shadow-2xl text-white relative overflow-hidden"
            style={{
              backgroundColor: 'rgba(7, 11, 22, 0.92)',
              borderColor: `${selectedWorldData.color}55`,
              boxShadow: `0 10px 40px -10px ${selectedWorldData.color}33`,
            }}
          >
            {/* Top Accent Strip */}
            <div
              className="absolute top-0 inset-x-0 h-1"
              style={{ backgroundColor: selectedWorldData.color }}
            />

            <div className="flex items-start justify-between mb-3">
              <div>
                <span
                  className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full inline-block mb-1"
                  style={{
                    backgroundColor: `${selectedWorldData.color}22`,
                    color: selectedWorldData.color,
                  }}
                >
                  {selectedWorldData.category}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-white">{selectedWorldData.name}</h3>
                <p className="text-xs text-gray-400">{selectedWorldData.subtitle}</p>
              </div>
              <button
                onClick={() => setSelectedWorldId(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="카드 닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">{selectedWorldData.description}</p>

            <div className="grid grid-cols-3 gap-2 mb-4 p-2.5 rounded-xl border border-white/5 bg-white/[0.03]">
              {selectedWorldData.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <span className="block text-[9px] text-gray-400 uppercase font-mono">{stat.label}</span>
                  <span className="text-[11px] font-semibold text-gray-200 truncate block">{stat.value}</span>
                </div>
              ))}
            </div>

            {selectedWorldData.id !== 'well' && (
              <button
                onClick={() => navigate(selectedWorldData.route)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-98"
                style={{
                  backgroundColor: selectedWorldData.color,
                  boxShadow: `0 4px 14px ${selectedWorldData.color}66`,
                }}
              >
                <span>{selectedWorldData.name} 세계로 들어가기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Viewport-First Ergonomic Control Dock (Bottom Center, <= 15% viewport footprint) */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 w-full px-4 flex flex-col items-center pointer-events-none"
        style={{
          maxWidth: 'min(920px, 94vw)',
        }}
      >
        {/* Dock Main Body (Solid rgba surface - NO CSS backdrop-filter over WebGL) */}
        <div
          className="pointer-events-auto w-full p-2.5 sm:p-3 rounded-2xl border border-white/15 shadow-2xl flex flex-wrap items-center justify-between gap-2.5 sm:gap-4"
          style={{ backgroundColor: 'rgba(9, 14, 28, 0.94)' }}
        >
          {/* World Presets Tabs */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5 max-w-full">
            <button
              onClick={() => selectPreset('overview')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activePreset === 'overview'
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              전체 조망
            </button>
            <button
              onClick={() => selectPreset('well')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activePreset === 'well'
                  ? 'bg-amber-400 text-black font-bold shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>중심 우물</span>
            </button>
            <button
              onClick={() => selectPreset('shuttle')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activePreset === 'shuttle'
                  ? 'bg-sky-400 text-black font-bold shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Rocket className="w-3 h-3 text-sky-400" />
              <span>챌린저호</span>
            </button>
            <button
              onClick={() => selectPreset('portfolio')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activePreset === 'portfolio'
                  ? 'bg-blue-500 text-white font-bold shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>나의 세계</span>
            </button>
            <button
              onClick={() => selectPreset('crypto')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activePreset === 'crypto'
                  ? 'bg-amber-500 text-white font-bold shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>크립토</span>
            </button>
            <button
              onClick={() => selectPreset('garden')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activePreset === 'garden'
                  ? 'bg-emerald-500 text-white font-bold shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>디지털 정원</span>
            </button>
            <button
              onClick={() => selectPreset('guestbook')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activePreset === 'guestbook'
                  ? 'bg-purple-500 text-white font-bold shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>방명록</span>
            </button>
          </div>

          {/* Quick Speed & Display Toggles */}
          <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Orbits Toggle */}
            <button
              onClick={() => setShowOrbits(!showOrbits)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-mono border transition-all ${
                showOrbits
                  ? 'border-cyan-500/50 text-cyan-300 bg-cyan-950/40'
                  : 'border-white/10 text-gray-400 hover:text-white'
              }`}
              title="공전 궤도선 표시/숨김"
            >
              <Layers className="w-3 h-3" />
              <span>궤도 {showOrbits ? 'ON' : 'OFF'}</span>
            </button>

            {/* Orbit Speed Multiplier */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              {[
                { label: '멈춤', val: 0, icon: Pause },
                { label: '1x', val: 1, icon: Play },
                { label: '3x', val: 3, icon: FastForward },
              ].map((speed) => {
                const Icon = speed.icon;
                const isCurrent = timeMultiplier === speed.val;
                return (
                  <button
                    key={speed.val}
                    onClick={() => setTimeMultiplier(speed.val)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono transition-all ${
                      isCurrent
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-2.5 h-2.5" />
                    <span>{speed.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
