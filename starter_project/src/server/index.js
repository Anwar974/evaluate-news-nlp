const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
require('dotenv').config();

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src')));

app.post('/api', async (req, res) => {
    const articleUrl = req.body.url;
    const apiKey = process.env.API_KEY;
    const apiUrl = `https://api.meaningcloud.com/sentiment-2.1?key=${apiKey}&url=${articleUrl}&lang=en`;

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        res.send(data);

        
        console.log(data);

    } catch (error) {
        res.status(500).send({ error: 'Unable to process the request' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve('src/views/index.html'));
});

app.listen(8000, () => {
    console.log('Server running on port 8000');
});
