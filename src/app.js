'use strict';

require('dotenv').config();
const express = require('express');
const connectDB = require('./utils/connectDB');
const routes = require('./routes');

connectDB.connectOrExit();
const app = express();

app.use('/api/v1/account', routes.account);
app.use('/api/v1/assesment', routes.assesment);
app.use('/api/v1/submission', routes.submission);
app.use('/api/v1/user', routes.user);

module.exports = app;