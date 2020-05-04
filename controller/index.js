//declare all your const here
const models = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = models.Staff;
const config = require('../configs/config');
const { validationResult } = require('express-validator');

//get all the staffs
exports.allStaffs = async (req, res) => {
	try {
		const staffs = await Staff.find()
			.populate('washes', 'washDate washId')
			.populate('payments', 'payment_date amount payment_mode');
		if (staffs <= 0) {
			return res.status(400).json({
				message: 'No staff record to display...Register a staff',
			});
		} else {
			return res.status(200).json({
				message: 'Registered Staffs',
				staffs: staffs,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

//get a staff by Id
exports.getStaff = async (req, res) => {
	try {
		const id = req.params.id;

		const staff = await Staff.findById(id)
			.populate('washes', 'washDate washId')
			.populate('payments', 'payment_date amount payment_mode');
		if (!staff) {
			return res.status(400).json({
				message: 'Staff not found.. check the Id properly',
			});
		} else {
			return res.status(200).json({
				message: 'Found staff',
				staff: staff,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: 'Error in getting the user',
			error: error.message,
		});
	}
};

//register a Staff / sign-up
exports.registerStaff = async (req, res) => {
	const { name, email, password, mobile_num, address } = req.body;

	//get the validation results
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array(),
		});
	}

	//hash the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	//get the date and store it as string in the database
	const date = new Date();
	const resumption_date = date.toDateString();

	//modify the mobile number to a nigerian number
	modifiedNum = `(+234)-${mobile_num}`;

	const newStaff = new Staff({
		name,
		email,
		password: hashedPassword,
		mobile_num: modifiedNum,
		address,
		resumption_date,
	});

	//Generate a token for the staff and save to the headers
	const accesstoken = await jwt.sign(
		{ _id: newStaff._id },
		config.SECRET_TOKEN,
		{ expiresIn: '1d' }
	);
	res.header('auth-token', accesstoken);

	try {
		const staffDoc = await newStaff.save();
		if (staffDoc) {
			return res.status(201).json({
				message: 'New staff created successfully',
				Staff: staffDoc._id,
				accesstoken: accesstoken,
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Error in creating staff',
			error: error.message,
		});
	}
};

//sign in staff
exports.signInStaff = async (req, res) => {
	const { email, password } = req.body;
	const errors = validationResult(req);
	try {
		//get the validation results

		if (!errors.isEmpty()) {
			return res.status(422).json({
				errors: errors.array(),
			});
		}

		const validEmail = await Staff.findOne({ email: email });

		//compare password
		const validPassword = await bcrypt.compare(password, validEmail.password);
		if (!validPassword)
			return res.status(401).json({ message: 'Invalid Password' });

		///generate a token for the staff
		const accesstoken = await jwt.sign(
			{ _id: validEmail._id },
			config.SECRET_TOKEN,
			{ expiresIn: '1d' }
		);
		res.header('auth-token', accesstoken);

		return res.status(200).json({
			message: 'Staff signed in successfully',
			Staff: validEmail,
			accesstoken,
		});
	} catch (error) {
		res.status(500).json({
			message: 'Error in signing staff in',
			error: error.message,
		});
	}
};

//update staff
exports.updateStaff = async (req, res) => {
	const id = req.params.id;

	try {
		const updatedStaff = await Staff.findByIdAndUpdate(id, req.body, {
			new: true,
			useFindAndModify: false,
		});
		if (!updatedStaff) {
			return res.status(400).json({
				message: 'No staff with such Id',
			});
		} else {
			return res.status(201).json({
				message: 'Staff has been updated successfully',
				staff: updatedStaff,
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Error in updating staff',
			error: error.message,
		});
	}
};

//delete staff by id
exports.removeStaff = async (req, res) => {
	const id = req.params.id;

	try {
		const deletedStaff = await Staff.findByIdAndDelete(id, {
			useFindAndModify: false,
		});
		if (!deletedStaff) {
			return res.status(400).json({
				message: 'No staff with such Id',
			});
		} else {
			return res.status(200).json({
				message: 'Staff deleted successfully',
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: 'Error in deleting staff',
			error: error.message,
		});
	}
};

//delete all staffs
exports.removeAllStaffs = async (req, res) => {
	try {
		const deletedStaffs = await Staff.deleteMany({});
		if (deletedStaffs) {
			return res.status(200).json({
				message: `${deletedStaffs.deletedCount} staff(s) has/have been deleted `,
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Error in deleting staffs',
			Error: error.message,
		});
	}
};

//Sign out staff
exports.signOutStaff = async (req, res) => {
	delete req.header('auth-token');

	res.status(200).json({
		message: 'Staff signed out Successfully!!',
	});
};
