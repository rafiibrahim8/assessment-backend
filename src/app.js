'use strict';

require('dotenv').config();
const express = require('express');
const connectDB = require('./utils/connectDB');
const routes = require('./routes');

connectDB.connectOrExit();
const app = express();

app.use(express.json());
app.use('/api/v1', routes);
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).json({msg: `Error Occurred. Reason: ${err}`});
});

module.exports = app;
