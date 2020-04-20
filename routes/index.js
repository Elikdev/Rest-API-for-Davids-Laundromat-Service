const indexRouter = require('express').Router();
const controllers = require('../controller/index');
const auth = require('../helpers/verifyToken');
const { check } = require('express-validator');

const validateRegister = [
	check('email', 'Email is invalid or empty').isEmail(),
	check('name', 'Name is empty').notEmpty(),
	check('mobile_num', 'Mobile number is empty').notEmpty(),
	check('password', 'Password must be 6 chars long').isLength({ min: 6 }),
	check('address', 'Address is empty').notEmpty(),
];
const validateLogin = [
	check('email', 'Email is invalid or empty').isEmail(),
	check('password', 'Password must be 6 chars long').isLength({ min: 6 }),
];

//register a new staff
indexRouter.post('/register', validateRegister, controllers.registerStaff);

//sign in staff
indexRouter.post('/signin', validateLogin, controllers.signInStaff);

//get all staffs
indexRouter.get('/staffs', auth, controllers.allStaffs);

//get staff by id
indexRouter.get('/:id', auth, controllers.getStaff);

//signout staff
indexRouter.get('/signout', controllers.signOutStaff);

//update staff by id
indexRouter.put('/update/:id', auth, controllers.updateStaff);

//delete staff by id
indexRouter.delete('/:id', auth, controllers.removeStaff);

//delete all the staffs
indexRouter.delete('/delete/all', auth, controllers.removeAllStaffs);

module.exports = indexRouter;
