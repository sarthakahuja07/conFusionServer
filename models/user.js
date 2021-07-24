const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

userSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', userSchema);
module.exports = User