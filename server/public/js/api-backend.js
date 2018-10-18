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

function sendProperties(data) {
	console.log(worker);

	$.ajax({
		url: './api/event/',
		data: worker,
		dataType: 'json',
		type: "POST",

		success: function (data) {
			console.log(data);
		}
	});
}
