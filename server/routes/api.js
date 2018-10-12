const express = require('express');
const router = express.Router();

router.get('/event/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ "response": "ok" }));
});

module.exports = router;