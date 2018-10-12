const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;
const assert = require('assert');
const url = 'mongodb://localhost';
const port = '27017';
const dbName = 'recoin';

let client;
var _db;

module.exports = {
	connectToServer: (callback) => {
		let status = {
			isConnected: false
		};
		client = new MongoClient(new Server('localhost', 27017));

		let connection = new Promise((resolve, reject) => {
			client.connect((err, mongoClient) => {
				try {
					let db = mongoClient.db("recoin");
					resolve(db);
				} catch (e) {
					reject("Could not connect to database");
				}
			});
		}).then((db) => {
			_db = db;
			status.isConnected = true;
			callback(status);
		}).catch((err) => {
			console.log(err);
			callback(status);
		})
	},
	getDb: () => {
		return db;
	},
	insertData: (mData, mCollection, callback) => {
		const collection = _db.collection(mCollection);
		// Insert some documents
		collection.insertOne({
			data: mData
		}).then((result) => {
			callback(result);
		}).catch((err) => {
			console.log(err);
			return err
		})
	},
	findData: (data = {}, mCollection, callback) => {
		// Get the documents collection
		const collection = _db.collection(mCollection);
		// Find some documents
		collection.find(data).toArray((err, docs) => {
			if (err) {
				console.log(err);
				return
			}
			callback(docs);
		});
	},
	removeData: (mCollection, callback) => {
		_db.collection.remove(mCollection)
		callback();
	},
	close: () => {
		client.close();
		console.log("Closed the server successfully");
	}
};
