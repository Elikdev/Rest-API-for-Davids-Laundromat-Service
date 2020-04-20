const mongoose = require('mongoose');

const PaymentSchema = mongoose.Schema({
	payment_date: {
		type: String,
		required: true,
	},
	amount: {
		type: String,
		required: true,
	},
	payment_mode: {
		type: String,
		required: true,
	},
	customer_name: {
		type: String,
		required: true,
	},
	washId: {
		type: String,
		required: true,
	},
	wash: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Wash',
	},
	staff: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Staff',
	},
});

module.exports = mongoose.model('Payment', PaymentSchema);
