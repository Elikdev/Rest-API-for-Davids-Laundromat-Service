const express = require('express');
const dbConnection = require('./configs/dbconfig');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const customerRouter = require('./routes/customer');
const washRouter = require('./routes/wash');
const paymentRouter = require('./routes/payment');
const config = require('./configs/config');

//load them directly from the configs folder
const port = config.PORT;
const hostname = config.HOST;

//load the database here
dbConnection();

const app = express();

//bodyParser
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//index view
app.get('/api/v1', (req, res) => {
	res.json({
		message: 'Welcome to Davids Laundromat Services',
	});
});

//basic routes declarations
app.use('/api/v1/staff', indexRouter);
app.use('/api/v1/customer', customerRouter);
app.use('/api/v1/wash', washRouter);
app.use('/api/v1/payment', paymentRouter);

app.listen(port, () => {
	console.log(`App is running on port ${port} at ${hostname}${port}/api/v1`);
});
