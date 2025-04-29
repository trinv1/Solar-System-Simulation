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
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
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
        console.log("Earth data:", earthData);
        earth = new Earth(scene, earthData);//Creating earth object in scene
      } 

      if (mercuryData) {
        console.log("Mercury data:", mercuryData);
        mercury = new Mercury(scene, mercuryData);//Creating earth object in scene
      } 

      if (venusData) {
        console.log("Venus data:", venusData);
        venus = new Venus(scene, venusData);//Creating venus object in scene
      } 

      if (marsData) {
        console.log("Mars data:", marsData);
        mars = new Mars(scene, marsData);//Creating mars object in scene
      } 

      if (jupiterData) {
        console.log("Jupiter data:", jupiterData);
        jupiter = new Jupiter(scene, jupiterData);//Creating jupiter object in scene
      } 

      if (saturnData) {
        console.log("Saturn data:", saturnData);
        saturn = new Saturn(scene, saturnData);//Creating saturn object in scene
      } 

      if (uranusData) {
        console.log("Uranus data:", uranusData);
        uranus = new Uranus(scene, uranusData);//Creating uranus object in scene
      } 

      if (neptuneData) {
        console.log("Neptune data:", neptuneData);
        neptune = new Neptune(scene, neptuneData);//Creating neptune object in scene
      } 

      if (plutoData) {
        console.log("Pluto data:", plutoData);
        pluto = new Pluto(scene, plutoData);//Creating pluto object in scene
      }
      animate();
 
    } 

    getPlanetData();

//Creating OrbitControls to allow camera rotation, zoom, and damping
const controls = new OrbitControls( camera, renderer.domElement );

//Positioning camera
camera.position.set(0, 600, 4000);

//Manually update camera
controls.update();

controls.enableDamping = true;//Weight is applied when you click to move planets
//controls.autoRotate = true;//Camera rotates around solar system
controls.autoZoom = true;//Zoom in using scroller on mouse

//Creating Sun
const sun = new Sun(scene, 200, 0xFFFF00, 3); //Sun with radius 40 and yellow light  

//Animation loop
function animate() {

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();

    sun.rotate();//Rotating sun
    if (earth) {
      earth.rotate(1);//Rotating earth 1 earth day per frame
      earth.updatePosition(1); //Updating earths position 1 day per frame
    } 

    if(mercury){
      mercury.rotate(24/1407.6);//Rotating mercury 1 earth day per frame
      mercury.updatePosition(1); //Updating mercurys position 1 day per frame
    }

    if(venus){
      venus.rotate(24/-5832.5);//Rotating venus 1 earth day per frame
      venus.updatePosition(1); //Updating venus's  position 1 day per frame
    }

    if(mars){
      mars.rotate(24/24.6);//Rotating mars 1 earth per frame
      mars.updatePosition(1); //Updating mars's  position 1 day per frame
    }

    if(jupiter){
      jupiter.rotate(24/9.9);//Rotating jupiters 1 earth day per frame
      jupiter.updatePosition(1); //Updating jupiters's position 1 day per frame
    }

    if(saturn){
      saturn.rotate(24/10.7);//Rotating saturns 1 earth day per frame
      saturn.updatePosition(1); //Updating saturn's position 1 day per frame
    }

    if(uranus){
      uranus.rotate(24/-17.2);//Rotating uranus' 1 earth day per frame
      uranus.updatePosition(1); //Updating uranus' position 1 day per frame
    }

    if(neptune){
      neptune.rotate(24/16.1);//Rotating neptune's 1 earth day per frame
      neptune.updatePosition(1); //Updating neptune's position 1 day per frame
    }

    if(pluto){
      pluto.rotate(24/-153.3);//Rotating pluto's 1 earth day per frame
      pluto.updatePosition(1); //Updating pluto's position 1 day per frame
    }
}

