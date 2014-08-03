service = require('cloud/service.js');
triggers = require('cloud/triggers.js');
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello girls!");
});

Parse.Cloud.define("cereal", function(request, response) {
	accumulator = [];
	service.cereal(accumulator, request.params.nodeId).then(function(result) {
		response.success(result);
	});
});


Parse.Cloud.define("nodes", function(request, response) {
    var query = new Parse.Query("Node");
        query.include("parents");
    query.find({
        success: function (results) {
            response.success(results);
        }
        ,
        error: function() { 
            response.error("Something went wrong.");
        }
    });
});
Parse.Cloud.define("entity", function(request, response) {
    var query = new Parse.Query("Entity");
        query.doesNotExist("name");
    query.find({
        success: function (results) {
            response.success(results);
        }
        ,
        error: function() { 
            response.error("Something went wrong.");
        }
    });
});

