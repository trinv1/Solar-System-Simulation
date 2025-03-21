import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";//Got from three.js docs
import { Sun } from './sun';
import { Earth } from "./earth";

//Setup Scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();//rendering scene
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let earth;

//Fetching planet data
async function getPlanetData() {
      const response = await fetch('/planetData.json');//Fetching json data
      const data = await response.json();
      console.log("Loaded JSON:", data);

      //Finding which object has name 'Earth' from planet data
      const earthData = data.find(p => p.planet == 'Earth');
      if (earthData) {
        console.log("Earth data from JSON:", earthData);
        earth = new Earth(scene, earthData);//Creating earth object in scene
      } 
    } 

//Creating OrbitControls to allow camera rotation, zoom, and damping
const controls = new OrbitControls( camera, renderer.domElement );

//Positioning camera
camera.position.set( 0, 20, 100 );

//Manually update camera
controls.update();

controls.enableDamping = true;//Weight is applied when you click to move planets
controls.autoRotate = true;//Camera rotates around solar system
controls.autoZoom = true;//Zoom in using scroller on mouse

//Creating Sun
const sun = new Sun(scene, 15, 0xFFFF00, 3); //Sun with radius 10 and yellow light  

//Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();

    sun.rotate();//Rotating sun
    if (earth) {
      earth.rotate();//Rotating earth
      earth.updatePosition(1); //Updating earths position 1 day per frame
    } 
  

}
animate();
getPlanetData();

