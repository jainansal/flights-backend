import express from 'express';
import { getAirports } from '../controller/dbControllers.js';

const dbRoutes = express.Router();

dbRoutes.get('/', getAirports);

export default dbRoutes;