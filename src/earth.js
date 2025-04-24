//Earth class
import * as THREE from "three";

 export class Earth {
    constructor(scene, planetData) {
        
        this.radius = planetData.mean_radius_km/1500;//Making radius proportionate to scene

        console.log("Earth radius:", this.radius);

        //Rotation per day
        this.rotationPeriod = planetData.rotation_period_h;
        this.rotationSpeedPerHour = (2 * Math.PI) / this.rotationPeriod;
        this.rotationDirection = Math.sign(this.rotationPeriod);
        
        this.inclinationDeg = planetData.orbital_inclination//inclination of planet
        this.eccentricity = planetData.orbital_eccentricity;//how stretched the orbit is
        this.theta = 0; //orbit angle
        this.auScale = 150;//scaling to scene

        this.distanceFromSun = 0.997 //Earths distance from sun divided by 1AU
        const orbitScale = 200;//to scale planets so theyre not inside sun
        const base = 3;
        
        //Getting the semi axes of the orbit
        const scaledDistance = Math.log(this.distanceFromSun*orbitScale)/Math.log(base);//scaling distance from sun logarithmically to fit scene
        const semiMajorAU = scaledDistance; 
        const semiMinorAU = semiMajorAU * Math.sqrt(1 - this.eccentricity ** 2);
        this.rx = semiMajorAU;
        this.ry = semiMinorAU;

        console.log("Earth orbit rx:", this.rx, "ry:", this.ry);

        //How many radians planet orbits per day
        this.orbitSpeed = (2 * Math.PI) / planetData.orbital_period_d;      

        //Instanciating loader and creating earth texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load( 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Whole_world_-_land_and_oceans_12000.jpg' );
        texture.colorSpace = THREE.SRGBColorSpace;

        //Creating Earth sphere
        this.geometryEarth = new THREE.SphereGeometry(this.radius, 32, 32);
        this.materialEarth = new THREE.MeshLambertMaterial({  map: texture,});
        this.earth = new THREE.Mesh(this.geometryEarth, this.materialEarth);

        scene.add(this.earth);
    
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
        this.earth.rotation.y += this.rotationSpeedPerHour  * hours * this.rotationDirection;
    }    

    //Updating mercurys orbit over time
    updatePosition(timeStep) {
        this.theta += this.orbitSpeed * timeStep;

        const x = this.rx * Math.cos(this.theta) * this.auScale;
        const z = this.ry * Math.sin(this.theta) * this.auScale;
      
        //Getting inclination of planet
        const inclinationRad = THREE.MathUtils.degToRad(this.inclinationDeg);
        const y = Math.sin(inclinationRad) * z;
                
        this.earth.position.set(x, y, z * Math.cos(inclinationRad));
}
    
}