import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbRoutes from './routes/dbRoutes.js';
import flightRoutes from './routes/flightRoutes.js';

// Configurations

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Routes

app.use('/api/db', dbRoutes);
app.use('/api/flight', flightRoutes);

// Port

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Server is all set and running');
});