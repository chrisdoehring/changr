var cereal = function(accumulator, nodeId) {

 
	var promise = new Parse.Promise();

    var query = new Parse.Query("Node");
    // query.include("parents");
 
    query.get(nodeId).then(
    	function(node) {

			parentA = node.get('parentA');
			parentB = node.get('parentB');
    		accumulator.push(node);
    		

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
 
exports.cereal = cereal;
