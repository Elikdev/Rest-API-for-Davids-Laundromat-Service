const models = require('../models/index');
const Staff = models.Staff;
const Wash = models.Wash;
const Customer = models.Customer;

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

//new wash
exports.newWash = async (req, res) => {
	const { customer_name, number_of_wash } = req.body;
	const id = req.staff._id;

	const name = customer_name.toLowerCase();

	const registeredStaff = await Staff.findById(id);
	if (!registeredStaff)
		return res
			.status(401)
			.json({ message: 'Sorry, you do not have access to this route' });

	//get the customer doc
	const customerDoc = await Customer.findOne({
		customer_name: name,
	});
	if (!customerDoc)
		return res.status(400).json({
			message: 'No customer with such name, register the customer first',
		});

	const date = new Date();
	const washDate = date.toString();

	const wash = new Wash({
		customer_name: name,
		washDate,
		number_of_wash,
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
				{ staff: registeredStaff._id, washId, customer: customerDoc._id },
				{ new: true, useFindAndModify: false }
			);

			return res.status(200).json({
				message: 'Yayy!!! New wash has been made',
				wash: updatedWash,
			});
		}
	} catch (error) {
		res.status(500).json({
			message: error.message,
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
