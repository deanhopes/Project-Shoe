import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'stats.js';
import { GUI } from 'dat.gui';
import testVertexShader from '/shaders/test/vertex.vs.glsl';
import testFragmentShader from '/shaders/test/fragment.fs.glsl';
import { BufferGeometryUtils } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let geometry = [];

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

// GLTF Loader
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/shoe/glTF/MaterialsVariantsShoe.gltf', (gltf) => {
  gltf.scene.scale.set(350, 350, 350);
  gltf.scene.position.set(-5, -12, 100);
  gltf.scene.rotation.set(0, 0, 125);
  scene.add(gltf.scene);
});
console.log(scene);

// Texture loader

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/textures/Frame 20.png');

/**
 * Objects
 */

const sphereGeometry = new THREE.SphereGeometry(0.2, 8, 8);

const sphereMaterial = new THREE.MeshNormalMaterial();

const sphereMesh = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, 900);
// Add this for better performance
sphereMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(sphereMesh);

for (let i = 0; i < 900; i++) {
  // Create position
  const position = new THREE.Vector3(
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200,
    Math.random() * 200
  );

  // Rotation
  const quarternion = new THREE.Quaternion();
  quarternion.setFromEuler(
    new THREE.Euler(
      (Math.random() - 0.5) * Math.PI * 2,
      (Math.random() - 0.5) * Math.PI * 2,
      (Math.random() - 0.5) * Math.PI * 2
    )
  );
  // Create matrxies
  const matrix = new THREE.Matrix4();
  matrix.makeRotationFromQuaternion(quarternion);
  matrix.setPosition(position);
  sphereMesh.setMatrixAt(i, matrix);
}

const planeGeo = new THREE.PlaneGeometry(200, 250);
const planeMat = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: true,
  opacity: 1,
});

const plane = new THREE.Mesh(planeGeo, planeMat);
scene.add(plane);

const planeGeo1 = new THREE.PlaneGeometry(200, 250);
const planeMat1 = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0.11,
  depthWrite: true,
  depthTest: true,
  alphaTest: 0.9,
  flatShading: false,
  wireframe: false,
});
const plane1 = new THREE.Mesh(planeGeo1, planeMat1);
scene.add(plane1);

// Circle
const circleGeo = new THREE.CircleGeometry(5, 32);
const circleMat = new THREE.MeshNormalMaterial();
const circle = new THREE.Mesh(circleGeo, circleMat);
circle.position.set(95, 120, 1);
circle.scale.set(4, 4, 5);
// scene.add(circle);

// Sphere
const createIndexedPlaneGeometry = (width, length) => {
  const geom = new THREE.BufferGeometry();

  const vertices = [];
  const indices = [];
  const uvs = [];
  const width1 = width + 1;
  const length1 = length + 1;
  for (let i = 0; i < width1; i++) {
    for (let j = 0; j < length1; j++) {
      vertices.push(i / width, 0, j / length);
      uvs.push(i / width, j / length);
    }
  }

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < length; j++) {
      let a = i * length1 + j;
      let b = i * length1 + j + 1;
      let c = (i + 1) * length1 + j;
      let d = (i + 1) * length1 + j + 1;

      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const positions = new Float32Array(vertices);
  const index = new Uint32Array(indices);
  const uv = new Float32Array(uvs);

  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geom.setIndex(new THREE.BufferAttribute(index, 1));

  return geom;
};

const main = (geom, radius) => {
  const pos = geom.attributes.position.array;
  const uvs = geom.attributes.uv.array;

  const pi = Math.PI;

  for (let i = 0, u = 0, v = 1; i < pos.length; i += 3, u += 2, v += 2) {
    pos[i] = radius * Math.sin(uvs[u] * pi) * Math.cos(uvs[v] * 2 * pi);
    pos[i + 1] = radius * Math.sin(uvs[u] * pi) * Math.sin(uvs[v] * 2 * pi);
    pos[i + 2] = radius * Math.cos(uvs[u] * pi);
  }

  geom.setAttribute('base_position', geom.attributes.position.clone());
  geom.computeVertexNormals();
};

/**
 * Fog
 */

const debounce = (callback, duration) => {
  var timer;
  return function (event) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback(event);
    }, duration);
  };
};

const loadTexs = (imgs, callback) => {
  const texLoader = new THREE.TextureLoader();
  const length = Object.keys(imgs).length;
  const loadedTexs = {};
  let count = 0;

  texLoader.crossOrigin = 'anonymous';

  for (var key in imgs) {
    const k = key;
    if (imgs.hasOwnProperty(k)) {
      texLoader.load(imgs[k], (tex) => {
        tex.repeat = THREE.RepeatWrapping;
        loadedTexs[k] = tex;
        count++;
        if (count >= length) callback(loadedTexs);
      });
    }
  }
};

class Fog {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0,
      },
      tex: {
        type: 't',
        value: null,
      },
    };
    this.num = 200;
    this.obj = null;
  }
  createObj(tex) {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneBufferGeometry(1100, 1100, 20, 20);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.addAttribute('position', baseGeometry.attributes.position);
    geometry.addAttribute('normal', baseGeometry.attributes.normal);
    geometry.addAttribute('uv', baseGeometry.attributes.uv);
    geometry.setIndex(baseGeometry.index);

    // Define attributes of the instancing geometry
    const instancePositions = new THREE.InstancedBufferAttribute(
      new Float32Array(this.num * 3),
      3,
      1
    );
    const delays = new THREE.InstancedBufferAttribute(
      new Float32Array(this.num),
      1,
      1
    );
    const rotates = new THREE.InstancedBufferAttribute(
      new Float32Array(this.num),
      1,
      1
    );
    for (var i = 0, ul = this.num; i < ul; i++) {
      instancePositions.setXYZ(
        i,
        (Math.random() * 2 - 1) * 850,
        0,
        (Math.random() * 2 - 1) * 300
      );
      delays.setXYZ(i, Math.random());
      rotates.setXYZ(i, Math.random() * 2 + 1);
    }
    geometry.addAttribute('instancePosition', instancePositions);
    geometry.addAttribute('delay', delays);
    geometry.addAttribute('rotate', rotates);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        attribute vec3 position;
        attribute vec2 uv;
        attribute vec3 instancePosition;
        attribute float delay;
        attribute float rotate;

        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform float time;

        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vColor;
        varying float vBlink;

        const float duration = 200.0;

        mat4 calcRotateMat4Z(float radian) {
          return mat4(
            cos(radian), -sin(radian), 0.0, 0.0,
            sin(radian), cos(radian), 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
          );
        }
        vec3 convertHsvToRgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        void main(void) {
          float now = mod(time + delay * duration, duration) / duration;

          mat4 rotateMat = calcRotateMat4Z(radians(rotate * 360.0) + time * 0.1);
          vec3 rotatePosition = (rotateMat * vec4(position, 1.0)).xyz;

          vec3 moveRise = vec3(
            (now * 2.0 - 1.0) * (2500.0 - (delay * 2.0 - 1.0) * 2000.0),
            (now * 2.0 - 1.0) * 2000.0,
            sin(radians(time * 50.0 + delay + length(position))) * 30.0
            );
          vec3 updatePosition = instancePosition + moveRise + rotatePosition;

          vec3 hsv = vec3(time * 0.1 + delay * 0.2 + length(instancePosition) * 100.0, 0.5 , 0.8);
          vec3 rgb = convertHsvToRgb(hsv);
          float blink = (sin(radians(now * 360.0 * 20.0)) + 1.0) * 0.88;

          vec4 mvPosition = modelViewMatrix * vec4(updatePosition, 1.0);

          vPosition = position;
          vUv = uv;
          vColor = rgb;
          vBlink = blink;

          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform sampler2D tex;

        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vColor;
        varying float vBlink;

        void main() {
          vec2 p = vUv * 2.0 - 1.0;

          vec4 texColor = texture2D(tex, vUv);
          vec3 color = (texColor.rgb - vBlink * length(p) * 0.8) * vColor;
          float opacity = texColor.a * 0.36;

          gl_FragColor = vec4(color, opacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.uniforms.tex.value = tex;

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}

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
  1000
);
camera.position.set(0, 0, 225);
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
renderer.setClearColor(0x1e1f21, 1.0);
renderer.autoClearColor = true;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Rotate
 */
function rotateObject(object, degreeX = 0, degreeY = 0, degreeZ = 0) {
  degreeX = (degreeX * Math.PI) / 180;
  degreeY = (degreeY * Math.PI) / 180;
  degreeZ = (degreeZ * Math.PI) / 180;

  object.rotateX(degreeX);
  object.rotateY(degreeY);
  object.rotateZ(degreeZ);
}

const mesh = new THREE.Object3D();
mesh.scale.set(120, 120, 120);
rotateObject(mesh, -180, -90, 90);

geometry = createIndexedPlaneGeometry(100, 150);
main(geometry, 0.6);

let material = new THREE.MeshNormalMaterial({
  // flatShading: true,
  // morphNormals: true,
  // morphTargets: true,
  wireframe: true,
});

mesh.add(new THREE.Mesh(geometry, material));

// Lights
const pinkDirectionalLight = new THREE.DirectionalLight('pink', 5);
pinkDirectionalLight.position.set(200, -200, -200);

const greenDirectionalLight = new THREE.DirectionalLight('blue', 5);
greenDirectionalLight.position.set(-200, -200, -200);

const pointLight = new THREE.PointLight('white', 10);
pointLight.position.set(0, 0, 50);
const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);
scene.add(pinkDirectionalLight, greenDirectionalLight, pointLight);

const ambientLight = new THREE.AmbientLight('white', 0.9);
scene.add(ambientLight);

/**
 * Geometries
 */

// Circle Mesh Normal Object

const modifyGeometry = (elapsedTime) => {
  const pos = geometry.attributes.position.array;
  const base_pos = geometry.attributes.base_position.array;

  const uvs = geometry.attributes.uv.array;

  for (let i = 0, j = 0; i < pos.length; i += 6, j += 2) {
    let scale = 0.3 * Math.sin(uvs[j] * 9 + elapsedTime * 0.3);
    scale += 0.3 * Math.sin(uvs[j + 1] * 9 + elapsedTime * 0.3);

    for (let k = 2; k < 3; k += 2) {
      scale += 0.3 * k * Math.cos(uvs[j] * 27 * k + (k + elapsedTime * 0.3));
      scale +=
        0.3 * k * Math.cos(uvs[j + 1] * 27 * k + (k + elapsedTime * 0.3));
    }

    scale *= scale * 0.3 * Math.sin(elapsedTime * 0.3 + uvs[j] * 3);

    pos[i] = base_pos[i] * (1 + scale * 0.1);
    pos[i + 1] = base_pos[i + 1] * (1 + scale * 0.1);
    pos[i + 2] = base_pos[i + 2] * (1 + scale * 0.1);
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
};

/**
 * Animation
 */

const clock = new THREE.Clock();

const tick = () => {
  stats.begin();

  const elapsedTime = clock.getElapsedTime();

  sphereMesh.rotation.set(Math.sin(elapsedTime) * 0.03, 0, 0);
  modifyGeometry(Math.sin(elapsedTime) * 9);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  stats.end();
};

tick();
scene.add(mesh);
