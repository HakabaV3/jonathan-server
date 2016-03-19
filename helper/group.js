var _ = {},
  UserHelper = require('./user.js'),
  PaymentHelper = require('./payment.js');

_.formatGroup = function(group) {
  return {
    id: group.uuid,
    name: group.name,
    menbers: UserHelper.formatUsers(group.members),
    payments: PaymentHelper.formatPayments(group.payments),
    created: group.created,
    updated: group.updated
  };
}

_.formatGroups = function(groups) {
  return groups.map(group => _.formatGroup(group));
}

module.exports = _;
