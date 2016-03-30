var assert = require("assert");
var Group = require("../model/group.js");
var User = require("../model/user.js");

var mongoose = require('mongoose'),
  config = require('../config.js'),
  UserModel = mongoose.model('User', require('../schema/user.js'));

describe('model', function() {
  before(function() {
    mongoose.createConnection(`mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`);
  });

  describe('User', function() {
    before(function(done) {
      UserModel.remove({}, function(err) {
        if (err) {
          throw err;
        }
        done();
      });
    });
    it('pCreate', function(done) {
      User.pCreate({
          name: "test-name",
          password: "test-password"
        })
        .then(user => {
          assert.equal(user.name, "test-name");
          assert.equal(user.password, "test-password");
          done();
        })
        .catch(error => {
          assert.fail()
          done();
        });
    });
  })
})
