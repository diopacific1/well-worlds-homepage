import * as THREE from 'three';
import {
  createWellStoneTexture,
  createCosmicPlasmaTexture,
  createPlanetTexture,
  createCloudTexture,
  createSaturnRingTexture,
  createMoonTexture,
  createAtmosphereMaterial,
  createRadialContactShadowTexture,
} from './proceduralTextures';

export interface CelestialSubject {
  group: THREE.Group;
  id: string;
  name: string;
  subtitle: string;
  category: string;
  route: string;
  color: string;
  distance: number;
  speed: number;
  currentAngle: number;
  size: number;
  description: string;
  stats: { label: string; value: string }[];
  update: (delta: number, timeMultiplier: number) => void;
}

/**
 * Creates the Central Celestial Well (중심 우물 / The Wellspring)
 * An intricate 9-part procedural architectural monument
 */
export function createCelestialWell(): { group: THREE.Group; update: (delta: number) => void } {
  const group = new THREE.Group();
  group.name = 'celestial-well';

  const stoneTexture = createWellStoneTexture();
  const plasmaTexture = createCosmicPlasmaTexture();
  const shadowTexture = createRadialContactShadowTexture();

  // Part 1: Ancient Well Stone Outer Basin (LatheGeometry for rich architectural profile)
  const lathePoints: THREE.Vector2[] = [
    new THREE.Vector2(2.6, -0.8), // Bottom base
    new THREE.Vector2(2.8, -0.6),
    new THREE.Vector2(2.9, 0.0),  // Mid waist bulge
    new THREE.Vector2(2.7, 0.6),
    new THREE.Vector2(3.0, 0.8),  // Outer rim lip
    new THREE.Vector2(3.1, 1.0),  // Top beveled cornice
    new THREE.Vector2(2.5, 1.0),  // Inner rim edge
    new THREE.Vector2(2.4, 0.2),  // Inner well drop
    new THREE.Vector2(0.0, 0.1),  // Center floor
  ];
  const latheGeo = new THREE.LatheGeometry(lathePoints, 32);
  const basinMat = new THREE.MeshStandardMaterial({
    map: stoneTexture,
    roughness: 0.8,
    metalness: 0.2,
    bumpMap: stoneTexture,
    bumpScale: 0.05,
  });
  const basinMesh = new THREE.Mesh(latheGeo, basinMat);
  basinMesh.castShadow = true;
  basinMesh.receiveShadow = true;
  group.add(basinMesh);

  // Part 2: Inner Deep Void Abyss Cylinder
  const abyssGeo = new THREE.CylinderGeometry(2.38, 2.0, 1.6, 32, 1, true);
  const abyssMat = new THREE.MeshBasicMaterial({
    color: 0x020617,
    side: THREE.BackSide,
  });
  const abyssMesh = new THREE.Mesh(abyssGeo, abyssMat);
  abyssMesh.position.y = 0.2;
  group.add(abyssMesh);

  // Part 3: Wellspring Cosmic Plasma / Water Surface
  const plasmaGeo = new THREE.CircleGeometry(2.35, 32);
  const plasmaMat = new THREE.MeshStandardMaterial({
    map: plasmaTexture,
    roughness: 0.15,
    metalness: 0.5,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.45,
    side: THREE.DoubleSide,
  });
  const plasmaMesh = new THREE.Mesh(plasmaGeo, plasmaMat);
  plasmaMesh.rotation.x = -Math.PI / 2;
  plasmaMesh.position.y = 0.55;
  group.add(plasmaMesh);

  // Part 4: Floating Levitating Energy Core (Dual Octahedron)
  const coreGroup = new THREE.Group();
  coreGroup.position.y = 1.6;

  const coreOuterGeo = new THREE.OctahedronGeometry(0.7, 0);
  const coreOuterMat = new THREE.MeshStandardMaterial({
    color: 0xffedd5,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.2,
    roughness: 0.1,
    metalness: 0.9,
    wireframe: true,
  });
  const coreOuterMesh = new THREE.Mesh(coreOuterGeo, coreOuterMat);
  coreGroup.add(coreOuterMesh);

  const coreInnerGeo = new THREE.OctahedronGeometry(0.45, 1);
  const coreInnerMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.5,
    roughness: 0.2,
    metalness: 0.8,
  });
  const coreInnerMesh = new THREE.Mesh(coreInnerGeo, coreInnerMat);
  coreGroup.add(coreInnerMesh);
  group.add(coreGroup);

  // Part 5: Gyro Orbital Ring 1 (Gold Brushed Torus)
  const ring1Geo = new THREE.TorusGeometry(3.6, 0.05, 16, 64);
  const ring1Mat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.2,
    metalness: 0.9,
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.position.y = 1.2;
  ring1.rotation.x = Math.PI / 3;
  group.add(ring1);

  // Part 6: Gyro Orbital Ring 2 (Cyan Cyber Torus)
  const ring2Geo = new THREE.TorusGeometry(4.2, 0.04, 16, 64);
  const ring2Mat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.15,
    metalness: 0.95,
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.position.y = 1.2;
  ring2.rotation.y = Math.PI / 4;
  ring2.rotation.z = Math.PI / 5;
  group.add(ring2);

  // Part 7: Gyro Orbital Ring 3 (Violet Torus)
  const ring3Geo = new THREE.TorusGeometry(4.8, 0.035, 16, 64);
  const ring3Mat = new THREE.MeshStandardMaterial({
    color: 0xa855f7,
    roughness: 0.25,
    metalness: 0.85,
  });
  const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
  ring3.position.y = 1.2;
  ring3.rotation.x = -Math.PI / 6;
  group.add(ring3);

  // Part 8: Eight Ornamental Runic Gem Brackets along the well rim
  const bracketGeo = new THREE.BoxGeometry(0.18, 0.25, 0.35);
  const bracketMat = new THREE.MeshStandardMaterial({
    color: 0x818cf8,
    emissive: 0x4f46e5,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.8,
  });
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const bracket = new THREE.Mesh(bracketGeo, bracketMat);
    bracket.position.x = Math.cos(angle) * 3.05;
    bracket.position.z = Math.sin(angle) * 3.05;
    bracket.position.y = 0.95;
    bracket.rotation.y = -angle;
    group.add(bracket);
  }

  // Part 9: Contact Shadow Plane Grounding the Well
  const shadowGeo = new THREE.PlaneGeometry(9, 9);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -0.81;
  group.add(shadowMesh);

  // Animation logic
  const update = (delta: number) => {
    plasmaMesh.rotation.z += delta * 0.25;
    coreGroup.rotation.y += delta * 0.8;
    coreGroup.rotation.x += delta * 0.4;
    coreGroup.position.y = 1.6 + Math.sin(Date.now() * 0.0018) * 0.12;

    ring1.rotation.z += delta * 0.35;
    ring2.rotation.x += delta * 0.28;
    ring3.rotation.y -= delta * 0.22;
  };

  return { group, update };
}

/**
 * Creates "나의 세계" (Stories & Deep Memory World)
 * Multi-layer photorealistic Terra planet with fractal continents, independent cloud deck,
 * Rayleigh scattering atmospheric limb glow, and orbital archive satellite probe.
 */
export function createStoryWorld(): CelestialSubject {
  const group = new THREE.Group();
  group.name = 'planet-portfolio';

  const diffuseMap = createPlanetTexture('story', 'diffuse');
  const bumpMap = createPlanetTexture('story', 'bump');
  const cloudMap = createCloudTexture('earth');

  // Part 1: Primary Terra Planetary Body (Equirectangular continental elevation)
  const planetGeo = new THREE.SphereGeometry(1.2, 64, 64);
  const planetMat = new THREE.MeshStandardMaterial({
    map: diffuseMap,
    bumpMap: bumpMap,
    bumpScale: 0.05,
    roughness: 0.52,
    metalness: 0.12,
  });
  const planetMesh = new THREE.Mesh(planetGeo, planetMat);
  planetMesh.castShadow = true;
  planetMesh.receiveShadow = true;
  group.add(planetMesh);

  // Part 2: Independent Dynamic Cloud Sphere (Parallax atmospheric rotation)
  const cloudGeo = new THREE.SphereGeometry(1.222, 64, 64);
  const cloudMat = new THREE.MeshStandardMaterial({
    map: cloudMap,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    roughness: 0.9,
  });
  const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
  group.add(cloudMesh);

  // Part 3: Photorealistic Rayleigh Scattering Atmospheric Limb Glow
  const atmosphereGeo = new THREE.SphereGeometry(1.35, 32, 32);
  const atmosphereMat = createAtmosphereMaterial(0x38bdf8, 0.65);
  const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  group.add(atmosphereMesh);

  // Part 4: Orbiting Manuscript Memory Ribbon (Tilted ethereal data ring)
  const ribbonGeo = new THREE.TorusGeometry(1.95, 0.035, 16, 64);
  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.8,
  });
  const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
  ribbonMesh.rotation.x = Math.PI / 3.2;
  ribbonMesh.rotation.y = Math.PI / 6;
  group.add(ribbonMesh);

  // Part 5: Scientific Archive Satellite with Solar Panels
  const satGroup = new THREE.Group();
  const satBodyGeo = new THREE.BoxGeometry(0.14, 0.14, 0.22);
  const satBodyMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.9, roughness: 0.1 });
  const satBody = new THREE.Mesh(satBodyGeo, satBodyMat);
  satGroup.add(satBody);

  const solarPanelGeo = new THREE.BoxGeometry(0.55, 0.02, 0.16);
  const solarPanelMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.95, roughness: 0.1 });
  const solarPanel = new THREE.Mesh(solarPanelGeo, solarPanelMat);
  satGroup.add(solarPanel);

  satGroup.position.set(2.25, 0.4, 0);
  group.add(satGroup);

  let currentAngle = 0.5;
  const distance = 10.5;
  const speed = 0.35;

  const update = (delta: number, timeMultiplier: number) => {
    currentAngle += delta * speed * 0.1 * timeMultiplier;
    group.position.x = Math.cos(currentAngle) * distance;
    group.position.z = Math.sin(currentAngle) * distance;

    planetMesh.rotation.y += delta * 0.35 * timeMultiplier;
    cloudMesh.rotation.y += delta * 0.48 * timeMultiplier; // Clouds drift across continents
    ribbonMesh.rotation.z += delta * 0.22;

    const satAngle = Date.now() * 0.002;
    satGroup.position.x = Math.cos(satAngle) * 2.25;
    satGroup.position.z = Math.sin(satAngle) * 2.25;
    satGroup.rotation.y = satAngle + Math.PI / 2;
  };

  return {
    group,
    id: 'portfolio',
    name: '나의 세계',
    subtitle: '스토리 & 사유의 아카이브',
    category: 'STORY',
    route: '/stories',
    color: '#3b82f6',
    distance,
    speed,
    currentAngle,
    size: 1.2,
    description: '심연의 우물에서 길어 올린 이야기와 사유, AI 소설이 보관된 기억의 행성입니다.',
    stats: [
      { label: '아카이브', value: '지적 기록' },
      { label: '대기 구성', value: '사유 & 감성' },
      { label: '보존 주기', value: '영구 보관' },
    ],
    update,
  };
}

/**
 * Creates "크립토 월드" (Financial Nexus & Crypto Terminal)
 * Majestic Golden Gas Giant modeled with turbulent zonal wind bands, Great Golden cyclonic vortex,
 * authentic double-sided Saturnian planetary rings with Cassini division, and orbiting quantum nodes.
 */
export function createCryptoWorld(): CelestialSubject {
  const group = new THREE.Group();
  group.name = 'planet-crypto';

  const diffuseMap = createPlanetTexture('crypto', 'diffuse');
  const bumpMap = createPlanetTexture('crypto', 'bump');
  const ringTexture = createSaturnRingTexture('crypto');

  // Part 1: Banded Gas Giant Planet Sphere with Great Gold Vortex
  const coreGeo = new THREE.SphereGeometry(1.3, 64, 64);
  const coreMat = new THREE.MeshStandardMaterial({
    map: diffuseMap,
    bumpMap: bumpMap,
    bumpScale: 0.035,
    roughness: 0.38,
    metalness: 0.25,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.castShadow = true;
  coreMesh.receiveShadow = true;
  group.add(coreMesh);

  // Part 2: Photorealistic Saturnian Ring System (Cassini Division & Fine Dust Bands)
  const ringGeo = new THREE.RingGeometry(1.68, 3.25, 128);
  const ringMat = new THREE.MeshStandardMaterial({
    map: ringTexture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.95,
    roughness: 0.32,
    metalness: 0.35,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2.3;
  ringMesh.rotation.y = 0.15;
  group.add(ringMesh);

  // Part 3: Warm Golden Atmospheric Limb Glow Shader
  const atmosphereGeo = new THREE.SphereGeometry(1.44, 32, 32);
  const atmosphereMat = createAtmosphereMaterial(0xf59e0b, 0.6);
  const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  group.add(atmosphereMesh);

  // Part 4: Quantum Bus Data Nodes revolving along ring plane
  const nodeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
  const nodeMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x06b6d4,
    emissiveIntensity: 1.2,
    roughness: 0.1,
    metalness: 0.9,
  });
  const nodeGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI * 2) / 4;
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.x = Math.cos(angle) * 2.4;
    node.position.z = Math.sin(angle) * 2.4;
    nodeGroup.add(node);
  }
  nodeGroup.rotation.x = Math.PI / 2.3;
  nodeGroup.rotation.y = 0.15;
  group.add(nodeGroup);

  let currentAngle = 2.1;
  const distance = 16.0;
  const speed = 0.26;

  const update = (delta: number, timeMultiplier: number) => {
    currentAngle += delta * speed * 0.1 * timeMultiplier;
    group.position.x = Math.cos(currentAngle) * distance;
    group.position.z = Math.sin(currentAngle) * distance;

    coreMesh.rotation.y += delta * 0.45 * timeMultiplier;
    nodeGroup.rotation.z += delta * 0.6;
  };

  return {
    group,
    id: 'crypto',
    name: '크립토 월드',
    subtitle: '가상자산 터미널 & 분석기',
    category: 'FINANCE',
    route: '/crypto',
    color: '#f59e0b',
    distance,
    speed,
    currentAngle,
    size: 1.3,
    description: '변동성의 파도 속에서 데이터와 수식이 균형을 이루는 가상자산 분석의 허브입니다.',
    stats: [
      { label: '데이터 피드', value: '초당 수만 틱' },
      { label: '알고리즘', value: '정량 분석' },
      { label: '보안 등급', value: '다중 암호화' },
    ],
    update,
  };
}

/**
 * Creates "디지털 정원" (Verdant Biosphere Super-Earth)
 * Lush emerald rainforest continents, turquoise barrier reefs, independent weather cloud sphere,
 * jade Rayleigh atmospheric glow, and an orbiting cratered rocky moon.
 */
export function createGardenWorld(): CelestialSubject {
  const group = new THREE.Group();
  group.name = 'planet-garden';

  const diffuseMap = createPlanetTexture('garden', 'diffuse');
  const bumpMap = createPlanetTexture('garden', 'bump');
  const cloudMap = createCloudTexture('garden');

  // Part 1: Verdant Super-Earth Biosphere Body
  const terraGeo = new THREE.SphereGeometry(1.15, 64, 64);
  const terraMat = new THREE.MeshStandardMaterial({
    map: diffuseMap,
    bumpMap: bumpMap,
    bumpScale: 0.06,
    roughness: 0.65,
    metalness: 0.08,
  });
  const terraMesh = new THREE.Mesh(terraGeo, terraMat);
  terraMesh.castShadow = true;
  terraMesh.receiveShadow = true;
  group.add(terraMesh);

  // Part 2: Independent Weather Cloud Deck Sphere
  const cloudGeo = new THREE.SphereGeometry(1.175, 64, 64);
  const cloudMat = new THREE.MeshStandardMaterial({
    map: cloudMap,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    roughness: 0.88,
  });
  const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
  group.add(cloudMesh);

  // Part 3: Jade/Emerald Rayleigh Atmospheric Limb Glow
  const atmosphereGeo = new THREE.SphereGeometry(1.28, 32, 32);
  const atmosphereMat = createAtmosphereMaterial(0x10b981, 0.65);
  const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  group.add(atmosphereMesh);

  // Part 4: Orbiting Cratered Lunar Moon
  const moonGeo = new THREE.SphereGeometry(0.24, 32, 32);
  const moonMat = new THREE.MeshStandardMaterial({
    map: createMoonTexture(),
    roughness: 0.75,
    metalness: 0.1,
  });
  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.castShadow = true;
  moonMesh.position.set(2.3, 0.4, 0);
  group.add(moonMesh);

  let currentAngle = 4.2;
  const distance = 21.5;
  const speed = 0.2;

  const update = (delta: number, timeMultiplier: number) => {
    currentAngle += delta * speed * 0.1 * timeMultiplier;
    group.position.x = Math.cos(currentAngle) * distance;
    group.position.z = Math.sin(currentAngle) * distance;

    terraMesh.rotation.y += delta * 0.32 * timeMultiplier;
    cloudMesh.rotation.y += delta * 0.42 * timeMultiplier;

    const moonAngle = Date.now() * 0.0016;
    moonMesh.position.x = Math.cos(moonAngle) * 2.3;
    moonMesh.position.z = Math.sin(moonAngle) * 2.3;
    moonMesh.rotation.y += delta * 0.5;
  };

  return {
    group,
    id: 'garden',
    name: '디지털 정원',
    subtitle: '반려 식물 생장 일지',
    category: 'GARDEN',
    route: '/plants',
    color: '#10b981',
    distance,
    speed,
    currentAngle,
    size: 1.15,
    description: '베란다 텃밭과 작은 화분들이 건네는 느림의 미학, 생명의 순간을 기록하는 온실입니다.',
    stats: [
      { label: '식물 종수', value: '다양성 보존' },
      { label: '생장 수분도', value: '최적 수분 94%' },
      { label: '생태 바이옴', value: '온실 돔' },
    ],
    update,
  };
}

/**
 * Creates "방명록" (Guestbook / Beacon of Visitors)
 * Royal Amethyst Gas/Ice Giant with glowing polar auroral ovals,
 * translucent lavender ice dust ring, and dual orbiting cratered moons.
 */
export function createGuestbookWorld(): CelestialSubject {
  const group = new THREE.Group();
  group.name = 'planet-guestbook';

  const diffuseMap = createPlanetTexture('guestbook', 'diffuse');
  const bumpMap = createPlanetTexture('guestbook', 'bump');
  const ringTexture = createSaturnRingTexture('guestbook');

  // Part 1: Amethyst Core Gas Giant with Polar Auroras
  const coreGeo = new THREE.SphereGeometry(1.18, 64, 64);
  const coreMat = new THREE.MeshStandardMaterial({
    map: diffuseMap,
    bumpMap: bumpMap,
    bumpScale: 0.04,
    roughness: 0.42,
    metalness: 0.22,
    emissive: 0x581c87,
    emissiveIntensity: 0.25,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.castShadow = true;
  coreMesh.receiveShadow = true;
  group.add(coreMesh);

  // Part 2: Translucent Icy Dust Ring
  const ringGeo = new THREE.RingGeometry(1.55, 2.65, 96);
  const ringMat = new THREE.MeshStandardMaterial({
    map: ringTexture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
    roughness: 0.25,
    metalness: 0.45,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2.5;
  ringMesh.rotation.y = -0.12;
  group.add(ringMesh);

  // Part 3: Ultraviolet / Lavender Atmospheric Limb Glow
  const atmosphereGeo = new THREE.SphereGeometry(1.32, 32, 32);
  const atmosphereMat = createAtmosphereMaterial(0xa855f7, 0.7);
  const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  group.add(atmosphereMesh);

  // Part 4 & 5: Dual Orbiting Moons (Inner rocky moon + outer icy moonlet)
  const moon1Geo = new THREE.SphereGeometry(0.18, 24, 24);
  const moon1Mat = new THREE.MeshStandardMaterial({
    map: createMoonTexture(),
    roughness: 0.7,
    metalness: 0.1,
  });
  const moon1 = new THREE.Mesh(moon1Geo, moon1Mat);
  group.add(moon1);

  const moon2Geo = new THREE.SphereGeometry(0.11, 24, 24);
  const moon2Mat = new THREE.MeshStandardMaterial({
    color: 0xe9d5ff,
    roughness: 0.4,
    metalness: 0.5,
  });
  const moon2 = new THREE.Mesh(moon2Geo, moon2Mat);
  group.add(moon2);

  let currentAngle = 5.5;
  const distance = 27.0;
  const speed = 0.16;

  const update = (delta: number, timeMultiplier: number) => {
    currentAngle += delta * speed * 0.1 * timeMultiplier;
    group.position.x = Math.cos(currentAngle) * distance;
    group.position.z = Math.sin(currentAngle) * distance;

    coreMesh.rotation.y += delta * 0.38 * timeMultiplier;
    ringMesh.rotation.z += delta * 0.25;

    // Dual moons independent orbital revolutions
    const m1Angle = Date.now() * 0.0022;
    moon1.position.x = Math.cos(m1Angle) * 2.2;
    moon1.position.z = Math.sin(m1Angle) * 2.2;
    moon1.position.y = Math.sin(m1Angle * 2) * 0.2;

    const m2Angle = Date.now() * 0.0012 + 1.5;
    moon2.position.x = Math.cos(m2Angle) * 3.1;
    moon2.position.z = Math.sin(m2Angle) * 3.1;
    moon2.position.y = Math.cos(m2Angle) * 0.4;
  };

  return {
    group,
    id: 'guestbook',
    name: '방명록',
    subtitle: '방문자 메시지 & 신호소',
    category: 'COMMUNITY',
    route: '/guestbook',
    color: '#a855f7',
    distance,
    speed,
    currentAngle,
    size: 1.18,
    description: '우물을 찾아온 여행자들이 남긴 다정한 발자국과 따뜻한 응원의 신호가 머무는 별입니다.',
    stats: [
      { label: '통신 상태', value: '실시간 수신 중' },
      { label: '신호 주파수', value: '오픈 채널' },
      { label: '기록 저장소', value: '영구 아카이브' },
    ],
    update,
  };
}

/**
 * Creates Instanced Cosmic Particle Field (Floating starlight & ethereal motes)
 */
export function createStarlightField(count = 600): { mesh: THREE.InstancedMesh; update: (delta: number) => void } {
  const geo = new THREE.DodecahedronGeometry(0.08, 0);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, count);

  const dummy = new THREE.Object3D();
  const speeds: number[] = [];
  const initialY: number[] = [];
  const radii: number[] = [];
  const angles: number[] = [];

  const colorPalette = [
    new THREE.Color('#38bdf8'),
    new THREE.Color('#fbbf24'),
    new THREE.Color('#34d399'),
    new THREE.Color('#c084fc'),
    new THREE.Color('#ffffff'),
  ];

  for (let i = 0; i < count; i++) {
    const radius = 6 + Math.random() * 32;
    const angle = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 16;

    radii.push(radius);
    angles.push(angle);
    initialY.push(y);
    speeds.push(0.02 + Math.random() * 0.05);

    dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    const scale = 0.4 + Math.random() * 1.2;
    dummy.scale.set(scale, scale, scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);

    const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    mesh.setColorAt(i, col);
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.computeBoundingSphere();

  const update = (delta: number) => {
    for (let i = 0; i < count; i++) {
      angles[i] += delta * speeds[i] * 0.3;
      initialY[i] += Math.sin(angles[i] * 2) * 0.005;

      dummy.position.set(
        Math.cos(angles[i]) * radii[i],
        initialY[i],
        Math.sin(angles[i]) * radii[i]
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };

  return { mesh, update };
}

/**
 * Creates a Challenger-style procedural Space Shuttle (NASA Orbiter)
 * An 8-part composite aerodynamic craft designed for interplanetary cruising
 */
export function createSpaceShuttle(): {
  group: THREE.Group;
  plumes: THREE.Mesh[];
  thrusterLight: THREE.PointLight;
  update: (delta: number) => void;
} {
  const group = new THREE.Group();
  group.name = 'space-shuttle-challenger';

  // Materials
  const whiteTileMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.35,
    metalness: 0.15,
  });

  const blackTileMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.6,
    metalness: 0.3,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: 0x0369a1,
    emissiveIntensity: 0.4,
    roughness: 0.08,
    metalness: 0.95,
  });

  const engineNozzleMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.25,
    metalness: 0.9,
  });

  const plumeMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide,
  });

  // Inner model root with 180° Y rotation:
  // In Three.js, Object3D.lookAt aligns the local +Z axis toward the destination.
  // Rotating modelRoot by Math.PI makes the aerodynamic nose point forward (+Z) in the direction of flight,
  // while the SSME rocket engines and cyan exhaust plumes trail realistically behind (-Z).
  const modelRoot = new THREE.Group();
  modelRoot.name = 'shuttle-model-root';
  modelRoot.rotation.y = Math.PI;
  group.add(modelRoot);

  // Part 1: Main Fuselage (Mid cargo section)
  const fuselageGeo = new THREE.CylinderGeometry(0.38, 0.44, 1.8, 16);
  const fuselage = new THREE.Mesh(fuselageGeo, whiteTileMat);
  fuselage.rotation.x = Math.PI / 2;
  fuselage.position.z = 0;
  fuselage.castShadow = true;
  modelRoot.add(fuselage);

  // Part 2: Aerodynamic Nose Cone & Thermal Cap
  const noseGeo = new THREE.ConeGeometry(0.38, 0.9, 16);
  const nose = new THREE.Mesh(noseGeo, whiteTileMat);
  nose.rotation.x = -Math.PI / 2;
  nose.position.z = -1.35;
  nose.castShadow = true;
  modelRoot.add(nose);

  // Nose black heat shield tip
  const noseTipGeo = new THREE.SphereGeometry(0.16, 12, 12);
  const noseTip = new THREE.Mesh(noseTipGeo, blackTileMat);
  noseTip.position.z = -1.8;
  modelRoot.add(noseTip);

  // Part 3: Flight Deck Cockpit Canopy (Black visor wrap with glass panes)
  const cockpitGeo = new THREE.BoxGeometry(0.38, 0.16, 0.42);
  const cockpit = new THREE.Mesh(cockpitGeo, glassMat);
  cockpit.position.set(0, 0.28, -0.95);
  cockpit.rotation.x = -0.25;
  modelRoot.add(cockpit);

  // Part 4: Swept Double-Delta Wings (Extruded aerodynamic profile with black leading edges)
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0.9);      // Root forward
  wingShape.lineTo(1.6, 0.9);     // Wing tip rear
  wingShape.lineTo(1.6, 0.5);     // Wing tip edge
  wingShape.lineTo(0.35, -0.7);   // Leading edge sweep
  wingShape.lineTo(0, -0.7);      // Centerline
  wingShape.closePath();

  const extrudeSettings = {
    steps: 1,
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  };

  const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);

  // Right Wing
  const rightWing = new THREE.Mesh(wingGeo, whiteTileMat);
  rightWing.rotation.x = Math.PI / 2;
  rightWing.position.set(0, -0.1, 0);
  rightWing.castShadow = true;
  modelRoot.add(rightWing);

  // Left Wing (Mirrored)
  const leftWing = new THREE.Mesh(wingGeo, whiteTileMat);
  leftWing.rotation.x = Math.PI / 2;
  leftWing.rotation.y = Math.PI;
  leftWing.position.set(0, -0.1, 0);
  leftWing.castShadow = true;
  modelRoot.add(leftWing);

  // Wing Black Heat Shield Leading Edge Accents
  const edgeGeo = new THREE.BoxGeometry(0.06, 0.07, 1.4);
  const edgeRight = new THREE.Mesh(edgeGeo, blackTileMat);
  edgeRight.position.set(0.9, -0.09, 0.2);
  edgeRight.rotation.y = -0.65;
  modelRoot.add(edgeRight);

  const edgeLeft = new THREE.Mesh(edgeGeo, blackTileMat);
  edgeLeft.position.set(-0.9, -0.09, 0.2);
  edgeLeft.rotation.y = 0.65;
  modelRoot.add(edgeLeft);

  // Part 5: Swept Vertical Stabilizer (Tail Fin)
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.7, 0);
  finShape.lineTo(0.35, 1.1);
  finShape.lineTo(0, 1.1);
  finShape.closePath();

  const finGeo = new THREE.ExtrudeGeometry(finShape, {
    steps: 1,
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
  });
  const fin = new THREE.Mesh(finGeo, whiteTileMat);
  fin.position.set(-0.025, 0.25, 0.2);
  fin.rotation.y = Math.PI / 2;
  fin.castShadow = true;
  modelRoot.add(fin);

  // Part 6: Twin OMS Pods (Orbital Maneuvering System flanking tail)
  const omsGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.7, 12);
  const omsRight = new THREE.Mesh(omsGeo, whiteTileMat);
  omsRight.rotation.x = Math.PI / 2;
  omsRight.position.set(0.24, 0.22, 0.65);
  modelRoot.add(omsRight);

  const omsLeft = new THREE.Mesh(omsGeo, whiteTileMat);
  omsLeft.rotation.x = Math.PI / 2;
  omsLeft.position.set(-0.24, 0.22, 0.65);
  modelRoot.add(omsLeft);

  // Part 7: 3 Main Rocket Engine Bell Nozzles (SSME Inverted Triangle Cluster)
  const nozzleGeo = new THREE.CylinderGeometry(0.11, 0.18, 0.35, 16, 1, true);
  const engine1 = new THREE.Mesh(nozzleGeo, engineNozzleMat);
  engine1.rotation.x = Math.PI / 2;
  engine1.position.set(0, 0.24, 1.05); // Top center
  modelRoot.add(engine1);

  const engine2 = new THREE.Mesh(nozzleGeo, engineNozzleMat);
  engine2.rotation.x = Math.PI / 2;
  engine2.position.set(0.2, -0.05, 1.05); // Bottom right
  modelRoot.add(engine2);

  const engine3 = new THREE.Mesh(nozzleGeo, engineNozzleMat);
  engine3.rotation.x = Math.PI / 2;
  engine3.position.set(-0.2, -0.05, 1.05); // Bottom left
  modelRoot.add(engine3);

  // Part 8: Luminous Rocket Thruster Exhaust Plumes (Pulsing glowing plasma)
  const plumeGeo = new THREE.ConeGeometry(0.14, 0.9, 16, 1, true);
  const plumes: THREE.Mesh[] = [];

  const p1 = new THREE.Mesh(plumeGeo, plumeMat);
  p1.rotation.x = -Math.PI / 2;
  p1.position.set(0, 0.24, 1.6);
  modelRoot.add(p1);
  plumes.push(p1);

  const p2 = new THREE.Mesh(plumeGeo, plumeMat);
  p2.rotation.x = -Math.PI / 2;
  p2.position.set(0.2, -0.05, 1.6);
  modelRoot.add(p2);
  plumes.push(p2);

  const p3 = new THREE.Mesh(plumeGeo, plumeMat);
  p3.rotation.x = -Math.PI / 2;
  p3.position.set(-0.2, -0.05, 1.6);
  modelRoot.add(p3);
  plumes.push(p3);

  // Dynamic Thruster Point Light casting cyan exhaust glow
  const thrusterLight = new THREE.PointLight(0x38bdf8, 2.0, 10, 1.5);
  thrusterLight.position.set(0, 0.1, 1.6);
  modelRoot.add(thrusterLight);

  // NASA / Challenger Accents (Insignia blue strip)
  const stripeGeo = new THREE.BoxGeometry(0.02, 0.08, 0.5);
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0x2563eb });
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.position.set(0.38, 0.12, -0.2);
  modelRoot.add(stripe);

  // Scale shuttle to fit cosmos proportions seamlessly
  group.scale.set(0.85, 0.85, 0.85);

  const update = (delta: number) => {
    // Thruster pulse flicker
    const time = Date.now() * 0.015;
    const flicker = 0.85 + Math.sin(time) * 0.15 + (Math.random() - 0.5) * 0.08;
    plumes.forEach((p, idx) => {
      p.scale.z = flicker * (1 + idx * 0.05);
      p.scale.x = 0.9 + Math.cos(time * 1.2 + idx) * 0.1;
      p.scale.y = p.scale.x;
    });
    thrusterLight.intensity = 1.8 + Math.sin(time * 2) * 0.6;
  };

  return { group, plumes, thrusterLight, update };
}
