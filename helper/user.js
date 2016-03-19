var _ = {};

_.formatUser = function(user) {
	return {
		id: user.uuid,
		name: user.name,
		token: user.token,
		created: user.created,
		updated: user.updated
	};
}

_.formatUsers = function(users) {
	return users.map(user => _.formatUser(user));
}

module.exports = _;
