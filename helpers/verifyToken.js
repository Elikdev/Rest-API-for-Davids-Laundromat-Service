const jwt = require('jsonwebtoken');
const config = require('../configs/config');
const routes = require('../constants/routesGroup');
const models = require('../models/index');
const Staff = models.Staff;

exports.verifyToken = (req, res, next) => {
	if (!routes.unsecureRoutes.includes(req.path)) {
		const token = req.header('auth-token');
		if (!token) {
			return res.status(401).json({
				message: 'Access denied!!! Please sign up or sign in',
			});
		} else {
			try {
				const grantAccess = jwt.verify(token, config.SECRET_TOKEN);
				req.staff = grantAccess;
				next();
				return;
			} catch (error) {
				return res.status(403).json({
					message: 'Invalid token!!!',
				});
			}
		}
	} else {
		next();
	}
};

exports.checkStaff = (req, res, next) => {
	if (req.staff) {
		const staffId = req.staff._id;
		try {
			//check if the staff making the request is still a registered staff
			Staff.findById(staffId)
				.then((registeredStaff) => {
					if (!registeredStaff) {
						return res
							.status(401)
							.json({ message: 'Sorry, you do not have access to this route' });
					} else {
						next();
					}
				})
				.catch((err) => {
					return res.status(500).json({
						message: err.message,
					});
				});
		} catch (error) {
			return res.status(500).json({
				message: 'error',
				error: error.message,
			});
		}
	} else {
		next();
	}
};
