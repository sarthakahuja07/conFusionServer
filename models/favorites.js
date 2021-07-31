const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoritesSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
        }
    ]
}, {
    timestamps: true
});
// Compile model from schema
var Favorite = mongoose.model('Favorite', favoritesSchema);
module.exports = Favorite;