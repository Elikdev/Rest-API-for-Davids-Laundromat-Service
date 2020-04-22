const models = require('../models/index');
const Customer = models.Customer;
const Staff = models.Staff;
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
	const staffId = req.staff._id;

	//check if the staff making the request is still a registered staff
	const registeredStaff = await Staff.findById(staffId);
	if (!registeredStaff)
		return res
			.status(401)
			.json({ message: 'Sorry, you do not have access to this route' });

	try {
		const customers = await Customer.find()
			.populate('washes', 'washDate washId number_of_wash')
			.populate('payments', 'payment_date amount payment_mode');
		if (customers.length <= 0) {
			return res.status(404).json({
				message: 'No record of customers to display... Register a customer',
			});
		} else {
			return res.status(200).json({
				message: 'Registered customers',
				customers: customers,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

exports.register = async (req, res) => {
	const { customer_name, email, mobile_num, address } = req.body;

	const staffId = req.staff._id;

	//check if the staff making the request is still a registered staff
	const registeredStaff = await Staff.findById(staffId);
	if (!registeredStaff)
		return res
			.status(401)
			.json({ message: 'Sorry, you do not have access to this route' });

	//get the validation results
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array(),
		});
	}

	///check if a customer email has been registered before
	const found = await Customer.findOne({ email: email });
	if (found)
		return res.status(422).json({
			message:
				'Customer with the same email as been registered... try another email or update existing customer',
		});

	//modify the mobile number to a nigerian number
	modifiedNum = `(+234)-${mobile_num}`;

	const name = customer_name.toLowerCase();
	const user = new Customer({
		customer_name: name,
		email,
		mobile_num: modifiedNum,
		address,
	});

	try {
		const newCustomer = await user.save();
		res.status(201).json({
			message: 'Successfully created a new Customer',
			customer: newCustomer,
		});
	} catch (error) {
		res.status(500).json({
			message: 'Error in creating user!',
			error: error.message,
		});
	}
};

exports.getOne = async (req, res) => {
	const id = req.params.id;
	const staffId = req.staff._id;

	//check if the staff making the request is still a registered staff
	const registeredStaff = await Staff.findById(staffId);
	if (!registeredStaff)
		return res
			.status(401)
			.json({ message: 'Sorry, you do not have access to this route' });

	try {
		const customer = await Customer.findById(id)
			.populate('washes', 'washDate washId')
			.populate('payments', 'payment_date amount payment_mode');

		if (!customer) {
			return res.status(404).json({
				message: 'No customer with such id was found in the database',
			});
		} else {
			return res.status(200).json({
				message: 'Found customer',
				customer: customer,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

exports.updateOne = async (req, res) => {
	const id = req.params.id;
	const staffId = req.staff._id;

	//check if the staff making the request is still a registered staff
	const registeredStaff = await Staff.findById(staffId);
	if (!registeredStaff)
		return res
			.status(401)
			.json({ message: 'Sorry, you do not have access to this route' });

	try {
		const customer = await Customer.findByIdAndUpdate(id, req.body, {
			new: true,
			useFindAndModify: false,
		});

		if (customer) {
			res.status(200).json({
				Message: `Customer with id - ${id} has been updated successfully!`,
				Customer: customer,
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Error in updating the user',
			error: error.message,
		});
	}
};

exports.deleteOne = async (req, res) => {
	const id = req.params.id;
	const staffId = req.staff._id;

	//check if the staff making the request is still a registered staff
	const registeredStaff = await Staff.findById(staffId);
	if (!registeredStaff)
		return res
			.status(401)
			.json({ message: 'Sorry, you do not have access to this route' });
	try {
		const deletedCustomer = await Customer.findByIdAndRemove(id, {
			useFindAndModify: false,
		});

		if (deletedCustomer) {
			res.status(200).json({
				Message: `Customer with id - ${id} has been deleted successfully!`,
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Error in deleting the customer',
			error: error.message,
		});
	}
};

exports.deleteAll = async (req, res) => {
	const staffId = req.staff._id;

	//check if the staff making the request is still a registered staff
	const registeredStaff = await Staff.findById(staffId);
	if (!registeredStaff)
		return res
			.status(401)
			.json({ message: 'Sorry, you do not have access to this route' });
	try {
		const deletedCustomers = await Customer.deleteMany({});

		if (deletedCustomers) {
			res.status(200).json({
				Message: `${deletedCustomers.deletedCount} customer(s) has/have been deleted successfully!`,
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Error in deleting the customers',
			error: error.message,
		});
	}
};
