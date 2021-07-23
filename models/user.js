const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });
// Compile model from schema
var User = mongoose.model('User', userSchema);
module.exports = User