const mongoose = require('mongoose');
const Schema = mongoose.Schema


var leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    abbr: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true,
    },

}, {
    timestamps: true
});

// Compile model from schema
var Leader = mongoose.model('Leader', leaderSchema);
module.exports = Leader