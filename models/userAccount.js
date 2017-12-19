var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
    username: {
    	type: String
    },

    password: {
    	type: String
    }
});

Account.plugin(passportLocalMongoose);

//allows Account object to be accessed in other modules
module.exports = mongoose.model('accounts', Account);
