exports.insertDocument = (db, document, collection) => {
    return new Promise((resolve, reject) => {
        const coll = db.collection(collection);
        coll.insertOne(document)
            .then((result) => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}

exports.findDocuments = (db, collection) => {
    return new Promise((resolve, reject) => {
        const coll = db.collection(collection);
        coll.find({}).toArray()
            .then((docs) => {
                resolve(docs)
            })
            .catch(err => {
                reject(err)
            })
    })

};

exports.removeDocument = (db, document, collection) => {
    return new Promise((resolve, reject) => {
        const coll = db.collection(collection);
        coll.deleteOne(document)
            .then((result) => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
};

exports.updateDocument = (db, document, update, collection) => {
    return new Promise((resolve, reject) => {
        const coll = db.collection(collection);
        coll.updateOne(document,{$set:update})
            .then((result) => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
};
