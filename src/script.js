import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'stats.js';
import { GUI } from 'dat.gui';
import testVertexShader from '/shaders/test/vertex.vs.glsl';
import testFragmentShader from '/shaders/test/fragment.fs.glsl';
import CCapture from '../src/ccapture/CCapture';

// Link to the host site: https://naughty-dubinsky-b1df58.netlify.app/

// CCapture
const recorder = new CCapture({
  format: 'png',
});

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

// const whiteOfEyeGeo = new THREE.SphereGeometry(26, 64, 64);
// const whiteOfEyeMat = new THREE.MeshStandardMaterial({
//   color: 'white',
//   emissive: 'grey',
//   roughness: 0.3,
//   metalness: 0.5,
//   flatShading: true,
// });
// const whiteOfEye = new THREE.Mesh(whiteOfEyeGeo, whiteOfEyeMat);
// scene.add(whiteOfEye);

// debugObject.torusRadius = 15.5;

// const torusGeo = new THREE.TorusGeometry(5, 4, 4, 45, 6.3);
// const torusMat = new THREE.MeshStandardMaterial({
//   color: 'white',
//   emissive: '#0000ff',
//   roughness: 0.6,
//   metalness: 0.7,
//   flatShading: true,
// });
// const torus = new THREE.Mesh(torusGeo, torusMat);
// torus.position.z = 40;
// scene.add(torus);
// gui
//   .add(debugObject, 'torusRadius')
//   .min(0)
//   .max(50)
//   .step(0.01)
//   .name('Torus Radius');

// const pupilGeo = new THREE.SphereGeometry(5, 64, 64);
// const pupilMat = new THREE.MeshBasicMaterial({ color: '#000' });
// const pupil = new THREE.Mesh(pupilGeo, pupilMat);
// pupil.position.z = 39;
// scene.add(pupil);
// camera.lookAt(pupil.position);

// const beamGeo = new THREE.ConeGeometry(4.4, 15, 15, 1, false, 0, 6.3);
// const beamMat = new THREE.MeshBasicMaterial({
//   color: 0xffff00,
//   transparent: true,
//   opacity: 0.5,
// });
// const beam = new THREE.Mesh(beamGeo, beamMat);
// beam.position.z = 33;
// beam.rotation.set(190, 0, 0);
// scene.add(beam);

/**
 * Font Loader
 */

const textArray = [];

// Function for a name generator
const fontLoader = new THREE.FontLoader();
for (let i = 0; i < 10; i++) {
  fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new THREE.TextGeometry('focus', {
      font: font,
      size: Math.random() * 10,
      height: Math.random() * 10,
      curveSegments: 128,
      bevelEnabled: true,
      bevelThickness: 0.5,
      bevelSize: 0.2,
      bevelOffset: 0.1,
      bevelSegments: 10,
      // castShadow: true,
    });
    const textMaterial = new THREE.MeshStandardMaterial({
      color: 'black',
      emissive: '#000000',
      roughness: 0.3,
      metalness: 0.5,
      flatShading: true,
    });
    // textMaterial.flatShading = false;
    // textMaterial.displacementBias = 10.5;
    const text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.y = (Math.random() - 0.5) * 75;
    text.position.x = (Math.random() - 0.5) * 75;
    text.position.z = (Math.random() - 0.5) * 75;
    textArray.push(text);
    scene.add(text);
  });
}

// for (let i = 0; i < 15; i++) {
//   fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
//     const textGeometry = new THREE.TextGeometry('jour neuf', {
//       font: font,
//       size: Math.random() * 5,
//       height: Math.random() * 15,
//       curveSegments: 24,
//       bevelEnabled: true,
//       bevelThickness: 0.5,
//       bevelSize: 0.02,
//       bevelOffset: 0,
//       bevelSegments: 2,
//       // castShadow: true,
//     });
//     const textMaterial = new THREE.MeshStandardMaterial({ color: 'blue' });
//     textMaterial.flatShading = false;
//     // textMaterial.displacementBias = 10.5;
//     const text = new THREE.Mesh(textGeometry, textMaterial);
//     text.position.y = (Math.random() - 0.5) * 100;
//     text.position.x = (Math.random() - 0.5) * 100;
//     text.position.z = (Math.random() - 0.5) * 100;
//     // text.lookAt(camera.position);
//     scene.add(text);
//   });
// }

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

// // Color of Shader
// debugObject.depthColor = '#25258c';
// debugObject.surfaceColor = '#acfff5';

// // Shader
// const shaderGeometry = new THREE.BoxGeometry(15, 15, 15, 25, 25, 25);

// const shaderMaterial = new THREE.RawShaderMaterial({
//   vertexShader: testVertexShader,
//   fragmentShader: testFragmentShader,
//   wireframe: true,
//   uniforms: {
//     // Time
//     uTime: { value: 0 },

//     // Color
//     uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
//     uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
//     uColorOffset: { value: 0.1 },
//     uColorMultiplier: { value: 5 },

//     // Textures
//     // uTextures: { value: advertCubeTexture },

//     // Frequency
//     uFrequency: { value: new THREE.Vector2(10, 5) },
//   },
// });

// const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
// // shaderMesh.rotation.x = Math.sin(Math.PI) * 5;
// // shaderMesh.rotation.y = Math.sin(Math.PI) * 5;
// // shaderMesh.rotation.z = Math.sin(Math.PI) * 5;
// scene.add(shaderMesh);

// Randomises the points

// const count = shaderGeometry.attributes.position.count;
// const randoms = new Float32Array(count);
// for (let i = 0; i < count; i++) {
//   randoms[i] = Math.random() * 1;
// }
// shaderGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

/**
 * Lights
 */

// const pointLight = new THREE.PointLight('red', 1.0);
// const pointLight1 = new THREE.PointLight('blue', 1.0);
// const pointLight2 = new THREE.PointLight('green', 1.0);
// scene.add(pointLight, pointLight1, pointLight2);
const directionalLight = new THREE.DirectionalLight('white', 5.0);
directionalLight.position.set(50, 50, 250);
scene.add(directionalLight);

// Setup CCapture Buttons
function setupButtons() {
  const $start = document.getElementById('start');
  const $stop = document.getElementById('stop');
  $start.addEventListener(
    'click',
    (e) => {
      e.preventDefault();
      recorder.start();
      $start.style.display = 'none';
      $stop.style.display = 'block';
    },
    false
  );

  $stop.addEventListener(
    'click',
    (e) => {
      e.preventDefault();
      recorder.stop();
      $stop.style.display = 'none';
      recorder.save();
    },
    false
  );
}
setupButtons();

/**
 * Animation
 */

const clock = new THREE.Clock();

const tick = () => {
  stats.begin();

  const elapsedTime = clock.getElapsedTime();

  textArray.forEach((text, i) => {
    // console.log(textArray[i]);
    textArray[i].rotation.x =
      (Math.random() - 0.5) * 1.0 * 500.0 * Math.sin(elapsedTime) * 0.1;
    // console.log(i);
    // text.rotation.y = elapsedTime;
    // text.rotation.z = elapsedTime;
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  recorder.capture(renderer.domElement);

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
