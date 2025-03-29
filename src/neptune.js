//Mercury class
import * as THREE from "three";

 export class Neptune {
    constructor(scene, planetData) {
        this.radius = planetData.mean_radius_km/1500;//Making radius proportionate to scene
        
        //Rotation per day
        this.rotationPeriod = planetData.rotation_period_h;
        this.rotationSpeedPerHour = (2 * Math.PI) / this.rotationPeriod;
        this.rotationDirection = Math.sign(this.rotationPeriod);
        
        this.eccentricity = planetData.orbital_eccentricity;//how stretched the orbit is
        this.theta = 0; //orbit angle
        this.auScale = 150;//scaling to scene

        //Getting the semi axes of the orbit
        const semiMajorAU = 30.1/10.5; 
        const semiMinorAU = semiMajorAU * Math.sqrt(1 - this.eccentricity ** 2);
        this.rx = semiMajorAU;
        this.ry = semiMinorAU;

        //How many radians planet orbits per day
        this.orbitSpeed = (2 * Math.PI) / planetData.orbital_period_d; 

        //Instanciating loader and creating jupiter texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load( 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Solarsystemscope_texture_2k_neptune.jpg');
        texture.colorSpace = THREE.SRGBColorSpace;

        //Creating neptune sphere
        this.geometryNeptune = new THREE.SphereGeometry(this.radius, 32, 32);
        this.materialNeptune = new THREE.MeshLambertMaterial({  map: texture,});
        this.neptune = new THREE.Mesh(this.geometryNeptune, this.materialNeptune);

        scene.add(this.neptune);//adding neptune to scene
    
        //Spotlight lighting
        var spotLight = new THREE.SpotLight(0xFFFFFF, 2);
        spotLight.position.set(300, 50, 100);
        scene.add(spotLight);

        //Hemisphere lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 1)
        scene.add(hemiLight);
    }

   //Function to rotate neptune overtime in given direction
   rotate(timeStep) {
    const hours = timeStep * 24;
    this.neptune.rotation.y += this.rotationSpeedPerHour  * hours * this.rotationDirection;
}    

//Updating neptune orbit over time
updatePosition(timeStep) {
    this.theta += this.orbitSpeed * timeStep;

    const x = this.rx * Math.cos(this.theta) * this.auScale;
    const z = this.ry * Math.sin(this.theta) * this.auScale;

    this.neptune.position.set(x, 0, z);
}
    
}