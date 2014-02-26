/*
    var models = require('./datamodel')(mongoose);
*/

module.exports = function(mongoose){    
    return {
        'user': require('./user')(mongoose)//,
        // 'article': require('./article')(mongoose)
    };
};