const paymentRouter = require('express').Router();
const auth = require('../helpers/verifyToken'); //middleware
const checkStaff = require('../helpers/checkStaff'); //middleware
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
paymentRouter.get('/all', auth, checkStaff, getPayments);

//get payment by id
paymentRouter.get('/:id', auth, checkStaff, getPaymentById);

//new payment
paymentRouter.post('/new', auth, checkStaff, validatePayment, newPayment);

//delete payment by Id
paymentRouter.delete('/:id', auth, checkStaff, deletePaymentById);

//delete all payments
paymentRouter.delete('/delete/all', auth, checkStaff, deleteAllPayments);

module.exports = paymentRouter;
