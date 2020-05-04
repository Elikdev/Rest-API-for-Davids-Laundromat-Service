const customerRoutes = require('express').Router();
const auth = require('../helpers/verifyToken'); //middleware
const checkStaff = require('../helpers/checkStaff'); //middleware
const { check } = require('express-validator');

//controllers
const {
	register,
	getAll,
	getOne,
	updateOne,
	deleteOne,
	deleteAll,
} = require('../controller/customer');

const validateCustomer = [
	check('customer_name', "Customer's name is empty").notEmpty(),
	check('email', 'Email is invalid or empty').isEmail(),
	check(
		'mobile_num',
		'Mobile Number must be a nigerian number, starting with the second digit and must be 10 digits long(e.g 9156435672)'
	).isLength({ min: 10, max: 10 }),
	check('address', 'Address is empty').notEmpty(),
];

//register a new customer
customerRoutes.post('/register', validateCustomer, auth, checkStaff, register);

//get all the customers
customerRoutes.get('/all', auth, checkStaff, getAll);

//get customer by id
customerRoutes.get('/:id', auth, checkStaff, getOne);

//update customer by id
customerRoutes.put('/:id', auth, checkStaff, updateOne);

//delete customer by id
customerRoutes.delete('/:id', auth, checkStaff, deleteOne);

//delete all customers
customerRoutes.delete('/delete/all', auth, checkStaff, deleteAll);

module.exports = customerRoutes;
