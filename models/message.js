var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const Message = new Schema({
    username: {
    	type: String
    },
    content: {
    	type: String
    }, 
    importance: {
    	type: String
    },
    date: {
    	type: Date
    }
    
});

//Account.plugin(passportLocalMongoose);

//allows Message object to be accessed in other modules
module.exports = mongoose.model('messages', Message);