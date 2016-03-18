var mongoose = require('./db.js'),
  schema = require('../schema/group.js'),
  Error = require('./error.js');

var _ = {},
  model = mongoose.model('Group', schema);

_.pGet = function(userId) {
  console.log('Group.pGet');
  console.log(userId);
  var query = {
    menmers: {
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

_.pGetOne = function(query, user) {
  console.log('Group.pGetOne');
  if (user) {
    query.$or = [{
      players: user.name
    }, {
      guests: user.name
    }];
  }

  return new Promise(function(resolve, reject) {
    model.findOne(query, function(err, group) {
      console.log(group);
      if (err) return reject(Error.mongoose(500, err));
      if (!group) return reject(Error.invalidParameter);

      resolve(group);
    });
  });
};

_.pCreate = function(users) {
  console.log('Group.pCreate');
  console.log(users.map(user => user.name));
  var query = {
    turn: users[0].name,
    players: users.map(user => user.name)
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
  group.board = _filterBoardByPlatform(req.headers['x-platform'], group);
  var groupObj = {
    id: group.uuid,
    players: group.players,
    guests: group.guests,
    turn: group.turn,
    moves: group.moves.map(function(move) {
      return {
        x: move.x,
        y: move.y,
        player: move.player,
        playerId: move.playerId,
        created: move.created
      }
    }),
    board: group.board,
    chats: group.chats.map(function(chat) {
      return {
        player: chat.player,
        playerId: chat.playerId,
        text: chat.text,
        created: chat.created
      }
    }),
    created: group.created,
    updated: group.updated
  };
  return res.ok(200, {
    group: groupObj
  });
};

_.pipeSuccessRenderAll = function(req, res, groups) {
  console.log('Group.pipeSuccessRendeAll\n');
  return res.ok(200, {
    groups: groups.map(function(group) {
      group.board = _filterBoardByPlatform(req.headers['x-platform'], group);
      return {
        id: group.uuid,
        name: group.name,
        menbers: group.members,
				payments: group.payments,
        created: group.created,
        updated: group.updated
      };
    })
  });
};

_.pPutMove = function(px, py, group) {
  console.log('Group.pPutMove');
  return new Promise(function(resolve, reject) {
    console.log(`${group}\n${AuthHelper.currentUser}`);
    if (group.turn !== AuthHelper.currentUser.name) return reject(Error.invalidPlayer(AuthHelper.currentUser.name));
    console.log('Group.pPutMove');
    if (!GroupHelper.checkIsPuttable(px, py, group.board, group.players, AuthHelper.currentUser.name)) return reject(Error.invalidMove(px, py));

    console.log('Group.pPutMove');
    var enemyName = group.players[0] === AuthHelper.currentUser.name ? group.players[1] : group.players[0],
      board = GroupHelper.putMove(px, py, group.board, group.players, AuthHelper.currentUser.name),
      turn = GroupHelper.checkIsEnablePlayerToPut(board, group.players, enemyName) ? enemyName : AuthHelper.currentUser.name,
      groupQuery = {
        uuid: group.uuid
      },
      move = new moveModel({
        x: px,
        y: py,
        groupId: group.uuid,
        playerId: AuthHelper.currentUser.uuid,
        player: AuthHelper.currentUser.name,
        created: parseInt(Date.now() / 1000),
        updated: parseInt(Date.now() / 1000)
      });
    console.log('Group.pPutMove');
    model.findOneAndUpdate(groupQuery, {
      turn: turn,
      board: board,
      $push: {
        moves: move
      }
    }, {
      safe: true,
      new: true
    }, function(err, updatedGroup) {
      console.log('Group.pPutMove');
      if (err) return reject(Error.mongoose(500, err));
      if (!updatedGroup) return reject(Error.invalidParameter);
      console.log('Group.pPutMove');

      resolve(updatedGroup);
    });
  });
};

_.pPushChat = function(groupObj, text) {
  console.log('Group.pPushChat');
  groupObj.chats.push({
    groupId: groupObj.uuid,
    player: AuthHelper.currentUser.name,
    playerId: AuthHelper.currentUser.uuid,
    text: text,
    created: parseInt(Date.now() / 1000)
  });
  return new Promise(function(resolve, reject) {
    var groupQuery = {
        uuid: groupObj.uuid,
        $or: [{
          players: AuthHelper.currentUser.name
        }, {
          guests: AuthHelper.currentUser.name
        }]
      },
      chatQuery = groupObj.chats[groupObj.chats.length - 1];

    model.findOneAndUpdate(groupQuery, {
      $push: {
        chats: chatQuery
      }
    }, {
      safe: true,
      new: true
    }, function(err, updatedGroup) {
      if (err) return reject(Error.mongoose(500, err));
      if (!updatedGroup) return reject(Error.invalidParameter);

      resolve(updatedGroup);
    });
  });
};

_.pPushGuest = function(groupObj, guestName) {
  console.log('Group.pPushGeust');
  return new Promise(function(resolve, reject) {
    groupObj.guests.push(guestName);
    groupObj.save(function(err, updatedGroup) {
      if (err) return reject(Error.mongoose(500, err));
      if (!updatedGroup) return reject(Error.invalidParameter);

      resolve(updatedGroup);
    });
  });
};

function _filterBoardByPlatform(platform, group) {
  if (platform == 'ios') {
    var move = GroupHelper.lastMove(group);
    if (move) group.board[move.y * 10 + move.x] = 11 * GroupHelper.colorOfMove(group, move);
    group.board = GroupHelper.addPuttablePointsToBoard(group.board, group.players, AuthHelper.currentUser.name);
  }
  console.log(platform);
  return group.board;
}

module.exports = _;
