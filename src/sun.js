//Sun class
import * as THREE from "three";

 export class Sun {
    constructor(scene, radius, color, lightIntensity) {
        this.radius = radius;

        //Instanciating loader and creating sun texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load( 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Solarsystemscope_texture_2k_sun.jpg' );
        texture.colorSpace = THREE.SRGBColorSpace;

        //Creating Sun sphere
        this.geometrySun = new THREE.SphereGeometry(this.radius, 32, 32);
        this.materialSun = new THREE.MeshLambertMaterial({  color: 0xffff00, map: texture,});
        this.sun = new THREE.Mesh(this.geometrySun, this.materialSun);

        scene.add(this.sun);
    
        //Spotlight lighting
        var spotLight = new THREE.SpotLight(0xFFFFFF, 2);
        spotLight.position.set(300, 50, 100);
        scene.add(spotLight);

        //Hemisphere lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 4)
        scene.add(hemiLight);

    }

    //Function to rotate sun
    rotate(){
        this.sun.rotation.y += 0.002; 
    }
}