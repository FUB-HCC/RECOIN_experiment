const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongo = require('../services/mongo');

app.post('/event', function (req, res) {
	let property = req.body.property;
	let value = req.body.value;
	let recoin = req.body.recoin;
	let workerID = 1;

	let response = {
		success: true,
		workerID,
		property,
		value,
		recoin
	}

	mongo.connectToServer((res) => {
		console.log('res from server', res);

		if (res.isConnected) {
			insertBalance({
				'workerID': workerID,
				'res': response
			}, 'balance', (result) => {
				let id = result.insertedId;

				findBalance({
					'_id': String(id)
				}, 'balance', (res) => {
					console.log(res);
					mongo.close();
				});
			});

		}
	});

	res.send(response);
	res.end("hey");
});

const insertBalance = (data, collection, callback) => {
	mongo.insertData(data, collection, callback);
}

const findBalance = (data, collection, callback) => {
	mongo.findData(data, collection, callback);
}

module.exports = app;
