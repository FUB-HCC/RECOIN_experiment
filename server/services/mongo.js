const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;
const assert = require('assert');
const url = 'mongodb://localhost';
const port = '27017';
const dbName = 'recoin';
const collection = 'mTurkWorkers';

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
	insertData: async (mDatamCollection = collection) => {
			let collection = _db.collection(mCollection);
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
			client.close();

			return response;
		},
	findData: async (data = {}, mCollection = collection) => {
		let collection = _db.collection(mCollection);
		let response = {};
		let result = await new Promise((resolve, reject) => {
			collection.find(data).toArray(async (err, result) => {
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
		}
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
		
		console.log('response',response);
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
