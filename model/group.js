var mongoose = require('./db.js'),
  schema = require('../schema/group.js'),
  GroupHelper = require('../helper/group.js'),
  Error = require('./error.js');

var _ = {},
  model = mongoose.model('Group', schema),
  ObjectId = mongoose.Schema.ObjectId;

_.pGet = function(user) {
  console.log('Group.pGet');
  console.log(user);
  var query = {
    members: user._id,
    deleted: false
  };
  option = {};
  return new Promise(function(resolve, reject) {
    model.find(query)
      .lean()
      .populate('members')
      .populate('payments')
      .exec(function(err, groups) {
        if (err) return reject(Error.mongoose(500, err));

        console.log('may be groups...');
        console.log(groups);
        resolve(groups);
      });
  });
};

_.pGetOne = function(query) {
  console.log('Group.pGetOne');

  return new Promise(function(resolve, reject) {
    model.findOne(query)
      .lean()
      .populate('members')
      .populate('payments')
      .exec(function(err, group) {
        console.log(group);
        if (err) return reject(Error.mongoose(500, err));
        if (!group) return reject(Error.invalidParameter);

        resolve(group);
      });
  });
};

_.pCreate = function(name, user) {
  console.log('Group.pCreate');
  var query = {
    name: name,
    members: [user._id]
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
  return new Promise(function(resolve, reject) {
    model.findOne(query)
      .exec(function(err, group) {
        if (err) return reject(Error.mongoose(500, err));
        if (!group) return reject(Error.invalidParameter);
        if (group.members.indexOf(user._id) !== -1) {
          return reject(Error.conficts);
        }
        group.members.push(user._id);
        console.log(group);
        group.save(function(err) {
          if (err) return reject(Error.mongoose(500, err));
          model.findOne(query)
            .lean()
            .populate('members')
            .populate('payments')
            .exec(function(err, group) {
              resolve(group);
            });
        });
      });
  });
};

_.pPushPayment = function(groupId, payment) {
  console.log('Group.pPushPayment');
  return new Promise(function(resolve, reject) {
    var groupQuery = {
      uuid: groupId
    };
    model.findOneAndUpdate(groupQuery, {
        $push: {
          payments: payment._id
        }
      }, {
        new: true
      })
      .lean()
      .populate('members')
      .populate('payments')
      .exec(function(err, updatedGroup) {
        if (err) return reject(Error.mongoose(500, err));
        if (!updatedGroup) return reject(Error.invalidParameter);

        resolve(updatedGroup);
      });
  });
}
module.exports = _;
