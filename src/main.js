import * as THREE from "three";
//import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { Sun } from './sun';

//Setup Scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();//rendering scene
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Positioning the camera
camera.position.z = 50;

//Creating Sun
const sun = new Sun(scene, 10, 0xFFFF00, 2); //Sun with radius 10 and yellow light  

//Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    sun.rotate();
}
animate();

