var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.post('/event', function (req, res) {
	let property = req.body.property;
	let value = req.body.value;

	let response = {
		success: true,
		property: property,
		value: value
	}
	res.send(response);
	res.end("hey");
});

module.exports = app;
