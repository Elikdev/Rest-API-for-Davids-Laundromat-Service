require('dotenv').config();
module.exports = {
	PORT: process.env.PORT || 7000,
	HOST: process.env.HOST || 'http://127.0.0.1:',
	ENV: process.env.NODE_ENV || 'development',
	SECRET_TOKEN: process.env.SECRET_KEY,
	MONGODB_URI:
		process.env.DBCONNECT ||
		'mongodb://127.0.0.1:27017/DavidsLaundromatService',
};
