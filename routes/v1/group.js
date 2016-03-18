var express = require('express'),
  router = express.Router(),
  Auth = require('../../model/auth.js'),
  User = require('../../model/user.js'),
  Group = require('../../model/group.js'),
  Error = require('../../model/error.js');

router.get('/', function(req, res) {
  var authQuery = {
    token: req.headers['x-session-token']
  }
  Auth.pGetOne(authQuery)
    .then(auth => Group.pGet(auth.userId))
    .then(groups => Group.pipeSuccessRenderAll(req, res, groups))
    .catch(error => Error.pipeErrorRender(req, res, error))
})

//
// /******************************
//  * O/R mapper
//  ******************************/
//
// router.get('/:gameId', function(req, res) {
//   var authQuery = {
//       token: req.headers['x-session-token']
//     },
//     gameQuery = {
//       uuid: req.params.gameId
//     };
//   Auth.pGetOne(authQuery)
//     .then(auth => Game.pGetOne(gameQuery, auth.userId))
//     .then(game => Game.pipeSuccessRender(req, res, game))
//     .catch(error => Error.pipeErrorRender(req, res, error))
// })
//
router.post('/', function(req, res) {
  var authQuery = {
      token: req.headers['x-session-token']
    },
    userQuery = {
      deleted: false
    };

  Auth.pGetOne(authQuery)
    .then(auth => User.pGetOne(userQuery, auth, req))
    .then(user => Group.pCreate(user))
    .then(group => Group.pipeSuccessRender(req, res, group))
    .catch(error => Error.pipeErrorRender(req, res, error))
})
//
// router.post('/:gameId/join', function(req, res) {
//   var authQuery = {
//       token: req.headers['x-session-token']
//     },
//     userQuery = {
//       deleted: false
//     },
//     gameQuery = {
//       scene: 0,
//       uuid: req.params.gameId
//     };
//   Auth.pGetOne(authQuery)
//     .then(auth => User.pGetOne(userQuery, auth, req))
//     .then(user => Game.pGetOne(gameQuery))
//     .then(game => Game.pPushPlayer(game, req.jonathanSession.currentUser))
//     .then(game => Game.pipeSuccessRender(req, res, game))
//     .catch(error => Error.pipeErrorRender(req, res, error))
// });
//
// router.post('/:gameId/invitation', function(req, res) {
//   var authQuery = {
//       token: req.headers['x-session-token']
//     },
//     userQuery = {
//       deleted: false
//     },
//     gameQuery = {
//       uuid: req.params.gameId
//     },
//     invitationQuery = {
//       targetId: req.body.userId
//     };
//   Auth.pGetOne(authQuery)
//     .then(auth => User.pGetOne(userQuery, auth, req))
//     .then(user => Game.pGetOne(gameQuery, user.uuid))
//     .then(game => Invitation.pCreate({
//       targetId: req.body.userId,
//       gameId: game.uuid,
//       creator: {
//         id: req.jonathanSession.currentUser.uuid,
//         name: req.jonathanSession.currentUser.name
//       }
//     }))
//     .then(invitation => Invitation.pipeSuccessRender(req, res, invitation))
//     .catch(error => Error.pipeErrorRender(req, res, error))
// });
//
// router.get('/:gameId/qrcode', function(req, res) {
//   var authQuery = {
//       token: req.headers['x-session-token']
//     },
//     gameQuery = {
//       uuid: req.params.gameId
//     };
//   Auth.pGetOne(authQuery)
//     .then(auth => Game.pGetOne(gameQuery, auth.userId))
//     .then(game => Game.pQrcodeRender(req, res, game))
//     .catch(error => Error.pipeErrorRender(req, res, error));
// });
//
//
// /******************************
//  * Handling game condition
//  ******************************/
//
//
// router.post('/:gameId/start', function(req, res) {
//   var authQuery = {
//       token: req.headers['x-session-token']
//     },
//     settings = [
//       req.body.werewolf || 1, req.body.fortune || 0, req.body.knight || 0
//     ];
//   Auth.pGetOne(authQuery)
//     .then(auth => GameHandler.pStart({
//       uuid: req.params.gameId,
//       'creator.id': auth.userId,
//       scene: 0
//     }, settings))
//     .then(game => Log.pCreate(game, Log.generateQuery(game, Log.TYPE.START, null)))
//     .then(game => Log.pCreate(game, Log.generateQuery(game, Log.TYPE.CHANGETIME, null)))
//     .then(game => Game.pipeSuccessRender(req, res, game))
//     .catch(error => Error.pipeErrorRender(req, res, error));
// })
//
// router.post('/:gameId/vote', function(req, res) {
//   var authQuery = {
//       token: req.headers['x-session-token']
//     },
//     gameQuery = {
//       uuid: req.params.gameId,
//       scene: 1,
//     };
//
//   Auth.pGetOne(authQuery)
//     .then(auth => Game.pGetOne(gameQuery, auth.userId))
//     .then(game => GameHandler.pVote(game, {
//       day: game.day,
//       gameId: req.params.gameId,
//       targetId: req.body.userId
//     }))
//     .then(game => GameHandler.pVoteResult(game))
//     .then(game => GameHandler.pEnd(game))
//     .then(game => Game.pipeSuccessRender(req, res, game))
//     .catch(error => Error.pipeErrorRender(req, res, error));
// });
//
// router.post('/:gameId/action', function(req, res) {
//   var authQuery = {
//       token: req.headers['x-session-token']
//     },
//     userQuery = {
//       deleted: false
//     },
//     gameQuery = {
//       uuid: req.params.gameId,
//       scene: 2
//     };
//   Auth.pGetOne(authQuery)
//     .then(auth => Game.pGetOne(gameQuery, auth.userId))
//     .then(game => GameHandler.pAction(game, {
//       day: game.day,
//       gameId: req.params.gameId,
//       ownerId: game.currentPlayer.userId,
//       ownerRole: game.currentPlayer.role,
//       targetId: req.body.userId
//     }))
//     .then(game => GameHandler.pActionResult(game))
//     .then(game => GameHandler.pEnd(game))
//     .then(game => Game.pipeSuccessRender(req, res, game))
//     .catch(error => Error.pipeErrorRender(req, res, error));
// });
//
module.exports = router;
