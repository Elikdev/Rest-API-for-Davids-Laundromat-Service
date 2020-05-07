const models = require('../models/index');
const Staff = models.Staff;
const Wash = models.Wash;
const Customer = models.Customer;
const { validationResult } = require('express-validator');

//get all washes
exports.allWashes = async (req, res) => {
	try {
		const washes = await Wash.find()
			.populate('payment', 'payment_date payment_mode amount')
			.populate('customer', 'email address')
			.populate('staff', 'name');
		if (washes.length <= 0) {
			return res.status(404).json({
				message: 'No records to display... Enter a wash record',
			});
		} else {
			return res.status(200).json({
				message: 'Wash Records',
				Wash_records: washes,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: 'Error in getting wash records',
			Error: error.message,
		});
	}
};

//get wash by Id
exports.getWash = async (req, res) => {
	const id = req.params.id;

	try {
		const wash = await Wash.findOne({ _id: id });
		if (!wash) {
			return res.status(422).json({
				message: 'There is no wash record with such id',
			});
		} else {
			return res.status(200).json({
				message: 'Found wash record',
				wash: wash,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: 'Error in getting wash record',
			error: error.message,
		});
	}
};

//search wash record by a DLSwashID
exports.getWashByDlsId = async (req, res) => {
	const washId = req.body.washId;
	const staffId = req.staff._id;

	const errors = validationResult(req);

	if (!errors.isEmpty())
		return res.status(422).json({
			errors: errors.array(),
		});

	try {
		const wash = await Wash.findOne({ washId: washId })
			.populate('payment', 'payment_date payment_mode amount')
			.populate('customer', 'email address')
			.populate('staff', 'name');

		if (!wash)
			return res.status(404).json({
				message: 'Invalid Wash id',
			});

		return res.status(200).json({
			message: 'Found the wash record',
			wash: wash,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error in getting the wash',
			error: error.message,
		});
	}
};

//new wash
exports.newWash = async (req, res) => {
	const { customer_name, number_of_wash, amount } = req.body;
	const id = req.staff._id;

	//get the validation results
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array(),
		});
	}

	const name = customer_name.toLowerCase();

	//get the customer doc
	const customerDoc = await Customer.findOne({
		customer_name: name,
	});
	if (!customerDoc)
		return res.status(400).json({
			message: 'No customer with such name, register the customer first',
		});

	const date = new Date();
	const washDate = date.toISOString();
	const modifiedAmount = `\u20A6${amount.toString()}`;

	const wash = new Wash({
		customer_name: name,
		washDate,
		number_of_wash,
		amount: modifiedAmount,
	});

	try {
		//save the wash to the databsase then start updating necessary info
		const washDoc = await wash.save();
		if (washDoc) {
			//generate a wash ID for the wash
			const identifier = washDoc._id.toString();
			const washId = `DLS${identifier.substring(0, 10).toUpperCase()}`;

			//update the staff model with the wash
			const updatedStaff = await Staff.findByIdAndUpdate(
				id,
				{ $push: { washes: washDoc._id } },
				{ new: true, useFindAndModify: false }
			);

			//Finally, update the wash with staff id, washID  and customer id
			const updatedWash = await Wash.findByIdAndUpdate(
				{ _id: washDoc._id },
				{ staff: updatedStaff._id, washId, customer: customerDoc._id },
				{ new: true, useFindAndModify: false }
			);

			return res.status(200).json({
				message: 'Yayy!!! New wash has been made. Copy the washId',
				wash: updatedWash,
			});
		}
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

//delete wash by Id
exports.deleteWash = async (req, res) => {
	const id = req.params.id;
	try {
		const deletedWash = await Wash.findByIdAndDelete(id, {
			useFindAndModify: false,
		});
		if (!deletedWash) {
			return res.status(422).json({
				message: 'There is no wash record with such id',
			});
		} else {
			return res.status(200).json({
				message: 'Wash record has been deleted successfully',
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: 'Error in deleting wash record',
			error: error.message,
		});
	}
};

//delete all washes
exports.removeAllWashes = async (req, res) => {
	try {
		const deletedWashes = await Wash.deleteMany({});
		if (deletedWashes) {
			return res.status(200).json({
				message: `${deletedWashes.deletedCount} wash(es) has/have been deleted `,
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Error in deleting washes',
			Error: error.message,
		});
	}
};
