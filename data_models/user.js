/*
    Usage:
    var users = require('./datamodel/users')(mongoose);
*/

// var metaBase = require('../public/js/datamodel/user');
var crypto = require('crypto');

module.exports = function(mongoose){
    var user = {};
    
    user.schema = new mongoose.Schema({
        username: String,
        passwordHash: String,
        passwordSalt: String
    });
    
    user.schema.methods.print = function (next) {
        var instance = this;
        console.log(instance);
        if(next) next();
    };
    
    user.schema.methods.authenticate = function (passwordText, next) {
        var instance = this,
            salt = instance.passwordSalt || 'kosher';
        user.model.cryptPassword(passwordText, salt, function(err, cryptedHash){
            if(err !== null) next(err);
            else next(null, (instance.passwordHash == cryptedHash))
        });
    };

    user.schema.statics.cryptPassword = function(password, salt, next) {
       var hash = crypto.createHash('md5').update(salt + password).digest("hex");
       next(null, hash);
    };

    user.schema.statics.authenticate = function (usernameText, passwordText, next) {
        this.model('User').findOne({username: usernameText}, function(err, user){
            if(err !== null) next(err);
            else if(!user) next(null, false, { message: 'Incorrect username.' })
            else user.authenticate(passwordText, function(err, matched){
                if(err !== null) next(err);
                else if(matched) next(null, user);
                else next(null, false, { message: 'Incorrect password.' });
            });
        });
    };
    
    user.model = mongoose.model('User', user.schema);
    
    return user;
}