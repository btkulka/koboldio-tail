// dependencies =================
const express = require('express');
const app = express();
const mongoose = require("mongoose");
require('dotenv/config');

// import routes ================
const clockRoutes = require('./routes/clocks');
const userRoutes = require('./routes/users');
const roadRoutes = require('./routes/roads');
const locationRoutes = require('./routes/locations');
const characterRoutes = require('./routes/characters');
const eventRoutes = require('./routes/events');

// top-level middleware =========
// http
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// routes
app.use('/clocks', clockRoutes);
app.use('/users', userRoutes);
app.use('/characters', characterRoutes);
app.use('/locations', locationRoutes);
app.use('/events', eventRoutes);
app.use('/roads', roadRoutes);


// MongoDB Settings ==============
mongoose.connect(
    process.env.DB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    },
    () => {
        console.log('Connected to kobold-db!');
    }
);

// Port Settings =================
app.listen(3401);

