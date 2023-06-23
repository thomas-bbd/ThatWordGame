import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

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

app.get('/pipeline', (req, res) => {
res.send("Code pipeline is working!")
});

app.listen(PORT, () => console.log(`Example app is listening on port ${PORT}.`));
