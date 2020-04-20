const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema(
	{
		customer_name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		mobile_num: {
			type: Number,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		washes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Wash',
			},
		],
		payments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Payment',
			},
		],
	},
	{
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
	}
);

module.exports = mongoose.model('Customer', CustomerSchema);
