const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5000;

const API_KEY = '159e4a4ecdb6ae9d6d6c91e457aa0e7d';

app.get('/api/hello', async (req, res) => {
	const visitor = req.query.visitor_name || 'Guest';
	const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

	try {
		// Fetch location data from ip-api.com
		const locationResponse = await axios.get(
			`http://ip-api.com/json/${clientIp}`
		);
		const locationData = locationResponse.data;

		console.log(clientIp);

		if (locationData.status === 'success') {
			const { country, city, lat, lon } = locationData;
			const location = `${city}, ${country}`;

			const weatherResponse = await axios.get(
				'http://api.openweathermap.org/data/2.5/weather',
				{
					params: {
						lat,
						lon,
						appid: API_KEY,
						units: 'metric',
					},
				}
			);
			const weatherData = weatherResponse.data;
			const temperature = `${weatherData.main.temp}°C`;

			res.json({
				client_ip: clientIp,
				location,
				latitude: lat,
				longitude: lon,
				greeting: `Hello, ${visitor}! The temperature is ${temperature} in ${location}.`,
			});
		} else {
			res.status(404).json({
				client_ip: clientIp,
				location: 'Unknown',
				greeting: `Hello, ${visitor}!`,
				error: locationData.message,
			});
		}
	} catch (error) {
		console.error('Error occurred:', error);

		// Respond with an error message
		res.status(500).json({
			error:
				'An error occurred while processing your request. Please try again later.',
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
