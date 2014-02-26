var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , GoogleStrategy = require('passport-google').Strategy;
  
exports.passport = function(api, next){

  api.passport = {};
  api.passport.instance = passport;
  api.passport.init = api.passport.instance.initialize();
  api.passport.session = api.passport.instance.session();
  
  api.passport.instance.use(new LocalStrategy(
    function(username, password, done) {
      api.mongo.models.user.model.authenticate(username, password, done);
    }
  ));
  
  api.passport.instance.use(new GoogleStrategy({
      returnURL: 'http://HOST/api/auth_google_return'.replace('HOST', api.config.info.hostname),
      realm: 'http://HOST/'.replace('HOST', api.config.info.hostname)
    },
    function(identifier, profile, done) {
      api.mongo.models.user.model.findOrCreate({ openId: identifier }, function(err, user) {
        done(err, user);
      });
    }
  ));

  // api.passport._start = function(api, next){
  //   next();
  // };

  // api.passport._stop =  function(api, next){
  //   next();
  // };

  next();
}