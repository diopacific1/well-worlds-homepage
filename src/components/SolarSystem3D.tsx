import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Trail } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useRef, useMemo, useState, useEffect } from 'react';
import { PLANETS, PlanetData } from '../data/planets';
import { Play, Pause, FastForward, RotateCcw, Crosshair, Orbit, ChevronRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Camera tracking logic
function CameraController({ targetPlanet, controlsRef }: { targetPlanet: PlanetData | null, controlsRef: any }) {
  const { camera } = useThree();
  const vec = new THREE.Vector3();
  
  useFrame(() => {
    if (targetPlanet) {
      // Find the planet object in the scene
      const planetObj = camera.parent?.getObjectByName(`planet-${targetPlanet.id}`);
      if (planetObj) {
        planetObj.getWorldPosition(vec);
        // Smoothly interpolate camera target
        controlsRef.current?.target.lerp(vec, 0.05);
      }
    } else {
      // Default to Center
      controlsRef.current?.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
    }
  });
  return null;
}

function Planet({ 
  data, 
  settings, 
  onSelect 
}: { 
  data: PlanetData, 
  settings: any,
  onSelect: (id: string) => void
}) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  const showTooltip = hovered || isTouch;
  
  // Random starting angle
  const currentAngle = useRef(Math.random() * Math.PI * 2);
  
  // Axial tilt in radians
  const tiltRad = (data.axialTilt * Math.PI) / 180;

  useFrame((state, delta) => {
    // Revolution (Orbit)
    if (groupRef.current) {
      if (settings.revolutionEnabled) {
        // Increment angle based on delta, speed, and time multiplier
        currentAngle.current += delta * data.speed * 0.1 * settings.timeMultiplier;
      }
      // Always update position based on currentAngle
      groupRef.current.position.x = Math.cos(currentAngle.current) * data.distance;
      groupRef.current.position.z = Math.sin(currentAngle.current) * data.distance;
    }
    
    // Rotation
    if (planetRef.current && settings.rotationEnabled) {
      // Calculate rotation speed based on rotation period
      const baseRotation = (24 / (Math.abs(data.rotationPeriod) || 24)) * 0.5;
      const direction = data.rotationPeriod < 0 ? -1 : 1;
      // Use delta for smooth rotation
      planetRef.current.rotation.y += baseRotation * direction * settings.timeMultiplier * delta;
    }
  });

  return (
    <group ref={groupRef} name={`planet-${data.id}`}>
      {/* Apply axial tilt to this intermediate group */}
      <group rotation={[0, 0, tiltRad]}>
        <mesh 
          ref={planetRef} 
          onClick={(e) => { e.stopPropagation(); onSelect(data.id); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
          onPointerDown={(e) => { e.stopPropagation(); }}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[data.size, 64, 64]} />
          <meshStandardMaterial color={data.color} roughness={0.7} metalness={0.1} />

          {/* Tooltip */}
          <Html distanceFactor={15} zIndexRange={[100, 0]} className="pointer-events-none">
            <motion.div 
              initial={false}
              animate={{ 
                opacity: showTooltip ? 1 : 0, 
                scale: showTooltip ? 1 : 0.8,
                y: showTooltip ? 0 : 10
              }}
              transition={{ duration: 0.2 }}
              className="px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg shadow-lg whitespace-nowrap font-bold tracking-tight text-white/90"
            >
              {data.name}
            </motion.div>
          </Html>
        </mesh>
        
        {data.hasRing && (
          <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow castShadow>
            <ringGeometry args={[data.size * 1.4, data.size * 2.2, 128]} />
            <meshStandardMaterial color={data.color} transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    </group>
  );
}

function OrbitLines({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <group>
      {PLANETS.map((p) => (
        <mesh key={`orbit-${p.id}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[p.distance - 0.02, p.distance + 0.02, 128]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export default function SolarSystem3D({ onPlanetClick }: { onPlanetClick?: (id: string) => void }) {
  const [settings, setSettings] = useState({
    timeMultiplier: 1,
    orbitsVisible: true,
    rotationEnabled: true,
    revolutionEnabled: true,
  });
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const controlsRef = useRef<any>(null);
  
  const selectedPlanet = useMemo(() => PLANETS.find(p => p.id === selectedPlanetId) || null, [selectedPlanetId]);

  return (
    <div className="absolute inset-0 z-0 bg-[#020205] text-white font-mono overflow-hidden pointer-events-auto">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 20, 40], fov: 45 }} shadows className="outline-none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'auto', touchAction: 'auto' }}>
        <color attach="background" args={['#020205']} />
        
        {/* Lights */}
        <ambientLight intensity={0.05} />
        <pointLight position={[0, 0, 0]} intensity={1000} distance={200} decay={2} castShadow />
        
        {/* Environment */}
        <Stars radius={100} depth={50} count={8000} factor={6} saturation={0} fade speed={1} />
        
        {/* Controls */}
        <OrbitControls 
          ref={controlsRef}
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          minDistance={2} 
          maxDistance={100}
          autoRotate={!selectedPlanetId && settings.revolutionEnabled}
          autoRotateSpeed={0.2}
          makeDefault
        />
        <CameraController targetPlanet={selectedPlanet} controlsRef={controlsRef} />
        
        {/* Objects */}
        {/* Central Core (The Well) */}
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} toneMapped={false} transparent opacity={0.8} />
          <Html distanceFactor={15} zIndexRange={[100, 0]} className="pointer-events-none">
            <motion.div 
              initial={{ opacity: 0.5, y: -10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ repeat: Infinity, repeatType: 'mirror', duration: 2 }}
              className="px-2 py-1 text-center whitespace-nowrap font-bold tracking-widest text-cyan-200/80 text-[10px]"
            >
              THE WELL
            </motion.div>
          </Html>
        </mesh>

        <OrbitLines visible={settings.orbitsVisible} />
        {PLANETS.map((p) => (
          <Planet key={p.id} data={p} settings={settings} onSelect={(id) => {
            setSelectedPlanetId(id);
          }} />
        ))}

        {/* Post-processing */}
        <EffectComposer>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
          <Noise opacity={0.03} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>

      {/* NASA Style UI Overlay */}
      <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10 pointer-events-none">
        {/* Top Bar */}
        <div className="flex justify-between items-start w-full pointer-events-none">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 p-3 rounded-lg flex items-center gap-3">
            <Activity className="text-cyan-400 w-5 h-5 animate-pulse" />
            <div>
              <h1 className="text-xs md:text-sm font-bold tracking-widest text-white/90">SOLAR SYSTEM VIZ</h1>
              <p className="text-[9px] md:text-[10px] text-cyan-400/70 tracking-widest">LIVE TELEMETRY ACTIVE</p>
            </div>
          </div>
          
          {/* Controls Panel */}
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 w-48 md:w-64 pointer-events-auto flex flex-col gap-4 shadow-2xl">
            <div className="text-[10px] text-gray-400 tracking-wider mb-1 flex items-center gap-1 border-b border-white/10 pb-2">
              <Orbit className="w-3 h-3" /> SIMULATION CONTROLS
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[10px] tracking-widest text-gray-300 group-hover:text-white transition-colors">ORBITS</span>
                <input type="checkbox" className="accent-cyan-500" checked={settings.orbitsVisible} onChange={e => setSettings(s => ({ ...s, orbitsVisible: e.target.checked }))} />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[10px] tracking-widest text-gray-300 group-hover:text-white transition-colors">ROTATION</span>
                <input type="checkbox" className="accent-cyan-500" checked={settings.rotationEnabled} onChange={e => setSettings(s => ({ ...s, rotationEnabled: e.target.checked }))} />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[10px] tracking-widest text-gray-300 group-hover:text-white transition-colors">REVOLUTION</span>
                <input type="checkbox" className="accent-cyan-500" checked={settings.revolutionEnabled} onChange={e => setSettings(s => ({ ...s, revolutionEnabled: e.target.checked }))} />
              </label>
            </div>
            
            <div className="pt-2 border-t border-white/10">
              <span className="text-[9px] text-gray-500 tracking-widest mb-2 block">TIME MULTIPLIER</span>
              <div className="flex gap-1">
                {[1, 10, 100, 1000].map(mult => (
                  <button
                    key={mult}
                    onClick={() => setSettings(s => ({ ...s, timeMultiplier: mult }))}
                    className={`flex-1 py-1 text-[9px] font-bold rounded transition-colors ${settings.timeMultiplier === mult ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'}`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Planet Info */}
        <div className="flex justify-between items-end w-full">
          {selectedPlanet ? (
            <div className="bg-black/70 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 w-64 md:w-80 pointer-events-auto shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                    {selectedPlanet.en}
                  </h2>
                  <p className="text-[10px] text-cyan-400 tracking-widest">{selectedPlanet.name}</p>
                </div>
                <button 
                  onClick={() => setSelectedPlanetId(null)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2 text-[11px] tracking-wide">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-500">RADIUS</span>
                  <span className="text-gray-200">{selectedPlanet.radius.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-500">MASS</span>
                  <span className="text-gray-200">{selectedPlanet.mass}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-500">GRAVITY</span>
                  <span className="text-gray-200">{selectedPlanet.gravity} m/s²</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-500">ROTATION</span>
                  <span className="text-gray-200">{selectedPlanet.rotationPeriod} hrs</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-500">ORBIT</span>
                  <span className="text-gray-200">{selectedPlanet.orbitalPeriod} days</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-500">AVG DIST</span>
                  <span className="text-gray-200">{selectedPlanet.orbitRadius} × 10⁶ km</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-500">MOONS</span>
                  <span className="text-cyan-400 font-bold">{selectedPlanet.moons}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => onPlanetClick && onPlanetClick(selectedPlanet.id)}
                  className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 font-bold tracking-widest text-xs rounded transition-colors border border-cyan-500/50"
                >
                  ENTER {selectedPlanet.en.toUpperCase()}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 pointer-events-auto animate-pulse">
              <span className="text-[10px] tracking-widest text-gray-400 flex items-center gap-2">
                <Crosshair className="w-3 h-3" /> SELECT A CELESTIAL BODY
              </span>
            </div>
          )}

          {/* Quick Selection Menu */}
          <div className="flex flex-col gap-1 pointer-events-auto">
            {PLANETS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPlanetId(p.id)}
                className={`text-right px-3 py-1.5 text-[10px] tracking-widest rounded transition-all flex items-center justify-end gap-2 ${selectedPlanetId === p.id ? 'text-cyan-300 bg-cyan-900/40 border-r-2 border-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5 border-r-2 border-transparent'}`}
              >
                {p.en} <span className="w-2 h-2 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)]" style={{ backgroundColor: p.color }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
