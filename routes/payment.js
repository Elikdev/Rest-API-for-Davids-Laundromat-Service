const paymentRouter = require('express').Router();
const auth = require('../helpers/verifyToken'); //middleware
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

//All routes here require auth-token
//get all payments
paymentRouter.get('/all', auth, getPayments);

//get payment by id
paymentRouter.get('/:id', auth, getPaymentById);

//new payment
paymentRouter.post('/new', auth, validatePayment, newPayment);

//delete payment by Id
paymentRouter.delete('/:id', auth, deletePaymentById);

//delete all payments
paymentRouter.delete('/delete/all', auth, deleteAllPayments);

module.exports = paymentRouter;
