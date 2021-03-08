import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'stats.js';
import { GUI } from 'dat.gui';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

// Link to the host site: https://naughty-dubinsky-b1df58.netlify.app/

/**
 * Stats
 */
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/**
 * Debug object
 */
const debugObject = {
  radius: 0.3,
};

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
const textureLoader = new THREE.TextureLoader();
const displacementTexture = textureLoader.load(
  './textures/displacementMap.png'
);

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
  100
);
camera.position.set(7.87, 5.01, -7.44);
camera.rotation.x = 5;
scene.add(camera);

gui.add(camera.position, 'x').min(-10).max(10).step(0.01).name('Camera X');
gui.add(camera.position, 'y').min(-10).max(10).step(0.01).name('Camera Y');
gui.add(camera.position, 'z').min(-10).max(10).step(0.01).name('Camera Z');

// Controls
const controls = new OrbitControls(camera, canvas);
// Alternative controls, maybe good for design
// controls.mouseButtons = {
//   LEFT: THREE.MOUSE.RIGHT,
//   MIDDLE: THREE.MOUSE.MIDDLE,
//   RIGHT: THREE.MOUSE.LEFT,
// };
controls.enableDamping = true;
controls.autoRotate = true;
gui.add(controls, 'autoRotate').name('Auto Rotate');

/**
 * Test Mesh
 */

// Sphere Wireframe
const geometry = new THREE.SphereGeometry(5, 32, 32);
const wireframe = new THREE.WireframeGeometry(geometry);
const line = new THREE.LineSegments(wireframe);

line.material.depthTest = false;
// console.log(line.material);
line.material.color.r = 1;
line.material.color.g = 1;
line.material.color.b = 1;
line.material.opacity = 0.5;
line.material.transparent = false;

// Inner Sphere
const material = new THREE.MeshBasicMaterial();
material.flatShading = true;
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(debugObject.radius, 32, 32),
  material
);
// Add the wireframe and sphere
scene.add(line, sphere);

// Add a d3bug object that
gui.add(debugObject, 'radius').min(0).max(16);

/**
 * Font Loader
 */
const fontLoader = new THREE.FontLoader();
for (let i = 0; i < 50; i++) {
  fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new THREE.TextGeometry('Ratatouille', {
      font: font,
      size: Math.random() * 0.5,
      height: Math.random(),
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 2,
      // castShadow: true,
    });
    const textMaterial = new THREE.MeshPhysicalMaterial();
    const text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.y = (Math.random() - 0.5) * 10;
    text.position.x = (Math.random() - 0.5) * 10;
    text.position.z = (Math.random() - 0.5) * 10;
    // text.rotation.x = 0;
    // text.rotation.y = 0;
    // text.rotation.z = 0;
    // font.castShadow = true;
    text.lookAt(sphere.position);
    scene.add(text);
  });
}

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

/**
 * Lights
 */

const pointLight3 = new THREE.PointLight('red', 1);
const pointLight = new THREE.PointLight('white', 1);
const pointLight2 = new THREE.PointLight('blue', 1);
scene.add(pointLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

// const rectLight = new THREE.RectAreaLight('red', 1, -5, 5);
// const rectLight1 = new THREE.RectAreaLight('white', 200, 5, 5);
// const rectLight2 = new THREE.RectAreaLight('white', 200, -5, -5);
// rectLight1.width = 1;
// rectLight1.height = 1;
// rectLight2.width = -1;
// rectLight2.height = -1;
// // console.log(rectLight1);
// // const rectLight2 = new THREE.RectAreaLight('blue', 1, 5, 5);
// scene.add(rectLight1, rectLight2);
// const rectLightHelper1 = new RectAreaLightHelper(rectLight1);
// const rectLightHelper2 = new RectAreaLightHelper(rectLight2);
// scene.add(rectLightHelper1, rectLightHelper2);

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
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

// for(let i = 0; i < 50; i++)
// {
//     const material = new THREE.MeshNormalMaterial()

//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// Tip 22 -- Create multiple box geometries with random rotations and positions with one draw call
const cubeGeometry = new THREE.SphereGeometry(0.1, 32, 32);

const cubeMaterial = new THREE.MeshDepthMaterial();

const mesh = new THREE.InstancedMesh(cubeGeometry, cubeMaterial, 400);
// Add this for better performance
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

scene.add(mesh);

for (let i = 0; i < 100; i++) {
  // Create position
  const position = new THREE.Vector3(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );

  // Rotation
  const quarternion = new THREE.Quaternion();
  quarternion.setFromEuler(new THREE.Euler(0, 0, 0));
  // Create matrxies
  const matrix = new THREE.Matrix4();
  matrix.makeRotationFromQuaternion(quarternion);
  matrix.setPosition(position);
  mesh.setMatrixAt(i, matrix);
}

// // Tip 29
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// // Tip 31, 32, 34 and 35
const shaderGeometry = new THREE.BoxGeometry(15, 15, 15, 25, 25, 25);

const shaderMaterial = new THREE.ShaderMaterial({
  // Creates better performance
  precision: 'lowp',
  wireframe: true,
  uniforms: {
    uDisplacementTexture: { value: displacementTexture },
  },
  defines: {
    DISPLACEMENT_STRENGTH: 4.5,
  },
  vertexShader: `
        uniform sampler2D uDisplacementTexture;

        varying vec3 vColor;

        void main()
        {
          // Position
          vec4 modelPosition = modelMatrix * vec4(position, 0.5);
          float elevation = texture2D(uDisplacementTexture, uv).r;
          modelPosition.y += max(elevation, 0.0) * DISPLACEMENT_STRENGTH;
          gl_Position = projectionMatrix * viewMatrix * modelPosition;

          // Color
          float colorElevation = max(elevation, 0.5);
          vec3 color = mix(vec3(1.0, 1.0, 1.0), vec3(0.05, 0.05, 0.05), colorElevation);

          // Varying
          vColor = color;
        }
    `,
  fragmentShader: `
        varying vec3 vColor;

        void main()
        {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `,
});

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
// shaderMesh.rotation.x = Math.sin(Math.PI) * 10;
// shaderMesh.rotation.y = Math.sin(Math.PI) * 10;
// shaderMesh.rotation.z = Math.sin(Math.PI) * 10;
scene.add(shaderMesh);

/**
 * Animation
 */

const clock = new THREE.Clock();

const tick = () => {
  stats.begin();

  const elapsedTime = clock.getElapsedTime();

  // Update Camera
  // camera.position.x = Math.sin(elapsedTime) * 2;
  // camera.position.y = -Math.sin(elapsedTime * 2);
  // camera.position.z = elapsedTime * 2;

  // Debug Object check

  // sphere.parameters.radius = debugObject.radius;

  // sphere.geometry.position debugObject.radius

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  stats.end();
};

tick();
