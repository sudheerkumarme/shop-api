const mongoose = require("mongoose");
const config = require("../config");
const Logger = require('./logger');

mongoose.connection.on('connected', function (err) {
    Logger.info('✌️ Database connected!');
});

mongoose.connection.on('error', function (err) {
    Logger.error('Database connection error: ' + err);
});

mongoose.connection.on('disconnected', function (err) {
    Logger.error('Database connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {   
    mongoose.connection.close(function () { 
        Logger.error('Database connection disconnected through app termination'); 
        process.exit(0); 
    }); 
});

module.exports = async () => {
    const connection = await mongoose.connect(config.databaseURL);
    return connection.connection.db;
}