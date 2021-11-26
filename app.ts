import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import environmentVars from './config/index';
import userRoutes from './routes/userRoutes';

const app = express();

const { databaseURL, port } = environmentVars;

mongoose.connect(databaseURL).then(
    () => console.log('MongoDB is connected'),
    (err) => console.log(err)
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Well done!');
});

app.use('/users', userRoutes);

app.listen(port, () => {
    console.log('The application is listening on port 3000!');
});
