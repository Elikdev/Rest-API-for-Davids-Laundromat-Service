const mongoose = require('mongoose');

const StaffSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		mobile_num: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		resumption_date: {
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

module.exports = mongoose.model('Staff', StaffSchema);
