import express from 'express';
import mongoose from 'mongoose';

const app = express();

mongoose.connect('mongodb://localhost:27017/collecta').then(
  () => console.log('MongoDB is connected'),
  (err) => console.log(err)
);

app.get('/', (req, res) => {
  res.send('Well done!');
});

app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
});
