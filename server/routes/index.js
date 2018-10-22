const express = require('express');
const router = express.Router();

function buildStartLinkFrom(assignmentId, workerId, hitId, turkSubmitTo, condition) {
    return "/onboarding?assignmentId=" + assignmentId + "&workerId=" + workerId + "&hitId=" + hitId + "&turkSubmitTo=" + turkSubmitTo + "&condition=" + condition;
}

/*
http://localhost:3000/?workerId=1&hitId=1&turkSubmitTo=https://workersandbox.mturk.com&assignmentId=3D8YOU6S9FRXW3LJ8V7SNFMUXHYU6C
 */
router.get('/', function (req, res) {
    //console.log(req);
    let assignmentId = req.query.assignmentId;
    let workerId = req.query.workerId;
    let hitId = req.query.hitId;
    let turkSubmitTo = req.query.turkSubmitTo;
    let condition = req.query.condition;

    var preview = false;
    if (assignmentId == null || assignmentId === "ASSIGNMENT_ID_NOT_AVAILABLE") {
        preview = true;
    }

    let model = {
        "preview": preview,
        "hit-start-url": buildStartLinkFrom(assignmentId, workerId, hitId, turkSubmitTo, condition),
        "query": JSON.stringify(req.query),
    };
    console.log(model);
    res.render('hit/hit-preview.mustache', model);
});

router.get('/onboarding', function (req, res) {
    let assignmentId = req.query.assignmentId;
    let workerId = req.query.workerId;
    let hitId = req.query.hitId;
    let turkSubmitTo = req.query.turkSubmitTo;
    let condition = req.query.condition;

    let model = {
        "mturkConfig": JSON.stringify(req.query),
        "shouldIncludeRecoinText": (condition >= 3)
    };
    res.render('hit/onboarding.mustache', model);
});

router.get('/briefing', function (req, res) {
    res.render('hit/briefing.mustache', {});
});

router.get('/material', function (req, res) {
    res.render('hit/material.mustache', {});
});


router.get('/main', function (req, res) {
    let condition = req.query.condition;
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (condition == null) {
        //TODO throw a meaningful error
        throw error;
    } else if (condition == 1) {
        res.render('hit/main-without-recoin.mustache', {});
        console.log("main-without-recoin");
    } else if (condition <= 4) {
        res.render('hit/main-recoin-original.mustache', {});
        console.log("main-recoin-original");
    } else if (condition == 5) {
        res.render('hit/main-recoin-with-explanation.mustache', {});
        console.log("main-recoin-with-explanation");
    } else if (condition == 6) {
        res.render('hit/main-recoin-redesign.mustache', {});
        console.log("main-recoin-redesign");
    }
});


router.get('/questionnaire', function (req, res) {
    let recoinGrade = req.query.recoinGrade;
    let averageRelevance = req.query.averageRelevance;
    let model = {
        "recoinGrade": recoinGrade,
        "averageRelevance": averageRelevance
    };
    res.render('hit/questionnaire.mustache', model);
});


module.exports = router;