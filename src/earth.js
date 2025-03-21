//Sun class
import * as THREE from "three";

 export class Earth {
    constructor(scene, planetData) {
        this.radius = planetData.mean_radius_km/500;//Making radius proportionate to scene

        //Rotation per day
        this.rotationPeriod = planetData.rotation_period_d;
        this.rotationSpeed = (2 * Math.PI) / this.rotationPeriod; //radians per day

        //1 AU is approx 149,000,000 km
        //Extracting position & velocity from JSON
        this.position = {
            x: planetData.position_au.X * 10, //Converting astronomical units to fit three.js scale
            y: planetData.position_au.Y * 10,
            z: planetData.position_au.Z * 10
        };
        this.velocity = {
            x: planetData.velocity_au_per_day.VX * 10, //Converting velocity AU/day
            y: planetData.velocity_au_per_day.VY * 10,
            z: planetData.velocity_au_per_day.VZ * 10
        };

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

    //Function to rotate earth overtime
    rotate(timeStep) {
        this.earth.rotation.y += this.rotationSpeed * timeStep;
    }    

    //Updating earths orbit over time
    updatePosition(timeStep) {
        this.position.x += this.velocity.x * timeStep;
        this.position.y += this.velocity.y * timeStep;
        this.position.z += this.velocity.z * timeStep;
    
        //Setting earths position
        this.earth.position.set(this.position.x, this.position.y, this.position.z);
    }
    
}