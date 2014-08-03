// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello girls!");
 
 
});

var cereal = function(accumulator, nodeId) {

 
	var promise = new Parse.Promise();

    var query = new Parse.Query("Node");
    // query.include("parents");
 
    query.get(nodeId).then(
    	function(node) {

			parentA = node.get('parentA');
			parentB = node.get('parentB');
    		accumulator[node.id] = node;
    		

    		if (parentA === undefined || parentB === undefined) {
	    		promise.resolve(accumulator);
	   		}
	   		else {

	   		    promises = [];
	   		    if (parentA !== undefined) {
	   		    	promises.push(cereal(accumulator, parentA.id));	   		    	
	   		    }
	   		    if (parentB !== undefined) {
	   		    	promises.push(cereal(accumulator, parentB.id));	   		    	
	   		    }
	   			// Recursive calls for parents, run in parallel via Parse.Promise.when method.
    			Parse.Promise.when(promises).then(
    				function(a,b) {
    					console.log("Inside parallel promise success");
    					promise.resolve(accumulator);
    				},
    				function(error) {
    					console.log("Inside parallel promise error");
    				    promise.reject(error);
    				});
	   		}

    	},
    	function(error) {
    		promise.reject(error);
    });

    return promise;

} 
 

Parse.Cloud.define("cereal", function(request, response) {
	accumulator = {};
	cereal(accumulator, request.params.nodeId).then(function(result) {
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