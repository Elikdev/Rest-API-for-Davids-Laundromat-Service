const indexRouter = require('express').Router();
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
indexRouter.post('/signup', validateRegister, registerStaff);

//sign in staff
indexRouter.post('/signin', validateLogin, signInStaff);

//signout staff
indexRouter.get('/signout', signOutStaff);

//get all staffs
indexRouter.get('/all', allStaffs);

//get staff by id
indexRouter.get('/:id', getStaff);

//update staff by id
indexRouter.put('/update/:id', updateStaff);

//delete staff by id
indexRouter.delete('/:id', removeStaff);

//delete all the staffs
indexRouter.delete('/delete/all', removeAllStaffs);

module.exports = indexRouter;
