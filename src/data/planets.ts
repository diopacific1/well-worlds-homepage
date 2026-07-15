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
    id: "portfolio", name: "나의 세계", en: "My World",
    radius: 6371, mass: "Personal Archive", gravity: 9.81,
    rotationPeriod: 24, orbitalPeriod: 365, orbitRadius: 149.6, moons: 1,
    color: "#3b82f6", size: 0.8, distance: 8, speed: 0.8, axialTilt: 23.4
  },
  {
    id: "crypto", name: "크립토 월드", en: "Crypto Terminal",
    radius: 3389, mass: "Financial Data", gravity: 3.71,
    rotationPeriod: 24.6, orbitalPeriod: 687, orbitRadius: 227.9, moons: 2,
    color: "#f59e0b", size: 0.6, distance: 13, speed: 0.6, axialTilt: 25.2,
    hasRing: true
  },
  {
    id: "garden", name: "디지털 정원", en: "Digital Garden",
    radius: 6051, mass: "Botanical Records", gravity: 8.87,
    rotationPeriod: 5832, orbitalPeriod: 224, orbitRadius: 108.2, moons: 0,
    color: "#10b981", size: 0.7, distance: 18, speed: 0.5, axialTilt: 177.3
  },
  {
    id: "guestbook", name: "방명록", en: "Guestbook",
    radius: 2439, mass: "Visitor Logs", gravity: 3.7,
    rotationPeriod: 1407, orbitalPeriod: 88, orbitRadius: 57.9, moons: 0,
    color: "#a855f7", size: 0.5, distance: 23, speed: 0.4, axialTilt: 0.03
  }
];

