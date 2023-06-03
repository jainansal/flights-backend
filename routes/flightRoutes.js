import express from 'express';
import { getFlights } from '../controller/flightControllers.js';

const flightRoutes = express.Router();

flightRoutes.post('/', getFlights);

export default flightRoutes;