var endpoint = require("./../config/urls.js");
var request = require("./helpers.js");
var config = require("./../config/config.js");

module.exports = function(router){
	router.get("/:word", function(req, res){

		request.get({
			endpoint: endpoint.nyms + config.words + "/" + req.param("word") + "/json",
			success: function(result){
				console.log("Success");
				res.json(JSON.parse(result));
			},
			error: function(error){
				console.log(error);
				throw Error("Some Error getting Nyms");
			}
		})
	});

	return router;
}