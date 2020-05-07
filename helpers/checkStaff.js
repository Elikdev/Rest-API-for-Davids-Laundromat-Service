const models = require('../models/index');
const Staff = models.Staff;

module.exports = (req, res, next) => {
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
				res.status(500).json({
					message: err.message,
				});
			});
	} catch (error) {
		res.status(500).json({
			message: 'Error in verifying user',
			error: error.message,
		});
	}
};
