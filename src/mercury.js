//Mercury class
import * as THREE from "three";

 export class Mercury {
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

        this.distanceFromSun = 0.3871 //Mercurys distance from sun divided by 1AU
        //Getting the semi axes of the orbit
        const scaledDistance = Math.log(this.distanceFromSun+1)/Math.log(3);//scaling distance from sun logarithmically to fit scene
        const semiMajorAU = scaledDistance; 
        const semiMinorAU = semiMajorAU * Math.sqrt(1 - this.eccentricity ** 2);
        this.rx = semiMajorAU;
        this.ry = semiMinorAU;

        //How many radians planet orbits per day
        this.orbitSpeed = (2 * Math.PI) / planetData.orbital_period_d; 

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
    const hours = timeStep * 24;
    this.mercury.rotation.y += this.rotationSpeedPerHour  * hours * this.rotationDirection;
}    

//Updating mercurys orbit over time
updatePosition(timeStep) {
    this.theta += this.orbitSpeed * timeStep;

    const x = this.rx * Math.cos(this.theta) * this.auScale;
    const z = this.ry * Math.sin(this.theta) * this.auScale;

    //Getting inclination of planet
    const inclinationRad = THREE.MathUtils.degToRad(this.inclinationDeg);
    const y = Math.sin(inclinationRad) * z;
    
    this.mercury.position.set(x, y, z * Math.cos(inclinationRad));
}
    
}