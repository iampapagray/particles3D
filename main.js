import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

import starImg from "./star.png";
import crossImg from "./cross.png";

// gui debug
const gui = new dat.GUI();

// loaders
const loader = new THREE.TextureLoader();

// Textures
const starTexture = loader.load(crossImg);

// Canvas
const canvas = document.querySelector("#canvas");

// Scene
const scene = new THREE.Scene();

// Geometries - Shapes
const torusShape = new THREE.TorusGeometry(0.7, 0.2, 20, 100);
const particleShape = new THREE.BufferGeometry();
// const torusShape = new THREE.TorusKnotGeometry(0.7, 0.2, 100, 20);

const pCount = 3000;
const pArray = new Float32Array(pCount * 3);
for (let i = 0; i < pCount * 3; i++) {
  pArray[i] = (Math.random() - 0.5) * (Math.random() * 5);
}

particleShape.setAttribute("position", new THREE.BufferAttribute(pArray, 3));

// Materials - Skins
const torusBasic = new THREE.MeshBasicMaterial({
  color: 0x2e7aed,
  wireframe: true,
});
const torusPoints = new THREE.PointsMaterial({ size: 0.005 });
const particlePoints = new THREE.PointsMaterial({
  size: 0.03,
  map: starTexture,
  transparent: true,
});

// Mesh - Objects
// const torus = new THREE.Mesh(torusShape, torusBasic);
const torus = new THREE.Points(torusShape, torusPoints);
const particles = new THREE.Points(particleShape, particlePoints);
scene.add(torus, particles);

// Lights
const pointLight1 = new THREE.PointLight(0xfffff, 0.5);
pointLight1.position.set(2, 3, 4);
scene.add(pointLight1);

// Helpers
const pointLight1Helper = new THREE.PointLightHelper(pointLight1, 0.3);
scene.add(pointLight1Helper);

// Gui setup

// Sizing
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Orbit Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 2);
scene.add(camera);

// Renderer
const ren = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, //makes the bg of the canvas transparent
});
ren.setSize(sizes.width, sizes.height);
ren.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// ren.setClearColor(new THREE.color(''), 1);

// Event Listeners
window.addEventListener("resize", () => {
  console.log("resized");
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  ren.setSize(sizes.width, sizes.height);
  ren.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("mousemove", animateParticles);
let mouseX,
  mouseY = 0;
function animateParticles(event) {
  mouseY = event.clientY;
  mouseX = event.clientX;
}

// Animation and Interactions

var content = CSSRulePlugin.getRule(".content:before");
var h1 = document.querySelector("h1");
var p = document.querySelector("p");
var tl = gsap.timeline();

tl.from(content, { delay: 0.5, duration: 4, cssRule: { scaleX: 0 } });
tl.to(
  h1,
  {
    duration: 2,
    clipPath: "polygon(0 0, 100% 0,100% 100%, 0 100%)",
    y: "30px",
  },
  "-=3"
);
tl.to(
  p,
  {
    duration: 4,
    clipPath: "polygon(0 0, 100% 0,100% 100%, 0 100%)",
    y: "30px",
  },
  "-=2"
);

const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // update objects
  torus.rotation.y = 0.5 * elapsedTime;
  particles.rotation.y = -0.001 * elapsedTime;

  if (mouseX > 0) {
    particles.rotation.x = -mouseY * (elapsedTime * 0.000008);
    particles.rotation.y = mouseX * (elapsedTime * 0.000008);
  }

  // Update Orbital Controls
  // controls.update()

  // Render
  ren.render(scene, camera);

  requestAnimationFrame(animate);
};
animate();
