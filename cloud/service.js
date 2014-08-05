var _ = require('underscore');

var cereal = function(accumulator, nodeId) {

 
	var promise = new Parse.Promise();

    var query = new Parse.Query("Node");
    // query.include("parents");
 
    // Don't bother looking up a node that's already in accumulator.
    if (nodeId in accumulator) {
        promise.resolve(accumulator);
        return promise;
    }

    query.get(nodeId).then(
    	function(node) {

			parentA = node.get('parentA');
			parentB = node.get('parentB');
    		accumulator[node.id] = node;

                		

    		if (_.keys(accumulator).length >= 2 || parentA === undefined || parentB === undefined) {
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

var offspring = function(accumulator, nodeIds) {

 
    var promise = new Parse.Promise();

    var Node = Parse.Object.extend('Node');

    // var parentA = new Node();
    // parentA.id = nodeId;

    parentList = {};
    _.each(nodeIds, function(nodeId) {
        n = new Node();
        n.id = nodeId;
        parentList[nodeId] = n;
    });

    parentList = _.values(parentList);
    q1 = new Parse.Query("Node").containedIn('parentA', parentList);
    q2 = new Parse.Query("Node").containedIn('parentB', parentList);
    var query = Parse.Query.or(q1, q2);
    query.include('parentA');
    query.include('parentB');
 
    console.log("offspring query for nodeIds: " + nodeIds + ", query: " + JSON.stringify(query));
    query.find().then(function(results) {
        console.log("results: " + JSON.stringify(results));
        if (results.length == 0) {
            promise.resolve(accumulator);
        }
        else {

            promises = [];

            for (x in results) {
                accumulator.push(results[x]);
                promises.push(results[x].id);
            }

            promises = offspring(accumulator, promises);
            Parse.Promise.when(promises).then(
                function() {
                    promise.resolve(accumulator);
                },
                function(error) {
                    promise.reject(error);
                });
        }
    },
    function(error) {
        promise.reject(error);
    });



    return promise;

} 
 
exports.offspring = offspring;
