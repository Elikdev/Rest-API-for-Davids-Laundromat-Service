const washRouter = require('express').Router();
const { check } = require('express-validator');

//controllers
const {
	allWashes,
	getWash,
	getWashByDlsId,
	newWash,
	deleteWash,
	removeAllWashes,
	logger,
} = require('../controller/wash');

//validation
const validateWash = [
	check('customer_name', 'Customer name is empty').notEmpty(),
	check('number_of_wash', 'Number of wash is empty').notEmpty(),
	check('amount', 'Amount is empty').notEmpty(),
];

const validateId = [check('washId', 'washId is empty').notEmpty()];

//get all washes
washRouter.get('/all', allWashes);

//get wash by _id
washRouter.get('/:id', getWash);

//get wash by washId
washRouter.get('/washid/find', validateId, getWashByDlsId);

//make a new wash
washRouter.post('/new', validateWash, newWash);

//delete a wash
washRouter.delete('/:id', deleteWash);

//delete all washes
washRouter.delete('/delete/all', removeAllWashes);

module.exports = washRouter;
