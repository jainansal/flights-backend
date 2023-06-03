import fetch from 'node-fetch';
import { getFareMap } from '../middleware/getFareMap.js';

const getToken = async () => {
    console.log('...fetching token...')
    try {
        const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: "POST",
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                'client_id': process.env.API_KEY,
                'client_secret': process.env.API_SECRET
            })
        });
        const data = await response.json();
        console.log(data)
        return data.access_token;
    } catch (err) {
        throw err;
    }
};

const findFlights = async (origin, destination, date, access_token) => {
    console.log('...api for flights...')
    try {
        const url = 'https://test.api.amadeus.com/v2/shopping/flight-offers?';
        const params = new URLSearchParams({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: date,
            max: 30,
            adults: 1,
            currencyCode: 'INR'
        }).toString();

        console.log('...fetching data from api...');
        const response = await fetch(url + params, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${access_token}`
            }
        });

        const jsonData = await response.json();
        return jsonData;
    } catch (err) {
        throw err;
    }
};

export const getFlights = async (req, res) => {
    console.log(req.body)
    console.log('...searching for flights...')
    let token;
    try {
        token = await getToken();
        if (!token) {
            res.status(500).json('No token received');
            throw err;
        }
    } catch (err) {
        res.status(500).json(err);
        return;
    }

    let flights;
    try {
        flights = await findFlights(req.body.origin, req.body.destination, req.body.date, token);
        if (!flights) {
            res.status(500).json('Error in receiving flight information');
            return;
        }
    } catch (err) {
        res.status(500).json(err);
    }

    try {
        console.log('...flights received...')
        console.log(flights)
        if (!flights.meta.count) {
            res.status(200).json('No flights');
            return;
        }

        const findCheap = (req.body.mode === 'cheap');
        const fareMap = await getFareMap(flights, findCheap);

        res.status(200).json(fareMap);

    } catch (err) {
        res.status(500).json(err);
    }
};