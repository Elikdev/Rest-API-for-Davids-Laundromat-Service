const indexRouter = require('express').Router();
const auth = require('../helpers/verifyToken'); //middleware
const checkStaff = require('../helpers/checkStaff'); //middleware
const { check, body } = require('express-validator');
const models = require('../models/index');
const Staff = models.Staff;

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
	check('mobile_num')
		.isLength({ min: 10, max: 15 })
		.withMessage('Mobile Number must between 10 to 15 characters long')
		.matches(/^[+-\d]+$/)
		.withMessage('Mobile Number must be a valid Nigerian number'),
	check('password', 'Password must be 6 chars long').isLength({ min: 6 }),
	check('address', 'Address is empty').notEmpty(),
	body('email').custom((value) => {
		return Staff.findOne({ email: value }).then((staff) => {
			if (staff) {
				return Promise.reject('E-mail already in use');
			}
		});
	}),
];

const validateLogin = [
	check('email', 'Email is invalid or empty').isEmail(),
	check('password', 'Password must be 6 chars long').isLength({ min: 6 }),
	body('email').custom((value) => {
		return Staff.findOne({ email: value }).then((staff) => {
			if (!staff) {
				return Promise.reject('Email is invalid');
			}
		});
	}),
];

//register a new staff
indexRouter.post('/register', validateRegister, registerStaff);

//sign in staff
indexRouter.post('/signin', validateLogin, signInStaff);

//signout staff
indexRouter.get('/signout', auth, signOutStaff);

//all routes here require auth-token
//get all staffs
indexRouter.get('/all', auth, checkStaff, allStaffs);

//get staff by id
indexRouter.get('/:id', auth, checkStaff, getStaff);

//update staff by id
indexRouter.put('/update/:id', auth, checkStaff, updateStaff);

//delete staff by id
indexRouter.delete('/:id', auth, checkStaff, removeStaff);

//delete all the staffs
indexRouter.delete('/delete/all', auth, checkStaff, removeAllStaffs);

module.exports = indexRouter;
