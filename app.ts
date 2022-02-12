import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { databaseURL, port } from './config';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import collectionRoutes from './routes/collectionRoutes';

const app = express();

mongoose.connect(databaseURL).then(
    () => console.log('MongoDB is connected'),
    (err) => console.log(err)
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Well done!');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/collections', collectionRoutes);

app.listen(port, () => {
    console.log('The application is listening on port 3000!');
});
