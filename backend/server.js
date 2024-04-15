const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');

const connectDB = require('./config/connectDB')

dotenv.config({path: './config/config.env'});
connectDB();

const product = require('./routes/product');
const user = require('./routes/user');
const auth = require('./routes/auth');
const inventory = require('./routes/inventory');

const app = express();

app.use(express.json());

app.use(fileupload({
    debug: true
}));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/products', product);
app.use('/api/v1/inventories', inventory);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
// app.use('/api/v1/reviews', reviews);
app.use(errorHandler);

const PORT= process.env.PORT || 5000;

const server = app.listen(
    PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on ${PORT}`)
);

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)

    server.close(() => process.exit(1))
});
