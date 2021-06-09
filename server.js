const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');;
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require( './routes/userRoutes');
const orderRoutes = require( './routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

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

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} and listening on port ${PORT}`
  );
});
