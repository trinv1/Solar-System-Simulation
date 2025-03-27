//Mercury class
import * as THREE from "three";

 export class Mercury {
    constructor(scene, planetData) {
        this.radius = planetData.mean_radius_km/500;//Making radius proportionate to scene

        //Rotation per day
        this.rotationPeriod = planetData.rotation_period_d;
        this.rotationSpeedPerDay = (2 * Math.PI) / this.rotationPeriod;
        this.rotationDirection = Math.sign(this.rotationPeriod);

        this.theta = 0; //orbit angle
        this.orbitSpeed = (2 * Math.PI) / (planetData.orbital_period_y * 365); //radians per day

        this.auScale = 150;//scaling to scene

        //Manually calculated semi major and semi minor axis from json
        this.rx = 0.622 / 2; 
        this.ry = 0.537 / 2; 

        //Instanciating loader and creating mercury texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load( 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Mercury_global_map_2013-05-14_bright.png');
        texture.colorSpace = THREE.SRGBColorSpace;

        //Creating Mercury sphere
        this.geometryMercury = new THREE.SphereGeometry(this.radius, 32, 32);
        this.materialMercury = new THREE.MeshLambertMaterial({  map: texture,});
        this.mercury = new THREE.Mesh(this.geometryMercury, this.materialMercury);

        scene.add(this.mercury);
    
        //Spotlight lighting
        var spotLight = new THREE.SpotLight(0xFFFFFF, 2);
        spotLight.position.set(300, 50, 100);
        scene.add(spotLight);

        //Hemisphere lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 1)
        scene.add(hemiLight);
    }

   //Function to rotate mercury overtime in given direction
   rotate(timeStep) {
    this.mercury.rotation.y += this.rotationSpeedPerDay  * timeStep * this.rotationDirection;
}    

//Updating mercurys orbit over time
updatePosition(timeStep) {
    this.theta += this.orbitSpeed * timeStep;

    const x = this.rx * Math.cos(this.theta) * this.auScale;
    const z = this.ry * Math.sin(this.theta) * this.auScale;

    this.mercury.position.set(x, 0, z);
}
    
}