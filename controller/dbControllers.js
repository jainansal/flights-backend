import airportsDB from '../data/airportsDB.js'

export const getAirports = async (req, res) => {
    if(!airportsDB) {
        res.status(500).json('Error establishing connection with the database.')
    }
    res.status(200).json(airportsDB);
};