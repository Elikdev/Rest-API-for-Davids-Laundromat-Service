const washRouter = require('express').Router();
const controllers = require('../controller/wash');
const auth = require('../helpers/verifyToken');

//get all washes
washRouter.get('/all', auth, controllers.allWashes);

//make a new wash
washRouter.post('/new', auth, controllers.newWash);

//delete all washes
washRouter.delete('/delete/all', auth, controllers.removeAllWashes);

module.exports = washRouter;
