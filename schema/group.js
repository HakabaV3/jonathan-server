var mongoose = require('../model/db.js'),
	uuid = require('node-uuid'),
	userSchema = require('./user.js'),
	paymentSchema = require('./payment.js');

var GroupSchema = new mongoose.Schema({
	deleted: {
		type: Boolean,
		default: false
	},
	name: String,
	created: Number,
	updated: Number,
	members: [userSchema],
	payments: [paymentSchema],
	uuid: String
});

GroupSchema.pre('save', function(next) {
	now = parseInt(Date.now() / 1000);
	this.updated = now;
	if (!this.created) this.created = now;
	if (!this.endTime) this.endTime = now;
	if (!this.uuid) this.uuid = uuid.v4();

	next();
});

module.exports = GroupSchema;
