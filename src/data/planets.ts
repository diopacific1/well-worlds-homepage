export interface PlanetData {
  id: string;
  name: string;
  en: string;
  radius: number; // km
  mass: string; // kg
  gravity: number; // m/s^2
  rotationPeriod: number; // hours
  orbitalPeriod: number; // days
  orbitRadius: number; // 10^6 km
  moons: number;
  
  color: string;
  size: number; // Visual size in scene
  distance: number; // Visual distance in scene
  speed: number; // Base orbital speed multiplier
  axialTilt: number; // degrees
  hasRing?: boolean;
}

export const PLANETS: PlanetData[] = [
  {
    id: "sun", name: "태양", en: "Sun",
    radius: 696340, mass: "1.989 × 10^30", gravity: 274,
    rotationPeriod: 609.12, orbitalPeriod: 0, orbitRadius: 0, moons: 0,
    color: "#fef08a", size: 2.5, distance: 0, speed: 0, axialTilt: 7.25
  },
  {
    id: "mercury", name: "수성", en: "Mercury",
    radius: 2439.7, mass: "3.301 × 10^23", gravity: 3.7,
    rotationPeriod: 1407.6, orbitalPeriod: 88.0, orbitRadius: 57.9, moons: 0,
    color: "#9ca3af", size: 0.15, distance: 4.0, speed: 4.15, axialTilt: 0.034
  },
  {
    id: "venus", name: "금성", en: "Venus",
    radius: 6051.8, mass: "4.867 × 10^24", gravity: 8.87,
    rotationPeriod: -5832.5, orbitalPeriod: 224.7, orbitRadius: 108.2, moons: 0,
    color: "#fca5a5", size: 0.35, distance: 6.0, speed: 1.62, axialTilt: 177.36
  },
  {
    id: "earth", name: "지구", en: "Earth",
    radius: 6371, mass: "5.972 × 10^24", gravity: 9.81,
    rotationPeriod: 23.93, orbitalPeriod: 365.2, orbitRadius: 149.6, moons: 1,
    color: "#3b82f6", size: 0.38, distance: 8.5, speed: 1.0, axialTilt: 23.44
  },
  {
    id: "mars", name: "화성", en: "Mars",
    radius: 3389.5, mass: "6.39 × 10^23", gravity: 3.71,
    rotationPeriod: 24.62, orbitalPeriod: 687.0, orbitRadius: 227.9, moons: 2,
    color: "#ef4444", size: 0.2, distance: 11.0, speed: 0.53, axialTilt: 25.19
  },
  {
    id: "jupiter", name: "목성", en: "Jupiter",
    radius: 69911, mass: "1.898 × 10^27", gravity: 24.79,
    rotationPeriod: 9.93, orbitalPeriod: 4331, orbitRadius: 778.6, moons: 95,
    color: "#f59e0b", size: 1.2, distance: 16.0, speed: 0.08, axialTilt: 3.13
  },
  {
    id: "saturn", name: "토성", en: "Saturn",
    radius: 58232, mass: "5.683 × 10^26", gravity: 10.44,
    rotationPeriod: 10.7, orbitalPeriod: 10747, orbitRadius: 1433.5, moons: 146,
    color: "#fcd34d", size: 0.95, distance: 22.0, speed: 0.034, axialTilt: 26.73,
    hasRing: true
  },
  {
    id: "uranus", name: "천왕성", en: "Uranus",
    radius: 25362, mass: "8.681 × 10^25", gravity: 8.69,
    rotationPeriod: -17.2, orbitalPeriod: 30589, orbitRadius: 2872.5, moons: 27,
    color: "#22d3ee", size: 0.6, distance: 28.0, speed: 0.012, axialTilt: 97.77,
    hasRing: true
  },
  {
    id: "neptune", name: "해왕성", en: "Neptune",
    radius: 24622, mass: "1.024 × 10^26", gravity: 11.15,
    rotationPeriod: 16.1, orbitalPeriod: 59800, orbitRadius: 4495.1, moons: 14,
    color: "#3b82f6", size: 0.58, distance: 34.0, speed: 0.006, axialTilt: 28.32
  }
];
