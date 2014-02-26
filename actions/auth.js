/*exports.action = {
  name:                   'auth',
  description:            'auth',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,

  inputs: {
    required: [],
    optional: [],
  },

  run: function(api, connection, next){
    // your logic here
    next(connection, true);
  }
};*/

exports.login = {
  name:                   'login',
  description:            'login page',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,

  inputs: {
    required: [],
    optional: [],
  },

  run: function(api, connection, next){
    // your logic here
    connection.sendFile('login.html');
    next(connection, false); // false to send file
  }
};

exports.auth_google = {
  name: "auth_google",
  description: "I authenticate a user using Google's OAuth",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    var context = api.passport.instance,
        req = connection.rawConnection.req,
        res = connection.response;
    req.flash = function(){
      api.log("FLASH!!:" + JSON.stringify(arguments));
      };
    res.redirect = function(){
      api.log("REDIRECT!!:" + JSON.stringify(arguments));
      // res.writeHead(302, {'location':arguments[0]});
      // res.end();
      connection.response.redirectURL = arguments[0]; // "https://twitter.com/oauth/authorize?oauth_token="+oauthToken;
      connection.rawConnection.responseHeaders.push(['Location', connection.response.redirectURL]);
      connection.rawConnection.responseHttpCode = 302;
      next(connection, true);
    };
    api.passport.instance.authenticate('google').call(context, req, res, next);
  }
};

exports.auth_google_return = {
  name: "auth_google_return",
  description: "Return url for a Google OAuth attempt",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    var context = api.passport.instance,
        req = connection.rawConnection.req,
        res = connection.response;
    req.flash = function(){
      api.log("FLASH!!:" + JSON.stringify(arguments));
      };
    res.redirect = function(){
      api.log("REDIRECT!!:" + JSON.stringify(arguments));
      // res.writeHead(302, {'location':arguments[0]});
      // res.end();
      connection.response.redirectURL = arguments[0]; // "https://twitter.com/oauth/authorize?oauth_token="+oauthToken;
      connection.rawConnection.responseHeaders.push(['Location', connection.response.redirectURL]);
      connection.rawConnection.responseHttpCode = 302;
      next(connection, true);
    };
    api.passport.instance.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }).call(context, req, res, next);
  }
};

exports.authenticate = {
  name: "authenticate",
  description: "I authenticate a user",
  inputs: {
    required: ["username", "password"],
    optional: [],
  },
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    var context = api.passport.instance,
        req = connection.rawConnection.req,
        res = connection.response;
    req.flash = function(){
      api.log("FLASH!!:" + JSON.stringify(arguments));
      };
    res.redirect = function(){
      api.log("REDIRECT!!:" + JSON.stringify(arguments));
      // res.writeHead(302, {'location':arguments[0]});
      // res.end();
      connection.response.redirectURL = arguments[0]; // "https://twitter.com/oauth/authorize?oauth_token="+oauthToken;
      connection.rawConnection.responseHeaders.push(['Location', connection.response.redirectURL]);
      connection.rawConnection.responseHttpCode = 302;
      next(connection, true);
    };
    api.passport.instance.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login.html',
                                   failureFlash: true }).call(context, req, res, next);
  }
};