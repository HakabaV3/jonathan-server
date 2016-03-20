var mongoose = require('../model/db.js'),
	uuid = require('node-uuid'),
	Schema = mongoose.Schema;

var GroupSchema = new Schema({
	deleted: {
		type: Boolean,
		default: false
	},
	name: String,
	created: Number,
	updated: Number,
	members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
	uuid: String
});

GroupSchema.pre('save', function(next) {
	now = parseInt(Date.now() / 1000);
	this.updated = now;
	if (!this.created) this.created = now;
	if (!this.uuid) this.uuid = uuid.v4();

	console.log('!!!!!!!!!!! pre save !!!!!!!!!!!!!');
	next();
});

module.exports = GroupSchema;
