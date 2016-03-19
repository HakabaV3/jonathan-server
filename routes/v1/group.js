var express = require('express'),
  router = express.Router(),
  Auth = require('../../model/auth.js'),
  User = require('../../model/user.js'),
  Group = require('../../model/group.js'),
  Payment = require('../../model/payment.js'),
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

router.post('/', function(req, res) {
  var authQuery = {
      token: req.headers['x-session-token']
    },
    userQuery = {
      deleted: false
    };

  Auth.pGetOne(authQuery)
    .then(auth => User.pGetOne(userQuery, auth, req))
    .then(user => Group.pCreate(req.body.name, [user]))
    .then(group => Group.pipeSuccessRender(req, res, group))
    .catch(error => Error.pipeErrorRender(req, res, error))
})

router.post('/:groupId/join', function(req, res) {
  var authQuery = {
      token: req.headers['x-session-token']
    },
    userQuery = {
      deleted: false
    },
    gameQuery = {
      uuid: req.params.groupId
    };
  Auth.pGetOne(authQuery)
    .then(auth => User.pGetOne(userQuery, auth, req))
    .then(user => Group.pPushUser(gameQuery, user))
    .then(group => Group.pipeSuccessRender(req, res, group))
    .catch(error => Error.pipeErrorRender(req, res, error))
});

router.post('/:groupId/payment', function(req, res) {
  var authQuery = {
      token: req.headers['x-session-token']
    },
    userQuery = {
      deleted: false
    },
    groupQuery = {
      uuid: req.params.groupId
    },
    paymentQuery = {
      title: req.body.title,
      price: req.body.price,
      payerId: req.body.payerId
    }
  Auth.pGetOne(authQuery)
    .then(auth => Payment.pCreate(paymentQuery))
    .then(payment => Group.pPushPayment(groupQuery, payment))
    .then(group => Group.pipeSuccessRender(req, res, group))
    .catch(error => Error.pipeErrorRender(req, res, error))
});
module.exports = router;
