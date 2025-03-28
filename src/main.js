import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";//Got from three.js docs
import { Sun } from './sun';
import { Earth } from "./earth";
import { Mercury } from "./mercury";
import { Venus } from "./venus";
import { Mars } from "./mars";
import { Jupiter } from "./jupiter";
import { Saturn } from "./saturn";
import { Uranus } from "./uranus";

//Setup Scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();//rendering scene
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let earth;
let mercury;
let venus;
let mars;
let jupiter;
let saturn;
let uranus

//Fetching planet data
async function getPlanetData() {
      const response = await fetch('/planetData.json');//Fetching json data
      const data = await response.json();
      console.log("Loaded JSON:", data);

      //Finding which object has name planet names from json data
      const earthData = data.find(p => p.planet == 'Earth');
      const mercuryData = data.find(p => p.planet == 'Mercury');
      const venusData = data.find(p => p.planet == 'Venus');
      const marsData = data.find(p => p.planet == 'Mars');
      const jupiterData = data.find(p => p.planet == 'Jupiter');
      const saturnData = data.find(p => p.planet == 'Saturn');
      const uranusData = data.find(p => p.planet == 'Uranus');

      if (earthData) {
        console.log("Earth data from JSON:", earthData);
        earth = new Earth(scene, earthData);//Creating earth object in scene
      } 

      if (mercuryData) {
        console.log("Mercury data from JSON:", mercuryData);
        mercury = new Mercury(scene, mercuryData);//Creating earth object in scene
      } 

      if (venusData) {
        console.log("Venus data from JSON:", venusData);
        venus = new Venus(scene, venusData);//Creating venus object in scene
      } 

      if (marsData) {
        console.log("Mars data from JSON:", marsData);
        mars = new Mars(scene, marsData);//Creating mars object in scene
      } 

      if (jupiterData) {
        console.log("Jupiter data from JSON:", jupiterData);
        jupiter = new Jupiter(scene, jupiterData);//Creating jupiter object in scene
      } 

      if (saturnData) {
        console.log("Saturn data from JSON:", saturnData);
        saturn = new Saturn(scene, saturnData);//Creating saturn object in scene
      } 

      if (uranusData) {
        console.log("Saturn data from JSON:", uranusData);
        uranus = new Uranus(scene, uranusData);//Creating uranus object in scene
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
const sun = new Sun(scene, 40, 0xFFFF00, 3); //Sun with radius 15 and yellow light  

//Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();

    sun.rotate();//Rotating sun
    if (earth) {
      earth.rotate(0.5);//Rotating earth half a day per frame
      earth.updatePosition(0.5); //Updating earths position half a day per frame
    } 

    if(mercury){
      mercury.rotate(.5);//Rotating mercury half a day per frame
      mercury.updatePosition(.5); //Updating mercurys position half a day per frame
    }

    if(venus){
      venus.rotate(.5);//Rotating venus half a day per frame
      venus.updatePosition(.5); //Updating venus's  position half a day per frame
    }

    if(mars){
      mars.rotate(.5);//Rotating mars half a day per frame
      mars.updatePosition(.5); //Updating mars's  position half a day per frame
    }

    if(jupiter){
      jupiter.rotate(.5);//Rotating jupiters half a day per frame
      jupiter.updatePosition(.5); //Updating jupiters's position half a day per frame
    }

    if(saturn){
      saturn.rotate(.5);//Rotating saturns half a day per frame
      saturn.updatePosition(.5); //Updating saturn's position half a day per frame
    }

    if(uranus){
      uranus.rotate(.5);//Rotating uranus' half a day per frame
      uranus.updatePosition(.5); //Updating uranus' position half a day per frame
    }
}
animate();
getPlanetData();

