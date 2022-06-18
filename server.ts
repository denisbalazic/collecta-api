import mongoose from 'mongoose';
import app from './app';
import { databaseURL, port } from './config';

mongoose.connect(databaseURL).then(
    () => console.log('MongoDB is connected'),
    (err) => console.log(err)
);

app.listen(port, () => {
    console.log('The application is listening on port 3001!');
});
