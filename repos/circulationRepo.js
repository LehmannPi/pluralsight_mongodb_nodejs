const { MongoClient, ObjectId } = require('mongodb');

function circulationRepo() {
  const url = 'mongodb://localhost:27017';
  const dbName = 'circulation';

  function getById(id) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);

        const objectId = new ObjectId(String(id));

        const item = await db
          .collection('newspapers')
          .findOne({ _id: objectId }); // ? using only the string for the _id does not work - return null

        resolve(item);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

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

        const results = await db.collection('newspapers').insertMany(data);
        resolve(results);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function add(item) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const addedItem = await db.collection('newspapers').insertOne(item);

        resolve(addedItem);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function update(id, newItem) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);

        const objectId = new ObjectId(String(id));

        const updatedItem = await db
          .collection('newspapers')
          .findOneAndReplace({ _id: objectId }, newItem, {
            returnDocument: 'after',
          });

        resolve(updatedItem);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  return { add, get, getById, loadData, update };
}

module.exports = circulationRepo();
