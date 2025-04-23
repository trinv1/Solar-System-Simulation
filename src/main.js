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
import { Neptune } from "./neptune";
import { Pluto } from "./pluto";
import background from "./starBackground.jpg";

//Setup Scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();//rendering scene
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Adding scene background
const loader = new THREE.TextureLoader();
const texture = loader.load(background);
texture.colorSpace = THREE.SRGBColorSpace;
scene.background = texture;

let earth;
let mercury;
let venus;
let mars;
let jupiter;
let saturn;
let uranus;
let neptune;
let pluto;

//Fetching planet data
async function getPlanetData() {
      const response = await fetch('http://localhost:3000/planets');//Fetching json data
      const data = await response.json();
      console.log("Loaded JSON from mongodb:", data);

      //Finding which object has planet names from json data
      const earthData = data.find(p => p.planet == 'Earth');
      const mercuryData = data.find(p => p.planet == 'Mercury');
      const venusData = data.find(p => p.planet == 'Venus');
      const marsData = data.find(p => p.planet == 'Mars');
      const jupiterData = data.find(p => p.planet == 'Jupiter');
      const saturnData = data.find(p => p.planet == 'Saturn');
      const uranusData = data.find(p => p.planet == 'Uranus');
      const neptuneData = data.find(p => p.planet == 'Neptune');
      const plutoData = data.find(p => p.planet == 'Pluto');

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
        console.log("Uranus data from JSON:", uranusData);
        uranus = new Uranus(scene, uranusData);//Creating uranus object in scene
      } 

      if (neptuneData) {
        console.log("Neptune data from JSON:", neptuneData);
        neptune = new Neptune(scene, neptuneData);//Creating neptune object in scene
      } 

      if (plutoData) {
        console.log("Pluto data from JSON:", plutoData);
        pluto = new Pluto(scene, plutoData);//Creating pluto object in scene
      } 
    } 

//Creating OrbitControls to allow camera rotation, zoom, and damping
const controls = new OrbitControls( camera, renderer.domElement );

//Positioning camera
camera.position.set(0, 600, 1000);

//Manually update camera
controls.update();

controls.enableDamping = true;//Weight is applied when you click to move planets
//controls.autoRotate = true;//Camera rotates around solar system
controls.autoZoom = true;//Zoom in using scroller on mouse

//Creating Sun
const sun = new Sun(scene, 40, 0xFFFF00, 3); //Sun with radius 40 and yellow light  

//Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();

    sun.rotate();//Rotating sun
    if (earth) {
      earth.rotate(0.5);//Rotating earth half a day per frame
      earth.updatePosition(1); //Updating earths position 1 day per frame
    } 

    if(mercury){
      mercury.rotate(.5);//Rotating mercury half a day per frame
      mercury.updatePosition(1); //Updating mercurys position 1 day per frame
    }

    if(venus){
      venus.rotate(.5);//Rotating venus half a day per frame
      venus.updatePosition(1); //Updating venus's  position 1 day per frame
    }

    if(mars){
      mars.rotate(.5);//Rotating mars half a day per frame
      mars.updatePosition(1); //Updating mars's  position 1 day per frame
    }

    if(jupiter){
      jupiter.rotate(.5);//Rotating jupiters half a day per frame
      jupiter.updatePosition(1); //Updating jupiters's position 1 day per frame
    }

    if(saturn){
      saturn.rotate(.5);//Rotating saturns half a day per frame
      saturn.updatePosition(1); //Updating saturn's position 1 day per frame
    }

    if(uranus){
      uranus.rotate(.5);//Rotating uranus' half a day per frame
      uranus.updatePosition(1); //Updating uranus' position 1 day per frame
    }

    if(neptune){
      neptune.rotate(.5);//Rotating neptune's half a day per frame
      neptune.updatePosition(1); //Updating neptune's position 1 day per frame
    }

    if(pluto){
      pluto.rotate(.5);//Rotating pluto's half a day per frame
      pluto.updatePosition(1); //Updating pluto's position 1 day per frame
    }
}
animate();
getPlanetData();

