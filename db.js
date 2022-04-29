const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);

mongoose.connection.on('connected', function (err) {
    console.log('Database connection successful!');
});

mongoose.connection.on('error', function (err) {
    console.log('Database connection error: ' + err);
});

mongoose.connection.on('disconnected', function (err) {
    console.log('Database connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {   
    mongoose.connection.close(function () { 
      console.log('Database connection disconnected through app termination'); 
      process.exit(0); 
    }); 
});