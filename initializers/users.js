// initializers/users.js

var crypto = require('crypto');
var salt = "asdjkafhjewiovnjksdv" // in production, you will want to change this, and probably have a unique salt for each user.

exports.users = function(api, next){
  var redis = api.redis.client,
      mongoConn = api.mongo.connection,
      models = api.mongo.models;
  api.users = {

    // constants
    usersHash: "users",

    // methods

    add: function(userName, password, next){
      var self = this;
      redis.hget(self.usersHash, userName, function(error, data){
        if(error != null){
          next(error);
        }else if(data != null){
          next("userName already exists");
        }else{
          self.cryptPassword(password, salt, function(error, hashedPassword){
            if(error != null){
              next(error);
            }else{
              var data = {
                userName: userName,
                hashedPassword: hashedPassword,
                createdAt: new Date().getTime(),
              }
              redis.hset(self.usersHash, userName, JSON.stringify(data), function(error){
                next(error);
              });
            }
          });
        }
      });
    },

    list: function(next){
      models.user.model.find({}, next);
    },
    
    print: function(userName, next){
      models.user.model.findOne({username: userName}, function(err, user){
        user.print();
        next(err, user);
      });
    },

    authenticate: function(userName, password, next){
      models.user.model.authenticate(userName, password, function(err, user){
        if(err !== null) next(err);
        else if(user === false){
          api.log("no user found");
          next(null, false);
        }
        else {
          api.log("found user", JSON.stringify(user));
          next(err, user);
        }
      });
    },

    delete: function(userName, password, next){
      var self = this;
      redis.del(self.usersHash, userName, function(error){
        api.blog.listUserPosts(userName, function(error, titles){
          if(titles.length == 0 || error != null){
            next(error);
          }else{
            var started = 0;
            titles.forEach(function(title){
              started++;
              api.blog.deletePost(userName, title, function(error){
                started--;
                if(started == 0){
                  next();
                }
              });
            });
          }
        });
      });
    },

    // helpers

    cryptPassword: function(password, salt, next) {
       var hash = crypto.createHash('md5').update(salt + password).digest("hex");
       next(null, hash);
    },

    comparePassword: function(hashedPassword, userPassword, salt, next) {
       var hash = crypto.createHash('md5').update(salt + userPassword).digest("hex");
       var matched = (hash === hashedPassword);
       next(null, matched)
    },
  }

  next();
}