Parse.Cloud.beforeSave("Node", function(request, response) {

	parentA = request.object.get('parentA');
	console.log("Saving Node: "+JSON.stringify(request.object));
	response.success();

});