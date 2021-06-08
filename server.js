import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';


import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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


// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '/frontend/build')));

//   app.get('*', (_, res) =>
//     res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
//   );
// } else {
//   app.get('/api', (_, res) => {
//     res.send('API is running....');
//   });
// }

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(
  PORT,
  () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} and listening on port ${PORT}`,

    )
  }
);
