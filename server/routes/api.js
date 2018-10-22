const express = require("express");
const bodyParser = require("body-parser");
const mongo = require('../services/mongo');
const csv = require('csv-express');

const app = express();

app.post('/event', async (req, res) => {
    let data = req.body;

    data.serverTimestamp = new Date().toISOString();
    let eventType = data.type;
    var isTracking = eventType == "trackingEvent";
    /*
     * connect to server => insert data to DB => retrieve data from DB
     * on success send data with success = true else success = false
     */
    if (isTracking) {
        //if "trackingEvent":
        //store: workerID;assignmentID;timestamp;property;value;relevance;impactOnRelevance;condition
        let storedToDB = await mongo.connectToServer()
            .then(async (res) => {
                if (res.success) {
                    // let oldValue = {
                    // 	workerID
                    // };
                    // let newValue = data;
                    // return await mongo.updateData(oldValue, newValue);
                    return await mongo.insertData(data, "mturkTrackingEvents");
                }
                data.success = false;
                throw res.error;
            })
            .then(async (res) => (res.success))
            .catch((err) => {
                console.log(err);
                data.success = false;
            });
        data.success = storedToDB;
        res.send(data);
    } else {
        //if "summary"
        //workerID;assignmentID;grade;avgRelevance;wikidata;comprehension;fairness;accuracy;trust;condition
        let storedToDB = await mongo.connectToServer()
            .then(async (res) => {
                if (res.success) {
                    // let oldValue = {
                    // 	workerID
                    // };
                    // let newValue = data;
                    // return await mongo.updateData(oldValue, newValue);
                    return await mongo.insertData(data, "mturkSummaries");
                }
                data.success = false;
                throw res.error;
            })
            .then(async (res) => (res.success))
            .catch((err) => {
                console.log(err);
                data.success = false;
            });
        data.success = storedToDB;
        res.send(data);

    }
});

app.get('/exportSummaries', async (req, res) => {
    let filename = "mTurkWorkers_summaries_" + getTimestamp() + ".csv";

    let workers = await mongo.connectToServer().then(async (res) => {
        if (res.success) {
            let foundData = await mongo.findData({}, "mturkSummaries");
            return foundData.data;
        }
        return null;
    });

    let result = [];

    for (worker of workers) {
        result.push(worker);
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader("Content-Disposition", 'attachment; filename=' + filename);
    res.csv(result, true);
});

app.get('/exportTrackingEvents', async (req, res) => {
    let filename = "mTurkWorkers_trackingEvents_" + getTimestamp() + ".csv";

    let workers = await mongo.connectToServer().then(async (res) => {
        if (res.success) {
            let foundData = await mongo.findData({}, "mturkTrackingEvents");
            return foundData.data;
        }
        return null;
    });

    let result = [];

    for (worker of workers) {
        result.push(worker);
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
    month < 10 ? month = '0' + month : month;

    today = hours + ":" + minutes + ":" + seconds + "--" + day + "." + month + "." + year;

    return today;
}

module.exports = app;
