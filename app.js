import express from "express";

const app = express();

app.get('/', (req, res) => {
    console.log('Endpoint / was hit')
    res.send('Successful response.');
});

app.get('/2', (req, res) => {
    console.log('Endpoint /2 was hit')
    res.send('2nd endpoint.');
});

app.get('/test', (req, res) => {
    console.log('Endpoint /test was hit')
    res.send('please fucking work');
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));
