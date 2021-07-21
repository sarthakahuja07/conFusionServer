
var mongoose = require('mongoose');
const Dish = require('./models/dishes');

var mongoDB = 'mongodb://localhost:27017/test';


mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => {
        Dish.create({ //Create
            name: 'pizza',
            description: 'test'
        })
            .then((dish) => {
                console.log(dish);
                return Dish.find({}); //read
            })
            .then((dishes) => {
                console.log(dishes);
                return Dish.deleteMany({}); //delete
            })
            .then(() => {
                return mongoose.connection.close();
            })
            .catch((err) => {
                console.log(err);
            });
    })
    .catch(err => console.log(err))
