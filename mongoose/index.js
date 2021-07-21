
var mongoose = require('mongoose');
const Dish = require('./models/dishes');

var mongoDB = 'mongodb://localhost:27017/conFusion';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(db => {
        Dish.create({ //Create
            name: 'pizza',
            description: 'test'
        })
            .then((dish) => {
                console.log(dish);
                return Dish.findByIdAndUpdate(dish._id, { $set: { description: 'Updated test' } })
            })
            .then((dish) => {
                dish.comments.push({
                    rating: 5,
                    comment: 'I\'m getting a sinking feeling!',
                    author: 'Leonardo di Carpaccio'
                });
                return dish.save();
            })
            .then(dish => {
                return Dish.deleteMany({})
            })
            .then(dish => {
                return mongoose.connection.close();
            })
            .catch((err) => {
                console.log(err);
            });
    })
    .catch(err => console.log(err))
