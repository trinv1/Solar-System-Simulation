//Earth class
import * as THREE from "three";

 export class Mars {
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

        this.distanceFromSun = 1.52//Mars distance from sun divided by 1AU
        const orbitScale = 200;//for scaling planet orbit from sun
        const base = 3;
        
        //Getting the semi axes of the orbit
        const scaledDistance = Math.log(this.distanceFromSun+orbitScale)/Math.log(base);//scaling distance from sun logarithmically to fit scene
        const semiMajorAU = scaledDistance; 
        const semiMinorAU = semiMajorAU * Math.sqrt(1 - this.eccentricity ** 2);
        this.rx = semiMajorAU;
        this.ry = semiMinorAU;

        //How many radians planet orbits per day
        this.orbitSpeed = (2 * Math.PI) / planetData.orbital_period_d;      

        //Instanciating loader and creating mars texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load( 'https://upload.wikimedia.org/wikipedia/commons/4/46/Solarsystemscope_texture_2k_mars.jpg' );
        texture.colorSpace = THREE.SRGBColorSpace;

        //Creating Mars sphere
        this.geometryMars= new THREE.SphereGeometry(this.radius, 32, 32);
        this.materialMars= new THREE.MeshLambertMaterial({  map: texture,});
        this.mars = new THREE.Mesh(this.geometryMars, this.materialMars);

        scene.add(this.mars);//adding mars to scene
    
        //Spotlight lighting
        var spotLight = new THREE.SpotLight(0xFFFFFF, 2);
        spotLight.position.set(300, 50, 100);
        scene.add(spotLight);

        //Hemisphere lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 1)
        scene.add(hemiLight);

    }

    //Function to rotate mars relative to earth days in a given direction
    rotate(timeStep) {
        this.mars.rotation.y += this.rotationSpeedPerHour  * timeStep * this.rotationDirection;
    }    

    //Updating mars orbit over time
    updatePosition(timeStep) {
        this.theta += this.orbitSpeed * timeStep;

        const x = this.rx * Math.cos(this.theta) * this.auScale;
        const z = this.ry * Math.sin(this.theta) * this.auScale;

        //Setting inclination of planet
        const inclinationRad = THREE.MathUtils.degToRad(this.inclinationDeg);
        
        const xPos = x;
        const yPos = z * Math.sin(inclinationRad);
        const zPos = z * Math.cos(inclinationRad);
    
        this.mars.position.set(xPos, yPos, zPos);
}
    
}