//Mercury class
import * as THREE from "three";

 export class Venus {
    constructor(scene, planetData) {
        this.radius = planetData.mean_radius_km/1500;//Making radius proportionate to scene
        
        //Rotation per day
        this.rotationPeriod = planetData.rotation_period_h;
        this.rotationSpeedPerHour = (2 * Math.PI) / this.rotationPeriod;
        this.rotationDirection = Math.sign(this.rotationPeriod);
        
        this.inclinationDeg = planetData.orbital_inclination;
        this.eccentricity = planetData.orbital_eccentricity;//how stretched the orbit is
        this.theta = 0; //orbit angle
        this.auScale = 150;//scaling to scene

        this.distanceFromSun = 0.721//Venus' distance from sun divided by 1AU
        
        //Getting the semi axes of the orbit
        const scaledDistance = Math.log(0.721+1)/Math.log(3);//scaling distance from sun logarithmically to fit scene
        const semiMajorAU = scaledDistance;  
        const semiMinorAU = semiMajorAU * Math.sqrt(1 - this.eccentricity ** 2);
        this.rx = semiMajorAU;
        this.ry = semiMinorAU;

        //How many radians planet orbits per day
        this.orbitSpeed = (2 * Math.PI) / planetData.orbital_period_d; 

        //Instanciating loader and creating venus texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load( 'https://upload.wikimedia.org/wikipedia/commons/1/19/Cylindrical_Map_of_Venus.jpg');
        texture.colorSpace = THREE.SRGBColorSpace;

        //Creating Venus sphere
        this.geometryVenus = new THREE.SphereGeometry(this.radius, 32, 32);
        this.materialVenus = new THREE.MeshLambertMaterial({  map: texture,});
        this.venus = new THREE.Mesh(this.geometryVenus, this.materialVenus);

        scene.add(this.venus);
    
        //Spotlight lighting
        var spotLight = new THREE.SpotLight(0xFFFFFF, 2);
        spotLight.position.set(300, 50, 100);
        scene.add(spotLight);

        //Hemisphere lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 1)
        scene.add(hemiLight);
    }

   //Function to rotate venus overtime in given direction
   rotate(timeStep) {
    const hours = timeStep * 24;
    this.venus.rotation.y += this.rotationSpeedPerHour  * hours * this.rotationDirection;
}    

//Updating venus orbit over time
updatePosition(timeStep) {
    this.theta += this.orbitSpeed * timeStep;

    const x = this.rx * Math.cos(this.theta) * this.auScale;
    const z = this.ry * Math.sin(this.theta) * this.auScale;

    //Getting inclination of planet
    const inclinationRad = THREE.MathUtils.degToRad(this.inclinationDeg);
    const y = Math.sin(inclinationRad) * z;
        
    this.venus.position.set(x, y, z * Math.cos(inclinationRad));
}
    
}