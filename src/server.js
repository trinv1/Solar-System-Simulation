//Imports
import express from 'express'; 
const app = express();

import cors from 'cors';
app.use(cors());

//Connecting to database
import mongoose from 'mongoose';
mongoose.connect('mongodb+srv://admin:admin@cluster0.nokwl.mongodb.net/PlanetDataDB');

//Storing data in database
const PlanetSchema = new mongoose.Schema({
    planet:String,
    mean_radius_km:Number,
    orbital_period_d:Number,
    orbital_velocity_kms:Number,
    rotation_period_h:Number,
    orbital_eccentricity:Number,
    orbital_inclination:Number

  });
  
//Generating model based on schema
const Planet = new mongoose.model('Planet', PlanetSchema)

//Fetching documents in planet collection
app.get('/planets', async (req, res) => {
    const data = await Planet.find({});
    res.json(data);
  });

//Port app is listening on
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});