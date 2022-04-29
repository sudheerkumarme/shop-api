const express = require('express');
const app = express();

const startServer = async () => {
    await require('./loaders')(app);
};

startServer();

module.exports = app;