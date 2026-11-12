import * as THREE from 'three';

/**
 * High-performance procedural noise and texture synthesizer for Three.js celestial bodies.
 * Generates photorealistic multi-octave planetary terrain, cloud decks, Saturnian rings,
 * lunar craters, and atmospheric Rayleigh scattering Fresnel shaders with 100% zero-404 reliability.
 */

// Permutation table for Perlin gradient noise
const PERM = new Uint8Array(512);
(() => {
  const p = [
    151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,
    8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,
    35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,
    134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,
    55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,
    18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,
    250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,
    189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,
    172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,
    228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,
    107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
  ];
  for (let i = 0; i < 256; i++) {
    PERM[i] = p[i];
    PERM[i + 256] = p[i];
  }
})();

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function grad(hash: number, x: number, y: number): number {
  const h = hash & 3;
  return h === 0 ? x + y : h === 1 ? -x + y : h === 2 ? x - y : -x - y;
}

function perlin2D(x: number, y: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);

  const u = fade(xf);
  const v = fade(yf);

  const A = PERM[X] + Y;
  const B = PERM[X + 1] + Y;

  return (
    (1 - v) * ((1 - u) * grad(PERM[A], xf, yf) + u * grad(PERM[B], xf - 1, yf)) +
    v * ((1 - u) * grad(PERM[A + 1], xf, yf - 1) + u * grad(PERM[B + 1], xf - 1, yf - 1))
  );
}

/**
 * Fractional Brownian Motion (fBm) multi-octave turbulence
 */
function fbm(x: number, y: number, octaves = 5, lacunarity = 2.0, gain = 0.5): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1.0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * perlin2D(x * freq, y * freq);
    freq *= lacunarity;
    amp *= gain;
  }
  return sum;
}

/**
 * Creates realistic equirectangular planetary maps (diffuse color & elevation bump)
 */
export function createPlanetTexture(
  type: 'story' | 'crypto' | 'garden' | 'guestbook',
  layer: 'diffuse' | 'bump' = 'diffuse'
): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    // Latitude from -1 (South Pole) to +1 (North Pole)
    const lat = 1.0 - (y / height) * 2.0;
    const absLat = Math.abs(lat);
    const ny = (y / height) * 4.0;

    for (let x = 0; x < width; x++) {
      const nx = (x / width) * 8.0;
      const idx = (y * width + x) * 4;

      if (type === 'story') {
        // "나의 세계" - Deep Oceanic Kepler Terra World with Fractal Continents & Polar Ice
        const n = fbm(nx, ny, 5);
        const elevation = n * 0.7 + (1.0 - absLat * 0.4) * 0.1;

        if (layer === 'bump') {
          // Elevation grayscale for surface bump
          const bumpVal = Math.min(255, Math.max(0, Math.floor((elevation + 0.3) * 220)));
          data[idx] = bumpVal;
          data[idx + 1] = bumpVal;
          data[idx + 2] = bumpVal;
          data[idx + 3] = 255;
        } else {
          // Diffuse Color
          if (absLat > 0.82) {
            // Polar Glaciers & Sea Ice
            data[idx] = 240; data[idx + 1] = 248; data[idx + 2] = 255;
          } else if (elevation < -0.05) {
            // Deep Abyssal Ocean
            data[idx] = 8; data[idx + 1] = 24; data[idx + 2] = 68;
          } else if (elevation < 0.08) {
            // Continental Shelf / Azure Coastal Waters
            data[idx] = 14; data[idx + 1] = 116; data[idx + 2] = 188;
          } else if (elevation < 0.18) {
            // Shoreline / Lowland
            data[idx] = 30; data[idx + 1] = 88; data[idx + 2] = 160;
          } else if (elevation < 0.38) {
            // Temperate Continental Landmass
            data[idx] = 37; data[idx + 1] = 99; data[idx + 2] = 235;
          } else if (elevation < 0.52) {
            // High Crystalline Mountain Plateaus
            data[idx] = 96; data[idx + 1] = 165; data[idx + 2] = 250;
          } else {
            // Snow-capped Mountain Peaks
            data[idx] = 224; data[idx + 1] = 242; data[idx + 2] = 254;
          }
          data[idx + 3] = 255;
        }
      } else if (type === 'crypto') {
        // "크립토 월드" - Majestic Golden Gas Giant (Jupiter/Saturn-like atmospheric bands & storms)
        const wavyY = ny + fbm(nx * 0.5, ny * 0.5, 4) * 0.45;
        const bandNoise = fbm(nx * 2.0, wavyY * 6.0, 4);

        // Great Golden Cyclonic Storm Vortex (Centered at x=180, y=160)
        const dx = (x - 180) / 38;
        const dy = (y - 150) / 22;
        const stormDist = Math.sqrt(dx * dx + dy * dy);
        const inStorm = stormDist < 1.0;

        if (layer === 'bump') {
          const bumpVal = Math.floor(((bandNoise + 0.5) * 0.5 + (inStorm ? 0.3 : 0.0)) * 255);
          data[idx] = bumpVal;
          data[idx + 1] = bumpVal;
          data[idx + 2] = bumpVal;
          data[idx + 3] = 255;
        } else {
          // Banded golden amber, deep bronze, rich ochre & cream zonal flow
          const t = Math.sin(wavyY * 7.0 + bandNoise * 1.5) * 0.5 + 0.5;

          if (inStorm) {
            // Great Gold Anticyclonic Vortex
            const swirl = (1.0 - stormDist);
            data[idx] = 251; data[idx + 1] = 191; data[idx + 2] = 36;
          } else if (t < 0.25) {
            // Deep Bronze Belt
            data[idx] = 120; data[idx + 1] = 53; data[idx + 2] = 15;
          } else if (t < 0.5) {
            // Golden Amber Zone
            data[idx] = 217; data[idx + 1] = 119; data[idx + 2] = 6;
          } else if (t < 0.75) {
            // Warm Ochre Cloud Belt
            data[idx] = 245; data[idx + 1] = 158; data[idx + 2] = 11;
          } else {
            // Bright Cream Atmospheric Plume
            data[idx] = 254; data[idx + 1] = 243; data[idx + 2] = 199;
          }
          data[idx + 3] = 255;
        }
      } else if (type === 'garden') {
        // "디지털 정원" - Lush Emerald Biosphere Super-Earth (Verdant rainforest continents & azure seas)
        const n = fbm(nx, ny, 5);
        const elevation = n * 0.75;

        if (layer === 'bump') {
          const bumpVal = Math.min(255, Math.max(0, Math.floor((elevation + 0.3) * 230)));
          data[idx] = bumpVal;
          data[idx + 1] = bumpVal;
          data[idx + 2] = bumpVal;
          data[idx + 3] = 255;
        } else {
          if (absLat > 0.85) {
            // Tundra & Glacial Ice
            data[idx] = 240; data[idx + 1] = 253; data[idx + 2] = 244;
          } else if (elevation < -0.08) {
            // Deep Marine Ocean
            data[idx] = 4; data[idx + 1] = 47; data[idx + 2] = 46;
          } else if (elevation < 0.06) {
            // Turquoise Barrier Reefs & Shallow Lagoons
            data[idx] = 13; data[idx + 1] = 148; data[idx + 2] = 136;
          } else if (elevation < 0.16) {
            // Emerald Coastal Marshlands
            data[idx] = 16; data[idx + 1] = 185; data[idx + 2] = 129;
          } else if (elevation < 0.42) {
            // Dense Canopy Rainforest & Flora Basins
            data[idx] = 5; data[idx + 1] = 120; data[idx + 2] = 85;
          } else if (elevation < 0.58) {
            // Highland Moss Ridges
            data[idx] = 4; data[idx + 1] = 85; data[idx + 2] = 60;
          } else {
            // Alpine Fog Peaks
            data[idx] = 209; data[idx + 1] = 250; data[idx + 2] = 229;
          }
          data[idx + 3] = 255;
        }
      } else {
        // "방명록" - Mystic Amethyst & Royal Violet Gas/Ice Giant with Aurora Zones
        const wavyY = ny + fbm(nx * 0.4, ny * 0.8, 4) * 0.35;
        const n = fbm(nx * 1.5, wavyY * 5.0, 4);

        if (layer === 'bump') {
          const bumpVal = Math.floor((n + 0.5) * 200);
          data[idx] = bumpVal;
          data[idx + 1] = bumpVal;
          data[idx + 2] = bumpVal;
          data[idx + 3] = 255;
        } else {
          // Polar Auroral Ovals (Glowing Cyan/Magenta bands near poles)
          if (absLat > 0.78 && absLat < 0.88) {
            data[idx] = 192; data[idx + 1] = 132; data[idx + 2] = 252; // Radiant Aurora Ring
          } else {
            const t = Math.sin(wavyY * 8.0 + n * 2.0) * 0.5 + 0.5;
            if (t < 0.3) {
              // Dark Nebula Abyss
              data[idx] = 46; data[idx + 1] = 16; data[idx + 2] = 101;
            } else if (t < 0.6) {
              // Deep Royal Violet
              data[idx] = 88; data[idx + 1] = 28; data[idx + 2] = 135;
            } else if (t < 0.85) {
              // Vibrant Amethyst Cloud Stream
              data[idx] = 147; data[idx + 1] = 51; data[idx + 2] = 234;
            } else {
              // Ultraviolet Radiant Band
              data[idx] = 216; data[idx + 1] = 180; data[idx + 2] = 254;
            }
          }
          data[idx + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates dynamic planetary cloud deck texture with transparency
 */
export function createCloudTexture(type: 'earth' | 'garden'): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const ny = (y / height) * 4.0;
    const lat = 1.0 - (y / height) * 2.0;
    const absLat = Math.abs(lat);

    for (let x = 0; x < width; x++) {
      const nx = (x / width) * 8.0;
      const idx = (y * width + x) * 4;

      // Swirling cloud filaments & tropical cyclonic clusters
      const swirl = fbm(nx + fbm(nx, ny, 3) * 0.4, ny, 4);
      let cloudDensity = swirl * 0.6 + 0.2;

      // Higher cloud density at equatorial intertropical convergence and temperate storm tracks
      if (absLat < 0.15 || (absLat > 0.45 && absLat < 0.65)) {
        cloudDensity += 0.22;
      }

      const alpha = Math.min(240, Math.max(0, Math.floor((cloudDensity - 0.28) * 480)));

      data[idx] = 255;
      data[idx + 1] = type === 'garden' ? 245 : 255;
      data[idx + 2] = 255;
      data[idx + 3] = alpha;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates photorealistic Saturn-style concentric planetary ring textures
 * with Cassini Division, Encke Gap, and micro-groove dust density variations.
 */
export function createSaturnRingTexture(type: 'crypto' | 'guestbook'): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const center = size / 2;
  const maxR = size / 2;

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Normalized radius boundaries (0.0 center to 1.0 outer edge)
  // Inner Crepe C-Ring: 0.52 to 0.64
  // Dense B-Ring: 0.64 to 0.78
  // Cassini Division: 0.78 to 0.82 (Dark / transparent gap)
  // Outer A-Ring: 0.82 to 0.96
  for (let y = 0; y < size; y++) {
    const dy = y - center;
    for (let x = 0; x < size; x++) {
      const dx = x - center;
      const r = Math.sqrt(dx * dx + dy * dy) / maxR;
      const idx = (y * size + x) * 4;

      if (r < 0.52 || r > 0.96) {
        data[idx + 3] = 0; // Completely transparent inside and outside ring
      } else {
        let opacity = 0;
        let rCol = 255, gCol = 255, bCol = 255;

        // Concentric micro-groove noise
        const micro = (Math.sin(r * 400.0) * 0.5 + 0.5) * 0.15;

        if (r < 0.64) {
          // C-Ring (Crepe ring, faint translucent)
          const f = (r - 0.52) / (0.64 - 0.52);
          opacity = 0.25 * f + micro;
          if (type === 'crypto') {
            rCol = 217; gCol = 119; bCol = 6;
          } else {
            rCol = 147; gCol = 51; bCol = 234;
          }
        } else if (r < 0.78) {
          // B-Ring (Main dense, bright golden dust band)
          opacity = 0.85 + micro;
          if (type === 'crypto') {
            rCol = 251; gCol = 191; bCol = 36;
          } else {
            rCol = 192; gCol = 132; bCol = 252;
          }
        } else if (r < 0.82) {
          // Cassini Division (Zero-opacity dust clearing)
          opacity = 0.03;
          rCol = 0; gCol = 0; bCol = 0;
        } else {
          // A-Ring (Outer ring with Encke gap)
          const isEncke = Math.abs(r - 0.89) < 0.008;
          opacity = isEncke ? 0.05 : 0.65 + micro;
          if (type === 'crypto') {
            rCol = 245; gCol = 158; bCol = 11;
          } else {
            rCol = 168; gCol = 85; bCol = 247;
          }
        }

        data[idx] = rCol;
        data[idx + 1] = gCol;
        data[idx + 2] = bCol;
        data[idx + 3] = Math.min(255, Math.max(0, Math.floor(opacity * 255)));
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates cratered rocky moon texture for sub-satellites
 */
export function createMoonTexture(): THREE.CanvasTexture {
  const width = 256;
  const height = 128;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const ny = (y / height) * 4.0;
    for (let x = 0; x < width; x++) {
      const nx = (x / width) * 8.0;
      const idx = (y * width + x) * 4;

      const n = fbm(nx, ny, 4);
      const tone = Math.min(230, Math.max(40, Math.floor((n + 0.5) * 160 + 50)));

      data[idx] = tone;
      data[idx + 1] = tone;
      data[idx + 2] = Math.min(255, tone + 10);
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Add impact craters
  ctx.fillStyle = 'rgba(20, 20, 30, 0.4)';
  ctx.strokeStyle = 'rgba(240, 240, 255, 0.5)';
  ctx.lineWidth = 1.2;
  const craters = [
    [40, 50, 14], [110, 80, 10], [180, 35, 18], [220, 90, 8], [90, 30, 7]
  ];
  for (const [cx, cy, r] of craters) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates a photorealistic Rayleigh scattering Fresnel atmospheric limb glow shader
 */
export function createAtmosphereMaterial(colorHex: number, opacity = 0.55): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      uniform vec3 color;
      uniform float opacity;
      void main() {
        // Fresnel grazing rim intensity calculation
        float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(color, clamp(intensity * opacity, 0.0, 1.0));
      }
    `,
    uniforms: {
      color: { value: new THREE.Color(colorHex) },
      opacity: { value: opacity },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  });
}

/**
 * Ancient celestial well stone texture with engraved runes and bump
 */
export function createWellStoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#1c1f2e');
  grad.addColorStop(0.5, '#282b3d');
  grad.addColorStop(1, '#151722');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Micro noise speckling
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const op = Math.random() * 0.15;
    ctx.fillStyle = `rgba(255, 255, 255, ${op})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Carved runic bands
  ctx.strokeStyle = '#4e5473';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(256, 256, 180, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(256, 256, 210, 0, Math.PI * 2);
  ctx.stroke();

  // Celestial ticks
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
    const r1 = 180;
    const r2 = a % (Math.PI / 4) === 0 ? 215 : 195;
    ctx.beginPath();
    ctx.moveTo(256 + Math.cos(a) * r1, 256 + Math.sin(a) * r1);
    ctx.lineTo(256 + Math.cos(a) * r2, 256 + Math.sin(a) * r2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Cosmic plasma wellspring water texture
 */
export function createCosmicPlasmaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const radial = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
  radial.addColorStop(0, '#fef08a');
  radial.addColorStop(0.2, '#06b6d4');
  radial.addColorStop(0.5, '#4f46e5');
  radial.addColorStop(0.85, '#1e1b4b');
  radial.addColorStop(1, '#020617');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 512, 512);

  ctx.lineWidth = 2;
  for (let arm = 0; arm < 4; arm++) {
    const baseAngle = (arm * Math.PI) / 2;
    ctx.beginPath();
    for (let r = 20; r < 240; r += 4) {
      const angle = baseAngle + r * 0.04;
      const x = 256 + Math.cos(angle) * r;
      const y = 256 + Math.sin(angle) * r;
      if (r === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = arm % 2 === 0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(234, 179, 8, 0.35)';
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Soft radial contact shadow texture to ground 3D objects
 */
export function createRadialContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  grad.addColorStop(0.3, 'rgba(0, 0, 0, 0.4)');
  grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.1)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Circular glowing star particle texture
 */
export function createStarParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(224, 242, 254, 0.85)');
  grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.3)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
