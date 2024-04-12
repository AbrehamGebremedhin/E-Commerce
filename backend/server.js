const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');

const connectDB = require('./config/connectDB')

dotenv.config({path: './config/config.env'});
connectDB();

const products = require('./routes/products')
const users = require('./routes/users')
const auth = require('./routes/auth')

const app = express();

app.use(express.json());

app.use(fileupload({
    debug: true
}));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/products', products);
// app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
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
