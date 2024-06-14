const { MongoClient } = require('mongodb');

function circulationRepo() {
  const url = 'mongodb://localhost:27017';
  const dbName = 'circulation';

  function get(query, limit) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);

        db.listCollections();

        // https://mongodb.github.io/node-mongodb-native/6.7/classes/Collection.html#find/
        let items = db.collection('newspapers').find(query); // ! Creates a cursor for a filter that can be used to iterate over results from MongoDB

        if (limit > 0) {
          items = items.limit(limit);
        }
        /* 
        ! Besides limit there are many other methods to manipulate the cursor and subsequently the returned data
        ? These methodos can be checked at
        * // https://mongodb.github.io/node-mongodb-native/6.7/classes/FindCursor.html
        */

        resolve(await items.toArray());
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function loadData(data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);

        results = await db.collection('newspapers').insertMany(data);
        resolve(results);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  return { loadData, get };
}

module.exports = circulationRepo();
