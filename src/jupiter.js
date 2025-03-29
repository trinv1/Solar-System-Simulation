//Mercury class
import * as THREE from "three";

 export class Jupiter {
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
        const semiMajorAU = 5.19/3.4; 
        const semiMinorAU = semiMajorAU * Math.sqrt(1 - this.eccentricity ** 2);
        this.rx = semiMajorAU;
        this.ry = semiMinorAU;

        //How many radians planet orbits per day
        this.orbitSpeed = (2 * Math.PI) / planetData.orbital_period_d; 

        //Instanciating loader and creating jupiter texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load( 'https://upload.wikimedia.org/wikipedia/commons/9/91/A_Close-Up_Look_at_Jupiter%E2%80%99s_Dynamic_Atmosphere_%2848494222007%29.jpg');
        texture.colorSpace = THREE.SRGBColorSpace;

        //Creating Jupiter sphere
        this.geometryJupiter = new THREE.SphereGeometry(this.radius, 32, 32);
        this.materialJupiter = new THREE.MeshLambertMaterial({  map: texture,});
        this.jupiter = new THREE.Mesh(this.geometryJupiter, this.materialJupiter);

        scene.add(this.jupiter);//adding jupiter to scene
    
        //Spotlight lighting
        var spotLight = new THREE.SpotLight(0xFFFFFF, 2);
        spotLight.position.set(300, 50, 100);
        scene.add(spotLight);

        //Hemisphere lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 1)
        scene.add(hemiLight);
    }

   //Function to rotate jupiter overtime in given direction
   rotate(timeStep) {
    const hours = timeStep * 24;
    this.jupiter.rotation.y += this.rotationSpeedPerHour  * hours * this.rotationDirection;
}    

//Updating jupiter orbit over time
updatePosition(timeStep) {
    this.theta += this.orbitSpeed * timeStep;

    const x = this.rx * Math.cos(this.theta) * this.auScale;
    const z = this.ry * Math.sin(this.theta) * this.auScale;

    this.jupiter.position.set(x, 0, z);
}
    
}