const washRouter = require('express').Router();
const auth = require('../helpers/verifyToken'); //middleware
const { check } = require('express-validator');

//controllers
const {
	allWashes,
	getWash,
	getWashByDlsId,
	newWash,
	deleteWash,
	removeAllWashes,
} = require('../controller/wash');

//validation
const validateWash = [
	check('customer_name', 'Customer name is empty').notEmpty(),
	check('number_of_wash', 'Number of wash is empty').notEmpty(),
	check('amount', 'Amount is empty').notEmpty(),
];

const validateId = [check('washId', 'washId is empty').notEmpty()];

//All routes here require auth-token
//get all washes
washRouter.get('/all', auth, allWashes);

//get wash by _id
washRouter.get('/:id', auth, getWash);

//get wash by washId
washRouter.get('/washid/find', validateId, auth, getWashByDlsId);

//make a new wash
washRouter.post('/new', validateWash, auth, newWash);

//delete a wash
washRouter.delete('/:id', auth, deleteWash);

//delete all washes
washRouter.delete('/delete/all', auth, removeAllWashes);

module.exports = washRouter;
