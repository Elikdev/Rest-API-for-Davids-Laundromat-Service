const paymentRouter = require('express').Router();
const controllers = require('../controller/payment');
const auth = require('../helpers/verifyToken');
const { check } = require('express-validator');

const validatePayment = [
	check('amount', 'amount field is empty').notEmpty(),
	check('payment_mode', 'payment_mode field is empty').notEmpty(),
	check('customer_name', 'customer_name field is empty').notEmpty(),
	check('washId', 'washId field is empty').notEmpty(),
];

//get all payments
paymentRouter.get('/all', auth, controllers.getPayments);

//get payment by id
paymentRouter.get('/:id', auth, controllers.getPaymentById);

//new payment
paymentRouter.post('/new', auth, validatePayment, controllers.newPayment);

//delete payment by Id
paymentRouter.delete('/:id', auth, controllers.deletePaymentById);

//delete all payments
paymentRouter.delete('/delete/all', auth, controllers.deleteAllPayments);

module.exports = paymentRouter;
