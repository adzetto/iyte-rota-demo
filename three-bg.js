// Lightweight Three.js background with subtle rotation
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const mount = document.getElementById('bg3d');
if (!mount) return;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
renderer.setSize(window.innerWidth, window.innerHeight);
mount.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0f1419, 6, 18);

const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 10);

const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(4, 6, 10);
scene.add(light);

const amb = new THREE.AmbientLight(0x668080, 0.6);
scene.add(amb);

const geo = new THREE.IcosahedronGeometry(3, 1);
const mat = new THREE.MeshStandardMaterial({
  color: 0x263238,
  emissive: 0x0f1419,
  roughness: 0.4,
  metalness: 0.15,
  wireframe: false,
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

const glowMat = new THREE.PointsMaterial({
  color: 0xffb300,
  size: 0.08,
  transparent: true,
  opacity: 0.8,
});
const glow = new THREE.Points(new THREE.IcosahedronGeometry(3.4, 2), glowMat);
scene.add(glow);

const resize = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
};
window.addEventListener('resize', resize);

const animate = () => {
  mesh.rotation.x += 0.0024;
  mesh.rotation.y -= 0.0018;
  glow.rotation.y += 0.0012;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();
