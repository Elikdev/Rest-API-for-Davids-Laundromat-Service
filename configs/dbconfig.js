const mongoose = require('mongoose');
const config = require('./config');

//get the db connection string
const dbConnectionString = config.MONGODB_URI;

//a function that handles the db connection
const dbConnection = () => {
	mongoose
		.connect(dbConnectionString, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log('Successfully connected to the database');
		})
		.catch((err) => {
			console.error(" db connect error >>> ", err.message);
		});
};

module.exports = dbConnection;
