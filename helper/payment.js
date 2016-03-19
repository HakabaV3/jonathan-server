var _ = {};

_.formatPayment = function(payment) {
	return {
		id: payment.uuid,
		title: payment.title,
		price: payment.price,
		created: payment.created,
		updated: payment.updated
	};
}

_.formatPayments = function(payments) {
	return payments.map(payment => _.formatPayment(payment));
}

module.exports = _;
