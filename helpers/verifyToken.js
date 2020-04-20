const jwt = require('jsonwebtoken');
const config = require('../configs/config');

module.exports = (req, res, next) => {
	const token = req.header('auth-token');
	if (!token) {
		return res.status(401).json({
			message: 'Access denied!!!!! Please sign up or sign in',
		});
	}

	try {
		const grantAccess = jwt.verify(token, config.SECRET_TOKEN);
		req.staff = grantAccess;
		next();
	} catch (error) {
		res.status(403).json({
			message: 'Invalid token!!!',
		});
	}
};
