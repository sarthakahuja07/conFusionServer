const MongoClient = require("mongodb").MongoClient;
const operations = require('./operations');
const url = 'mongodb://localhost:27017'

const dbname = 'conFusion';

MongoClient.connect(url)
    .then((client) => {
        console.log('Connected correctly to server');
        const db = client.db(dbname);

        operations.insertDocument(db, { name: "Vadonut", description: "Test" },
            "dishes")
            .then((result) => {
                console.log("Insert Document:\n", result.ops);
                return operations.findDocuments(db, "dishes");
            })
            .then((docs) => {
                console.log("Found Documents:\n", docs);

                return operations.updateDocument(db, { name: "Vadonut" },
                    { description: "Updated Test" }, "dishes");

            })
            .then((result) => {
                console.log("Updated Document:\n", result.result);

                return operations.findDocuments(db, "dishes");
            })
            .then((docs) => {
                console.log("Found Updated Documents:\n", docs);
            })

            .catch((err) => console.log(err));

    })
    .catch((err) => console.log(err));
