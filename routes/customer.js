const customerRoutes = require('express').Router();
const customerCtrl = require('../controller/customer');
const auth = require('../helpers/verifyToken');
const { check } = require('express-validator');

const validateCustomer = [
	check('customer_name', "Customer's name is empty").notEmpty(),
	check('email', 'Email is invalid or empty').isEmail(),
	check('mobile_num', 'Mobile Number is empty').notEmpty(),
	check('address', 'Address is empty').notEmpty(),
];

//register a new customer
customerRoutes.post('/register', validateCustomer, auth, customerCtrl.register);

//get all the customers
customerRoutes.get('/all', auth, customerCtrl.getAll);

//get customer by id
customerRoutes.get('/:id', auth, customerCtrl.getOne);

//update customer by id
customerRoutes.put('/:id', auth, customerCtrl.updateOne);

//delete customer by id
customerRoutes.delete('/:id', auth, customerCtrl.deleteOne);

//delete all customers
customerRoutes.delete('/delete/all', auth, customerCtrl.deleteAll);

module.exports = customerRoutes;
