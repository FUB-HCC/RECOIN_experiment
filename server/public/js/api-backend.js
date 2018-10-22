/*
 *	build property object:	
 *	properties:{
 *		name : "Property Name"
 *		values: ['value1','value2','value3']
 *	}
 */

// var data1 = {
// 	workerID,
// 	hitID,
// 	assignmentID,
// 	condition,
// 	relevance,
// 	timestamp,
// 	property,
// 	value,
// 	impactOnRelevance
// }
// 
// var data2 = {
// 	workerID,
// 	hitID,
// 	assignmentID,
// 	grade,
// 	avgRelevance,
// 	wikidata,
// 	comprehension,
// 	fairness,
// 	accuracy,
// 	trust,
// }
// 
// sendProperties(data1);
// sendQuestions(data2);

function sendTrackingEvent(trackingEventData, onSuccessFn, onErrorFn) {
    console.log("Calling tracking api with:" + JSON.stringify(trackingEventData));
    $.ajax({
        url: './api/event/',
        data: trackingEventData,
        dataType: 'json',
        type: "POST",

        success: (e) => onSuccessFn(e),
        error: (e) => onErrorFn(e)
    });
}

//TODO aufräumen!
function sendProperties(data, cb) {
    console.log(data);
    $.ajax({
        url: './api/event/',
        data: data,
        dataType: 'json',
        type: "POST",

        success: function (data) {
            console.log(data);
            cb(data);
        }
    });
}
