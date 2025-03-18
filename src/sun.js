//Sun class
import * as THREE from "three";

//Sun Class
class Sun {
    constructor(scene, radius, color, lightIntensity) {
        this.radius = radius;

        //Creating Sun sphere
        this.geometrySun = new THREE.SphereGeometry(this.radius, 32, 32);
        this.materialSun = new THREE.MeshLambertMaterial({  color: 0xffff00 });
        this.sun = new THREE.Mesh(this.geometrySun, this.materialSun);

        scene.add(this.sun);
    
        //Spotlight lighting
        var spotLight = new THREE.SpotLight(0xFFFFFF, 2);
        spotLight.position.set(300, 50, 100);
        scene.add(spotLight);

        //Hemisphere lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 1)
        scene.add(hemiLight);

    }

    //Function to rotate sun
    rotate(){
        this.sun.rotation.y += 0.01; 
    }
}