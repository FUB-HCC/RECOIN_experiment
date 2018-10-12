const express = require('express');
const router = express.Router();

router.get('/event/', function (req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	console.log('req', req);
	
	res.send(JSON.stringify({
		"response": "ok"
	}));
});

module.exports = router;
