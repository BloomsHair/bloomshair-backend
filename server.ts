import path from 'path';
import express from 'express';
import * as admin from 'firebase-admin'
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/errorMiddleware';


import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import uploadRoutes from './routes/uploadRoutes';

dotenv.config();

const serviceAccount = require('./bloomshair-e4d4d-firebase-adminsdk-byumh-1eef9175ef.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ origin: true }));

app.get('/api', (_, res) => {
  res.send('API is running ...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (_, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (_, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/api', (_, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} and listening on port ${PORT}`,

    )
  }
);
