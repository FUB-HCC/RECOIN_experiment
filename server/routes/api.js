const express = require("express");
const bodyParser = require("body-parser");
const mongo = require('../services/mongo');
const csv = require('csv-express');

const app = express();

app.post('/event', async (req, res) => {
    //console.log(req.body);
    //TODO check if the event is "trackingEvent" or "summary"

    //if "trackingEvent":
    //store: workerID;assignmentID;timestamp;property;value;relevance;impactOnRelevance;condition

    //if "summary"
    //workerID;assignmentID;grade;avgRelevance;wikidata;comprehension;fairness;accuracy;trust;condition

    let response = req.body;
    response.serverTimestamp = new Date().toISOString();
    console.log("is servertimestamp included?" + JSON.stringify(response));
    var isTracking = true;
    /*
     * connect to server => insert data to DB => retrieve data from DB
     * on success send response with success = true else success = false
     */
    if (isTracking) {
        let storedToDB = await mongo.connectToServer()
            .then(async (res) => {
                if (res.success) {
                    // let oldValue = {
                    // 	workerID
                    // };
                    // let newValue = response;
                    // return await mongo.updateData(oldValue, newValue);
                    return await mongo.insertData(response, "mturk-tracking-events");
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

    } else {
        let storedToDB = await mongo.connectToServer()
            .then(async (res) => {
                if (res.success) {
                    // let oldValue = {
                    // 	workerID
                    // };
                    // let newValue = response;
                    // return await mongo.updateData(oldValue, newValue);
                    return await mongo.insertData(response, "mturk-summaries");
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

    }
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
        result.push(worker);
        let mWorker = {};
        // let properties = worker.properties;

        // for (property of properties) {
        // 	let values = property.values;
        //
        // 	for (value of values) {
        // 		mWorker.workerID = worker.workerID;
        // 		mWorker.assignmentID = worker.assignmentID;
        // 		mWorker.property = property.name;
        // 		mWorker.value = value;
        // 		mWorker.recoin = property.recoin;
        // 		mWorker.hitID = property.hitID;
        // 		mWorker.recoinUsed = property.recoinUsed;
        // 		mWorker.timestamp = property.timestamp;
        // 		result.push(mWorker);
        // 		mWorker = {};
        // 	}
        // }

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

app.get('/tracking-all.json', async (req, res) => {
    let trackingEvents = await mongo.connectToServer().then(async (res) => {
        if (res.success) {
            let foundData = await mongo.findData({}, "mturk-tracking-events");
            return foundData.data;
        }
        return null;
    });

    let trackingEventResults = [];

    for (trackingEvent of trackingEvents) {
        trackingEventResults.push(trackingEvent);
    }

    let summaries = await mongo.connectToServer().then(async (res) => {
        if (res.success) {
            let foundData = await mongo.findData({}, "mturk-summaries");
            return foundData.data;
        }
        return null;
    });

    let summaryResults = [];

    for (summary of summaries) {
        trackingEventResults.push(summary);
    }

    let results = {
        "trackingEvents": trackingEventResults,
        "summaries": summaryResults
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(results));
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
    month < 10 ? month = '0' + month : month;

    today = hours + ":" + minutes + ":" + seconds + "--" + day + "." + month + "." + year;

    return today;
}

module.exports = app;
