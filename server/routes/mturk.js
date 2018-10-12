const express = require('express');
const AWS = require('aws-sdk');
const assert = require('assert');
const mongo = require('../services/mongo');
const router = express.Router();
const endpoint = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com';
let mturk;

/* GET home page. */
//TODO async/await doesn't work for jesse.
router.get('/', async function (req, res, next) {
	let region = 'us-east-1';

	let accessKeyId = process.env.accessKeyId;
	let secretAccessKey = process.env.secretAccessKey;

	console.log('accessKeyId', accessKeyId || "");
	console.log('secretAccessKey', secretAccessKey || "");

	if (accessKeyId && secretAccessKey) {
		AWS.config.update({
			region,
			endpoint,
			accessKeyId,
			secretAccessKey
		});
	} else {
		AWS.config.update({
			region,
			endpoint,
		});
	}

	mturk = new AWS.MTurk();
	let balance = await getBalance(mturk);

	mongo.connectToServer((response) => {
		console.log('response from server', response);
		if (response.isConnected) {
			insertBalance({
				'balance': balance
			}, 'balance', (result) => {
				findBalance({}, 'balance', (res) => {
					console.log(res);
					mongo.close();
				});
			});
		}
	});

	res.render('mturk/index.mustache', {
		title: 'My first aws request ',
		content: 'I got ' + balance + '€ in my acc'
	});
});

const getBalance = (mturk) => {
	return new Promise((resolve, reject) => {
		mturk.getAccountBalance({}, (err, data) => {
			if (err) {
				reject(err)
			}
			balance = data && data.AvailableBalance
			resolve(balance);
		});
	});
}

const insertBalance = (data, collection, callback) => {
	mongo.insertData(data, collection, callback);
}

const findBalance = (data, collection, callback) => {
	mongo.findData(data, collection, callback);
}

module.exports = router;
