const models = require('../models/index');
const Wash = models.Wash;
const Payment = models.Payment;
const Customer = models.Customer;
const Staff = models.Staff;
const { validationResult } = require('express-validator');

//get all payments made
exports.getPayments = async (req, res) => {
	try {
		const payments = await Payment.find()
			.populate('wash', 'washDate')
			.populate('staff', 'name');
		if (payments.length <= 0) {
			return res
				.status(400)
				.json({ message: 'No payment has been made with this app' });
		} else {
			return res.status(200).json({
				message: 'Found Payments',
				payments: payments,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: 'Error in getting payments',
			error: error.message,
		});
	}
};

//get a single payment
exports.getPaymentById = async (req, res) => {
	const id = req.params.id;

	try {
		const payment = await Payment.findById(id)
			.populate('wash', 'washId washDate')
			.populate('staff', 'name');
		if (!payment) {
			return res.status(404).json({ message: 'No payment with such id' });
		} else {
			return res.status(200).json({ message: 'Found payment', payment });
		}
	} catch (error) {
		return res.status(500).json({
			error: 'Error in getting payment',
			error: error.message,
		});
	}
};

//a new payment
exports.newPayment = async (req, res) => {
	try {
		const id = req.staff._id;
		const { payment_mode, washId } = req.body;

		//get the validation results
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({
				errors: errors.array(),
			});
		}

		//check the validity of the wash Id
		const washDoc = await Wash.findOne({ washId: washId });
		if (!washDoc) return res.status(400).json({ message: 'Invalid washId' });

		///check if the washId has been generated before
		const checkWashId = await Payment.findOne({ washId: washId });
		if (checkWashId)
			return res.status(400).json({
				message: 'WashId has been used, generate a new one!',
			});

		//modify the date

		const date = new Date();
		const payment_date = date.toISOString();

		const payment = new Payment({
			washId,
			amount: washDoc.amount,
			customer_name: washDoc.customer_name, //extract the name of the customer from the washDoc
			payment_mode,
			payment_date,
		});

		//get the customer doc
		const customerDoc = await Customer.findOne({
			customer_name: washDoc.customer_name,
		});
		if (!customerDoc)
			return res.status(400).json({
				message: 'No customer with such name, register the customer first',
			});

		//save the payment to database and update it as well
		const savedPayment = await payment.save();
		if (savedPayment) {
			//update the payment in the staff model
			const updatedStaff = await Staff.findByIdAndUpdate(
				id,
				{ $push: { payments: savedPayment._id } },
				{ new: true, useFindAndModify: false }
			);

			//update the wash in the customer model
			const updatedCustomer = await Customer.findByIdAndUpdate(
				customerDoc._id,
				{ $push: { washes: washDoc._id, payments: savedPayment._id } },
				{ new: true, useFindAndModify: false }
			);

			//update payment in the wash model
			const updatedWash = await Wash.findByIdAndUpdate(
				washDoc._id,
				{
					payment: savedPayment._id,
				},
				{ new: true, useFindAndModify: false }
			);

			//update with staff that made the payment
			const updatedPayment = await Payment.findByIdAndUpdate(
				savedPayment._id,
				{ staff: id, wash: washDoc._id },
				{ new: true, useFindAndModify: false }
			);

			return res.status(201).json({
				message: 'Successful payment',
				updatedPayment,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: 'error in recording payment',
			error: error.message,
		});
	}
};

//delete a payment
exports.deletePaymentById = async (req, res) => {
	const id = req.params.id;

	try {
		const deletedPayment = await Payment.findByIdAndRemove(id, {
			useFindAndModify: false,
		});

		if (!deletedPayment) {
			return res.status(404).json({
				message: 'Error!!! no payment with such id',
			});
		} else {
			return res.status(200).json({
				message: 'Payment has been deleted',
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Error in deleting payment',
			error: error.message,
		});
	}
};

//delete all payments
exports.deleteAllPayments = async (req, res) => {
	try {
		const deletedPayments = await Payment.deleteMany({});

		return res.status(200).json({
			message: `${deletedPayments.deletedCount} payment(s) has/have been deleted`,
		});
	} catch (error) {
		res.status(500).json({
			message: 'Error in deleting payments',
			error: error.message,
		});
	}
};
