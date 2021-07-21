
var mongoose = require('mongoose');
const Dish = require('./models/dishes');

var mongoDB = 'mongodb://localhost:27017/test';


mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => {
        var newDish = new Dish({
            name: 'Uthappizza',
            description: 'test'
        });
        
        

    })
    .catch(err => console.log(err))
