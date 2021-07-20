const MongoClient = require("mongodb").MongoClient;
const operations = require('./operations');
const url = 'mongodb://localhost:27017'

const dbname = 'conFusion';

MongoClient.connect(url)
    .then((client) => {
        const db = client.db(dbname);
        operations.insertDocument(db, { name: "Test", description: "Testsssss" }, "dishes")
            .then((result) => {
                console.log(result);
                operations.findDocuments(db, "dishes")
                    .then(docs => {
                        console.log(docs);
                        operations.removeDocument(db, { name: "Test" }, "dishes")
                            .then(result => {
                                console.log(result);
                                operations.updateDocument(db, { name: "Test" }, { description: "Updated Test" },"dishes")
                            })
                            .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => {
                console.log(err);
            })
    })
    .catch(err => {
        console.log(err);
    })
