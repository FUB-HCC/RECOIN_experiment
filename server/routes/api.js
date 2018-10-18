const express = require("express");
const bodyParser = require("body-parser");
const mongo = require('../services/mongo');
const csv = require('csv-express');

const app = express();

app.post('/event', async (req, res) => {
	let assignmentID = req.body.assignmentID;
	let condition = req.body.condition;
	let workerID = req.body.workerID || 1;
	let properties = req.body.properties;
	let questions = req.body.questions;
	let grade = req.body.grade;
	let averageRelevance = req.body.averageRelevance;
	
	console.log(req.body);
	
	let response = {
		workerID,
		assignmentID,
		condition,
		properties,
		questions,
		grade,
		averageRelevance,
	}

	/*
	 * connect to server => insert data to DB => retrieve data from DB
	 * on success send response with success = true else success = false
	 */
	let storedToDB = await mongo.connectToServer()
		.then(async (res) => {
			if (res.success) {
				let oldValue = {
					workerID
				};
				let newValue = response;
				return await mongo.updateData(oldValue, newValue);
			}
			response.success = false;
			throw res.error;
		})
		.then(async (res) => (res.success))
		.catch((err) => {
			console.log(err);
			response.success = false;
		});
	response.success = storedToDB;
	res.send(response);
});

app.get('/exportProperties', async (req, res) => {
	let filename = "mTurkWorkers_" + getTimestamp() + ".csv";

	let workers = await mongo.connectToServer().then(async (res) => {
		if (res.success) {
			let foundData = await mongo.findData({});
			return foundData.data;
		}
		return null;
	});

	let result = [];

	for (worker of workers) {
		let mWorker = {};
		let properties = worker.properties;

		for (property of properties) {
			let values = property.values;

			for (value of values) {
				mWorker.workerID = worker.workerID;
				mWorker.assignmentID = worker.assignmentID;
				mWorker.property = property.name;
				mWorker.value = value;
				mWorker.recoin = property.recoin;
				mWorker.recoinUsed = property.recoinUsed;
				mWorker.timestamp = property.timestamp || "";
				result.push(mWorker);
				mWorker = {};
			}
		}

		/*
		for (question of questions) {
			console.log('question',question);
			mWorker.workerID = worker.workerID;
			mWorker.property = question.property;
			mWorker.value = question.value;
			mWorker.recoin = question.recoin;
			result.push(mWorker);
		}
		*/
	}
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/csv');
	res.setHeader("Content-Disposition", 'attachment; filename=' + filename);
	res.csv(result, true);
});

function getTimestamp() {
	let today = new Date();
	let seconds = today.getSeconds();
	let minutes = today.getMinutes();
	let hours = today.getHours();
	let day = today.getDate();
	let month = today.getMonth() + 1; //January is 0!
	let year = today.getFullYear();

	seconds < 10 ? seconds = '0' + seconds : seconds;
	minutes < 10 ? minutes = '0' + minutes : minutes;
	hours < 10 ? hours = '0' + hours : hours;
	day < 10 ? day = '0' + day : day;
	month < 10 ? month = '0' + month : month

	today = hours + ":" + minutes + ":" + seconds + "--" + day + "." + month + "." + year;

	return today;
}

module.exports = app;
