import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import collectionRoutes from './routes/collectionRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();

// TODO: Enable cors for only one route
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Well done!');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/collections', collectionRoutes);

app.use(errorHandler);

export default app;
