const mongoose = require('mongoose');
const config = require('./config');

//get the db connection string
const dbCs = config.MONGODB_URI;

//a function that handles the db connection
const dbConnection = () => {
	mongoose
		.connect(dbCs, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log('Successfully connected to the database');
		})
		.catch((err) => {
			console.error(err.message);
		});
};

module.exports = dbConnection;
