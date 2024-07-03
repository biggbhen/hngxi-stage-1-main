const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', async (req, res) => {
	const visitor = req.query.visitor || 'Guest';
	const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	const location = 'Turkey';
	const temperature = '28°C';

	res.json({
		clientIp,
		location,
		greeting: `Hello, ${visitor}!, the temperature is ${temperature} degrees Celsius in ${location}`,
	});
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
