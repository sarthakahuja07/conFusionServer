const MongoClient = require("mongodb").MongoClient;
const url = 'mongodb://locahost:27017'

const dbname = 'conFusion';

MongoClient.connect(url)
.then((client)=>{
    const db=client.db(dbname);
    const collection=db.collection('dishes');
})
.catch(err=>{
    console.log(err);
})
