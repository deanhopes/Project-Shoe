import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'stats.js';
import { GUI } from 'dat.gui';
import testVertexShader from '/shaders/test/vertex.vs.glsl';
import testFragmentShader from '/shaders/test/fragment.fs.glsl';

/**
 * Stats
 */
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/**
 * Debug object
 */
const debugObject = {};

/**
 * Cursor
 */

const cursor = { x: 0, y: 0 };

window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height) - 0.5;
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// GUI
const gui = new GUI();

/**
 * Textures
 */
// How to load texture loaders and a displacement texture
// const textureLoader = new THREE.TextureLoader();
// const displacementTexture = textureLoader.load(
//   './textures/displacementMap.png'
// );

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  200
);
camera.position.set(0, 0, 100);
scene.add(camera);

gui.add(camera.position, 'x').min(-100).max(100).step(0.01).name('Camera X');
gui.add(camera.position, 'y').min(-100).max(100).step(0.01).name('Camera Y');
gui.add(camera.position, 'z').min(-100).max(100).step(0.01).name('Camera Z');

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.autoRotate = true;
gui.add(controls, 'autoRotate').name('Auto Rotate');

/**
 * Objects
 */

/**
 * Font Loader
 */

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  // Only use this if you have fps issues
  powerPreference: 'high-performance',
  antialias: true,
});
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

// Shaders
// // Tip 29
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Color of Shader

// Shader
const shaderGeometry = new THREE.SphereGeometry(15, 15, 15, 25, 25, 25);

const shaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  wireframe: true,
  linewidth: 5,
  transparent: true,
  uniforms: {
    // Time
    uTime: { value: 0 },

    // Color
    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.1 },
    uColorMultiplier: { value: 15 },

    // Textures
    // uTextures: { value: advertCubeTexture },

    // Frequency
    uFrequency: { value: new THREE.Vector2(10, 5) },
  },
});

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
scene.add(shaderMesh);

// Lights
const directionalLight = new THREE.DirectionalLight('white', 15.0);
directionalLight.position.set(0, 0, 250);
scene.add(directionalLight);

/**
 * Animation
 */

const clock = new THREE.Clock();

const tick = () => {
  stats.begin();

  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  stats.end();
};

tick();

/**
 * Tips
 */

// // Tip 4
// console.log(renderer.info);

// // Tip 6
// scene.remove(cube)
// cube.geometry.dispose()
// cube.material.dispose()

// // Tip 10
// directionalLight.shadow.camera.top = 3;
// directionalLight.shadow.camera.right = 6;
// directionalLight.shadow.camera.left = -6;
// directionalLight.shadow.camera.bottom = -3;
// directionalLight.shadow.camera.far = 10;
// directionalLight.shadow.mapSize.set(1024, 1024);

// Camera helper
// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(cameraHelper);

// // Tip 11
// cube.castShadow = true;
// cube.receiveShadow = false;

// torusKnot.castShadow = true;
// torusKnot.receiveShadow = false;

// sphere.castShadow = true;
// sphere.receiveShadow = false;

// floor.castShadow = false;
// floor.receiveShadow = true;

// // // Tip 12
// renderer.shadowMap.autoUpdate = false;
// renderer.shadowMap.needsUpdate = true;

// // Tip 18
// const geometries = [];

// for (let i = 0; i < 50; i++) {
//   const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

//   geometry.rotateX((Math.random() - 0.5) * Math.PI * 2);
//   geometry.rotateY((Math.random() - 0.5) * Math.PI * 2);

//   geometry.translate(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10
//   );
//   geometries.push(geometry);
// }

// const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
// const material = new THREE.MeshNormalMaterial();
// const mesh = new THREE.Mesh(mergedGeometry, material);

// scene.add(mesh);

// // Tip 19
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
// const material = new THREE.MeshNormalMaterial();
// for (let i = 0; i < 50; i++) {
//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.position.x = (Math.random() - 0.5) * 10;
//   mesh.position.y = (Math.random() - 0.5) * 10;
//   mesh.position.z = (Math.random() - 0.5) * 10;
//   mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
//   mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;

//   scene.add(mesh);
// }

// // Tip 20
// const cubeGeometry = new THREE.SphereGeometry(0.2, 32, 32);

// const pointSpheres = (elapsedTime) => {
//   for (let i = 0; i < 50; i++) {
//     const material = new THREE.PointsMaterial({
//       size: 0.005,
//       color: '#CCFFFF',
//       // sizeAttenuation: true,
//     });

//     const mesh = new THREE.Points(cubeGeometry, material);
//     mesh.position.x = (Math.random() - 0.5) * 10;
//     mesh.position.y = (Math.random() - 0.5) * 10;
//     mesh.position.z = (Math.random() - 0.5) * 10;
//     mesh.rotation.x = Math.sin(
//       elapsedTime + (Math.random() - 0.5) * Math.PI * 2
//     );
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;

//     scene.add(mesh);
//   }
// };

// // Tip 22 -- Create multiple box geometries with random rotations and positions with one draw call
// const cubeGeometry = new THREE.SphereGeometry(0.1, 32, 32);

// const cubeMaterial = new THREE.PointsMaterial({
//   size: 0.2,
//   sizeAttenuation: true,
// });

// const mesh = new THREE.InstancedMesh(cubeGeometry, cubeMaterial, 400);
// // Add this for better performance
// mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

// scene.add(mesh);

// for (let i = 0; i < 100; i++) {
//   // Create position
//   const position = new THREE.Vector3(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10
//   );

//   // Rotation
//   const quarternion = new THREE.Quaternion();
//   quarternion.setFromEuler(new THREE.Euler(0, 0, 0));
//   // Create matrxies
//   const matrix = new THREE.Matrix4();
//   matrix.makeRotationFromQuaternion(quarternion);
//   matrix.setPosition(position);
//   mesh.setMatrixAt(i, matrix);
// }
