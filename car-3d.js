// Mini 3D car display using Three.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const initCar = (mount, colorHex = '#ffb300') => {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    24,
    mount.clientWidth / mount.clientHeight,
    0.1,
    50
  );
  camera.position.set(6, 4, 10);
  camera.lookAt(0, 0, 0);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(5, 8, 12);
  scene.add(dir);

  const carGroup = new THREE.Group();
  scene.add(carGroup);

  const bodyGeo = new THREE.BoxGeometry(4, 1.2, 2);
  const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.38, metalness: 0.15 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.8;
  carGroup.add(body);

  const cabinGeo = new THREE.BoxGeometry(2, 1, 1.6);
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.2 });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(0.2, 1.5, 0);
  carGroup.add(cabin);

  const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.6, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x263238, metalness: 0.3 });
  const wheelPositions = [
    [1.4, 0.35, 1],
    [-1.4, 0.35, 1],
    [1.4, 0.35, -1],
    [-1.4, 0.35, -1],
  ];
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, y, z);
    carGroup.add(wheel);
  });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = mount;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', resize);

  const animate = () => {
    carGroup.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();
};

document.querySelectorAll('.car-3d').forEach((node) => {
  const color = node.dataset.color || '#ffb300';
  initCar(node, color);
});
