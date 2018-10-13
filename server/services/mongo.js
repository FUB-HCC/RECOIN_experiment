const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;
const assert = require('assert');
const url = 'mongodb://localhost';
const port = '27017';
const dbName = 'recoin';

let client;
var _db;

module.exports = {
	connectToServer: async () => {
			let status = {};
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
			}).then(async (db) => {
				_db = db;
				status.success = true;
				return status;
			}).catch((err) => {
				status.success = false;
				status.error = err;
				return status;
			});
			return connection;
		},
	getDb: () => {
		return db;
	},
	insertData: async (mData, mCollection) => {
			const collection = _db.collection(mCollection);
			let response = {};
		
			await collection.insertOne(mData).then((result) => {
				response.success = true;
				response.data = result;
				return true;
			}).catch((err) => {
				response.success = false;
				response.error = err;
				return false
			});
			return response;
		},
	findData: (data = {}, mCollection) => {
		const collection = _db.collection(mCollection);
		let res = new Promise((resolve, reject) => {
			collection.find(data).toArray(async (err, result) => {
				if (err) {
					reject(err);
					return err;
				}
				resolve(result);
				return result;
			});
		})

		return res;
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
