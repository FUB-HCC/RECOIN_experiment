const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;
const assert = require('assert');
const url = 'mongodb://localhost';
const port = '27017';
const dbName = 'recoin';
const collection = 'mturk-tracking-events';

let client;
var _db;

module.exports = {
	connectToServer: async () => {
			let status = {};
			status.success = false;
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
	insertData: async (mData, mCollection = collection) => {
		let collection = _db.collection(mCollection);
		let response = {};
		let res = await new Promise((resolve, reject) => {
			collection.insertOne(mData)
				.then((result) => {
					resolve(result);
					response.data = result;
					return result;
				})
				.catch((err) => {
					reject(err);
					response.error = err;
					return false;
				});
		});
		console.log('res', res);
		response.success = res ? true : false;
		return response;
	},
	findData: async (data = {}, mCollection = collection) => {
		let collection = _db.collection(mCollection);
		let response = {};
		let sortVariable = {
			workerID: 1
		};
		
		let result = await new Promise((resolve, reject) => {
			collection.find(data).sort(sortVariable).toArray(async (err, result) => {
				if (err) {
					reject(err);
					response.error = err;
					return false;
				}
				resolve(result);
				response.data = result;
				return result;
			});
		})
		client.close();
		response.success = result ? true : false;
		return response;
	},

	/*
	 * update if exists otherwise insert 
	 */
	updateData: async (findOldValue, newValue, mCollection = collection) => {
		let collection = _db.collection(mCollection);
		let response = {};
		let updateOptions = {
			upsert: true
		};
		
		let updateQuery = {
			$set:newValue
		};
		
		let result = await new Promise((resolve, reject) => {
			collection.updateOne(findOldValue, updateQuery, updateOptions, (err, result) => {
				if (err){
					 reject(err);
					 response.error = err;
					 return false;
				}
				resolve(result);
				response.data = result;
				return result;
			});
		});
		
		client.close();
		response.success = result ? true : false;
		return response;
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
