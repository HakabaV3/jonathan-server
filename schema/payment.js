var mongoose = require('../model/db.js'),
	uuid = require('node-uuid');

var PaymentSchema = new mongoose.Schema({
	deleted: {
		type: Boolean,
		default: false
	},
	price: Number,
	payerId: String,
	title: String,
	uuid: String,
	created: Number,
	updated: Number
});

PaymentSchema.pre('save', function(next) {
	now = parseInt(Date.now() / 1000);
	this.updated = now;
	if (!this.created) this.created = now;
	if (!this.uuid) this.uuid = uuid.v4();

	next();
});

module.exports = PaymentSchema;
