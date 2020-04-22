const indexRouter = require('express').Router();
const auth = require('../helpers/verifyToken'); //middleware
const { check } = require('express-validator');

//controllers
const {
	registerStaff,
	signInStaff,
	allStaffs,
	getStaff,
	signOutStaff,
	updateStaff,
	removeStaff,
	removeAllStaffs,
} = require('../controller/index');

//validation
const validateRegister = [
	check('email', 'Email is invalid or empty').isEmail(),
	check('name', 'Name is empty').notEmpty(),
	check(
		'mobile_num',
		'Mobile Number must be a nigerian number, starting with the second digit and must be 10 digits long(e.g 9156435672)'
	).isLength({ min: 10, max: 10 }),
	check('password', 'Password must be 6 chars long').isLength({ min: 6 }),
	check('address', 'Address is empty').notEmpty(),
];

const validateLogin = [
	check('email', 'Email is invalid or empty').isEmail(),
	check('password', 'Password must be 6 chars long').isLength({ min: 6 }),
];

//register a new staff
indexRouter.post('/register', validateRegister, registerStaff);

//sign in staff
indexRouter.post('/signin', validateLogin, signInStaff);

//signout staff
indexRouter.get('/signout', auth, signOutStaff);

//all routes here require auth-token
//get all staffs
indexRouter.get('/all', auth, allStaffs);

//get staff by id
indexRouter.get('/:id', auth, getStaff);

//update staff by id
indexRouter.put('/update/:id', auth, updateStaff);

//delete staff by id
indexRouter.delete('/:id', auth, removeStaff);

//delete all the staffs
indexRouter.delete('/delete/all', auth, removeAllStaffs);

module.exports = indexRouter;
