//Uranus class
import * as THREE from "three";
import uranusRings from './uranusRings.png';

 export class Uranus {
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

        this.distanceFromSun = 19.11//Uranus distance from sun divided by 1AU
        const orbitScale = 5;//for scaling planet orbit from sun

        //Getting the semi axes of the orbit
        const scaledDistance = Math.log(this.distanceFromSun+1)*orbitScale;//scaling distance from sun logarithmically to fit scene
        const semiMajorAU = scaledDistance; 
        const semiMinorAU = semiMajorAU * Math.sqrt(1 - this.eccentricity ** 2);
        this.rx = semiMajorAU;
        this.ry = semiMinorAU;

        //How many radians planet orbits per day
        this.orbitSpeed = (2 * Math.PI) / planetData.orbital_period_d; 

        //Instanciating loader and creating jupiter texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load( 'https://upload.wikimedia.org/wikipedia/commons/9/95/Solarsystemscope_texture_2k_uranus.jpg');
        texture.colorSpace = THREE.SRGBColorSpace;

        //Creating uranus sphere
        this.geometryUranus = new THREE.SphereGeometry(this.radius, 32, 32);
        this.materialUranus = new THREE.MeshLambertMaterial({  map: texture,});
        this.uranus = new THREE.Mesh(this.geometryUranus, this.materialUranus);

        scene.add(this.uranus);//adding uranus to scene

        //Adding planet rings
        const loaderRing = new THREE.TextureLoader();
        const textureRing = loaderRing.load(uranusRings);
        textureRing.colorSpace = THREE.SRGBColorSpace;
        
        this.geometryRings = new THREE.RingGeometry(this.radius * 1.3, this.radius * 2, 54);
        this.materialRings = new THREE.MeshBasicMaterial({ map: textureRing, side: THREE.DoubleSide, transparent:true});
        this.rings = new THREE.Mesh(this.geometryRings, this.materialRings);
    
        this.rings.rotation.x = THREE.MathUtils.degToRad(90 - this.inclinationDeg);//tilting ring

        this.rings.position.copy(this.uranus.position);//copying urnaus' position in orbit

        scene.add(this.rings);
    
        //Spotlight lighting
        var spotLight = new THREE.SpotLight(0xFFFFFF, 2);
        spotLight.position.set(300, 50, 100);
        scene.add(spotLight);

        //Hemisphere lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 1)
        scene.add(hemiLight);
    }

   //Function to rotate uranus relative to earth in given direction
   rotate(timeStepInEarthDays) {
    this.uranus.rotation.y += this.rotationSpeedPerHour  * timeStepInEarthDays;
}    

//Updating uranus orbit over time
updatePosition(timeStep) {
    this.theta += this.orbitSpeed * timeStep;

    const x = this.rx * Math.cos(this.theta) * this.auScale;
    const z = this.ry * Math.sin(this.theta) * this.auScale;

    //Setting inclination of planet
    const inclinationRad = THREE.MathUtils.degToRad(this.inclinationDeg);

    const xPos = x;
    const yPos = z * Math.sin(inclinationRad);
    const zPos = z * Math.cos(inclinationRad);

    this.uranus.position.set(xPos, yPos, zPos);
    this.rings.position.set(xPos, yPos, zPos);//adding rings to scene

}
    
}