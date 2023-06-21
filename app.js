import express from "express";

const app = express();

app.get('/', (req, res) => {
  res.send('Successful response.');
});

app.get('/2', (req, res) => {
    res.send('2nd endpoint.');
  });

app.get('/test', (req, res) => {
res.send('workflow endpoint.');
});
app.listen(3000, () => console.log('Example app is listening on port 3000.'));
