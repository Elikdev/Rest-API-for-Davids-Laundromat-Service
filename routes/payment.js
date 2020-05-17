const paymentRouter = require('express').Router();
const { check } = require('express-validator');

//Controllers
const {
	getPayments,
	getPaymentById,
	newPayment,
	deletePaymentById,
	deleteAllPayments,
} = require('../controller/payment');

//validation
const validatePayment = [
	check('payment_mode', 'payment_mode field is empty').notEmpty(),
	check('washId', 'washId field is empty').notEmpty(),
];

//get all payments
paymentRouter.get('/all', getPayments);

//get payment by id
paymentRouter.get('/:id', getPaymentById);

//new payment
paymentRouter.post('/new', validatePayment, newPayment);

//delete payment by Id
paymentRouter.delete('/:id', deletePaymentById);

//delete all payments
paymentRouter.delete('/delete/all', deleteAllPayments);

module.exports = paymentRouter;
