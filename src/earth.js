//Earth class
import * as THREE from "three";

 export class Earth {
    constructor(scene, planetData) {
        
        this.radius = planetData.mean_radius_km/1500;//Making radius proportionate to scene

        console.log("Earth radius:", this.radius);

        //Rotation per day
        this.rotationPeriod = planetData.rotation_period_h;
        this.rotationSpeedPerHour = (2 * Math.PI) / this.rotationPeriod;
        this.rotationDirection = -Math.sign(this.rotationPeriod);
        
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
        const texture = loader.load( 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e6059863-37fa-4986-9b43-0a116285360b/d4p5ydm-dc546360-e314-4eb3-876a-b216bbf509ea.png/v1/fill/w_1264,h_632,q_70,strp/earth___texture_by_peteridish_d4p5ydm-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MiIsInBhdGgiOiJcL2ZcL2U2MDU5ODYzLTM3ZmEtNDk4Ni05YjQzLTBhMTE2Mjg1MzYwYlwvZDRwNXlkbS1kYzU0NjM2MC1lMzE0LTRlYjMtODc2YS1iMjE2YmJmNTA5ZWEucG5nIiwid2lkdGgiOiI8PTI1NjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.AlDvOrse-9JdVuaGnd7Tw1vvhjoXVTtvzHE6olxpQF8' );
        texture.colorSpace = THREE.SRGBColorSpace;

        //Creating Earth sphere
        this.geometryEarth = new THREE.SphereGeometry(this.radius, 32, 32);
        this.materialEarth = new THREE.MeshLambertMaterial({  map: texture,});
        this.earth = new THREE.Mesh(this.geometryEarth, this.materialEarth);

        scene.add(this.earth);
    
        //Spotlight lighting
        var spotLight = new THREE.SpotLight(0xFFFFFF, 1);
        spotLight.position.set(300, 50, 100);
        scene.add(spotLight);

        //Hemisphere lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 1)
        scene.add(hemiLight);

    }

    //Function to rotate earth relative to earth days in given direction
    rotate(timeStepInEarthDays) {
        this.earth.rotation.y += this.rotationSpeedPerHour  * timeStepInEarthDays * this.rotationDirection;
    }    

    //Updating mercurys orbit over time
    updatePosition(timeStep) {
        this.theta += this.orbitSpeed * timeStep;

        const x = this.rx * Math.cos(this.theta) * this.auScale;
        const z = this.ry * Math.sin(this.theta) * this.auScale;
      
        //Setting inclination of planet
        const inclinationRad = THREE.MathUtils.degToRad(this.inclinationDeg);
        
        const xPos = x;
        const yPos = z * Math.sin(inclinationRad);
        const zPos = z * Math.cos(inclinationRad);
    
        this.earth.position.set(xPos, yPos, zPos);
}
    
}