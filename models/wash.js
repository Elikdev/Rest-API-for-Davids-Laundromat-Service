const mongoose = require('mongoose');

const WashSchema = mongoose.Schema({
	customer_name: {
		type: String,
		required: true,
	},
	number_of_wash: {
		type: Number,
		required: true,
	},
	washDate: {
		type: String,
		required: true,
	},
	washId: {
		type: String,
	},
	payment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Payment',
	},
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Customer',
	},
	staff: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Staff',
	},
});

module.exports = mongoose.model('Wash', WashSchema);
