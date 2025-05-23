//Saturn class
import * as THREE from "three";
import saturnRings from './saturnRings.jpg';

 export class Saturn {
    constructor(scene, planetData) {
        this.radius = planetData.mean_radius_km/1500;//Making radius proportionate to scene
        
        //Rotation per day
        this.rotationPeriod = planetData.rotation_period_h;
        this.rotationSpeedPerHour = (2 * Math.PI) / this.rotationPeriod;
        this.rotationDirection = -Math.sign(this.rotationPeriod);
        
        this.inclinationDeg = planetData.orbital_inclination;
        this.eccentricity = planetData.orbital_eccentricity;//how stretched the orbit is
        this.theta = 0; //orbit angle
        this.auScale = 150;//scaling to scene

        this.distanceFromSun = 9.546//Saturn distance from sun divided by 1 AU
        const orbitScale = 5;//for scaling planet orbit from sun

        //Getting the semi axes of the orbit
        const scaledDistance = Math.log(this.distanceFromSun+1)*orbitScale;//scaling distance from sun logarithmically to fit scene
        const semiMajorAU = scaledDistance; 
        const semiMinorAU = semiMajorAU * Math.sqrt(1 - this.eccentricity ** 2);
        this.rx = semiMajorAU;
        this.ry = semiMinorAU;

        //How many radians planet orbits per day
        this.orbitSpeed = (2 * Math.PI) / planetData.orbital_period_d; 

        //Instanciating loader and creating saturn texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load('https://upload.wikimedia.org/wikipedia/commons/1/1e/Solarsystemscope_texture_8k_saturn.jpg');
        texture.colorSpace = THREE.SRGBColorSpace;

        //Creating saturn sphere
        this.geometrySaturn = new THREE.SphereGeometry(this.radius, 32, 32);
        this.materialSaturn = new THREE.MeshLambertMaterial({  map: texture,});
        this.saturn = new THREE.Mesh(this.geometrySaturn, this.materialSaturn);

        scene.add(this.saturn);

        //Adding planet rings
        const loaderRing = new THREE.TextureLoader();
        const textureRing = loaderRing.load(saturnRings);
        textureRing.colorSpace = THREE.SRGBColorSpace;
        
        this.geometryRings = new THREE.RingGeometry(this.radius * 1.3, this.radius * 2, 64);
        this.materialRings = new THREE.MeshBasicMaterial({ map: textureRing, side: THREE.DoubleSide, transparent:true, alphaTest:0.5});
        this.rings = new THREE.Mesh(this.geometryRings, this.materialRings);
    
        this.rings.rotation.x = THREE.MathUtils.degToRad(90 - this.inclinationDeg);//tilting ring

        this.rings.position.copy(this.saturn.position);//copying saturns position in orbit

        scene.add(this.rings);

        //Hemisphere lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 1)
        scene.add(hemiLight);
    }

   //Function to rotate saturn relative to earth in given direction
   rotate(timeStepInEarthDays) {
    this.saturn.rotation.y += this.rotationSpeedPerHour  * timeStepInEarthDays;
}    

//Updating saturns orbit over time
updatePosition(timeStep) {
    this.theta += this.orbitSpeed * timeStep;

    const x = this.rx * Math.cos(this.theta) * this.auScale;
    const z = this.ry * Math.sin(this.theta) * this.auScale;

    //Setting inclination of planet
    const inclinationRad = THREE.MathUtils.degToRad(this.inclinationDeg);
    const xPos = x;
    const yPos = z * Math.sin(inclinationRad);
    const zPos = z * Math.cos(inclinationRad);

    this.saturn.position.set(xPos, yPos, zPos);
    this.rings.position.set(xPos, yPos, zPos);//adding rings to scene

}
    
}