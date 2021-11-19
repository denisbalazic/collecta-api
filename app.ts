import express from 'express';
import mongoose from 'mongoose';
import environmentVars from './config/index';

const app = express();

const { databaseURL, port } = environmentVars;

mongoose.connect(databaseURL).then(
  () => console.log('MongoDB is connected'),
  (err) => console.log(err)
);

app.get('/', (req, res) => {
  res.send('Well done!');
});

app.listen(port, () => {
  console.log('The application is listening on port 3000!');
});
