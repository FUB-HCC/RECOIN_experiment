/*
 *	build property object:	
 *	properties:{
 *		name : "Property Name"
 *		values: ['value1','value2','value3']
 *	}
 */
function sendProperties() {
	var properties = $('.propertyBox').toArray().map(function (property) {
		let mProperty = {}
		let values = $(property).parent().find('.valueBox').toArray().map(function (value) {
			return $(value).html();
		});

		mProperty.name = $(property).html();
		mProperty.values = values;
		return mProperty;
	});
	var worker = {};

	worker.workerID = "1";
	worker.assignmentID = "1";
	worker.condition = "1";
	worker.properties = JSON.stringify(properties);
	worker.relevance = ""
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
