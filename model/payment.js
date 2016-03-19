var mongoose = require('./db.js'),
  schema = require('../schema/payment.js'),
  Error = require('./error.js');

var _ = {},
  model = mongoose.model('Payment', schema);

_.pGetOne = function(paymentId) {
  console.log('Payment.pGetOne');
	var query = {
    uuid: paymentId,
    deleted: false
  };
  return new Promise(function(resolve, reject) {
    model.findOne(query, function(err, payment) {
      console.log(payment);
      if (err) return reject(Error.mongoose(500, err));
      if (!payment) return reject(Error.invalidParameter);

      resolve(payment);
    });
  });
};

_.pCreate = function(query) {
  console.log('Payment.pCreate');
  console.log(query);
  return new Promise(function(resolve, reject) {
    new model(query)
      .save(function(err, createdPayment) {
        if (err) return reject(Error.mongoose(500, err));
        if (!createdPayment) return reject(Error.invalidParameter);

        return resolve(createdPayment);
      });
  });
};
module.exports = _;
