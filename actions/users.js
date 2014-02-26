// actions/users.js

exports.userAdd = {
  name: "userAdd",
  description: "I add a user",
  inputs: {
    required: ["username", "password"],
    optional: [],
  },
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    api.users.add(connection.params.username, connection.params.password, function(error){
      connection.error = error;
      next(connection, true);
    });
  }
};

exports.userDelete = {
  name: "userDelete",
  description: "I delete a user",
  inputs: {
    required: ["username", "password"],
    optional: [],
  },
  authenticated: true,
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    api.users.delete(connection.params.userName, connection.params.password, function(error){
      connection.error = error;
      next(connection, true);
    });
  }
};

exports.usersList = {
  name: "usersList",
  description: "I list all the users",
  inputs: {
    required: [],
    optional: [],
  },
  authenticated: true,
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    api.users.list(function(error, users){
      connection.error = error;
      connection.response.users = [];
      for(var i in users){
        connection.response.users.push(users[i].username)
      }
      next(connection, true);
    });
  }
};

exports.print = {
  name: "print",
  description: "I print a user's details",
  inputs: {
    required: ["username"],
    optional: [],
  },
  authenticated: false,
  outputExample: {username: 'fred', stuff: "..."},
  version: 1.0,
  run: function(api, connection, next){
    api.users.print(connection.params.username, function(error, user){
      connection.error = error;
      connection.response.user = user;
      next(connection, true);
    });
  }
};