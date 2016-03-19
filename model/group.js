var mongoose = require('./db.js'),
  schema = require('../schema/group.js'),
  GroupHelper = require('../helper/group.js'),
  Error = require('./error.js');

var _ = {},
  model = mongoose.model('Group', schema);

_.pGet = function(userId) {
  console.log('Group.pGet');
  console.log(userId);
  var query = {
    members: {
      $elemMatch: {
        uuid: userId
      }
    },
    deleted: false
  };
  option = {};
  return new Promise(function(resolve, reject) {
    model.find(query, {}, option, function(err, groups) {
      if (err) return reject(Error.mongoose(500, err));

      resolve(groups);
    });
  });
};

_.pGetOne = function(query) {
  console.log('Group.pGetOne');

  return new Promise(function(resolve, reject) {
    model.findOne(query, function(err, group) {
      console.log(group);
      if (err) return reject(Error.mongoose(500, err));
      if (!group) return reject(Error.invalidParameter);

      resolve(group);
    });
  });
};

_.pCreate = function(name, users) {
  console.log('Group.pCreate');
  console.log(users);
  var query = {
    name: name,
    members: users
  };
  console.log(query);
  return new Promise(function(resolve, reject) {
    new model(query)
      .save(function(err, createdGroup) {
        if (err) return reject(Error.mongoose(500, err));
        if (!createdGroup) return reject(Error.invalidParameter);

        return resolve(createdGroup);
      });
  });
};

_.pipeSuccessRender = function(req, res, group) {
  console.log('Group.pipeSuccessRender\n');
  return res.ok(200, {
    group: GroupHelper.formatGroup(group)
  });
};

_.pipeSuccessRenderAll = function(req, res, groups) {
  console.log('Group.pipeSuccessRendeAll\n');
  return res.ok(200, {
    groups: GroupHelper.formatGroups(groups)
  });
};


_.pPushUser = function(query, user) {
  console.log('Group.pPushUser');
  return _.pGetOne(query).then(group => {
    return new Promise(function(resolve, reject) {
      var groupQuery = {
        uuid: group.uuid
      };

      model.findOneAndUpdate(groupQuery, {
        $push: {
          members: user
        }
      }, {
        new: true
      }, function(err, updatedGroup) {
        if (err) return reject(Error.mongoose(500, err));
        if (!updatedGroup) return reject(Error.invalidParameter);

        resolve(updatedGroup);
      });
    });
  });
};

_.pPushPayment = function(query, payment) {
  console.log('Group.pPushPayment');
  return _.pGetOne(query).then(group => {
    return new Promise(function(resolve, reject) {
      var groupQuery = {
        uuid: group.uuid
      };

      model.findOneAndUpdate(groupQuery, {
        $push: {
          payments: payment
        }
      }, {
        new: true
      }, function(err, updatedGroup) {
        if (err) return reject(Error.mongoose(500, err));
        if (!updatedGroup) return reject(Error.invalidParameter);

        resolve(updatedGroup);
      });
    });
  });
}
module.exports = _;
