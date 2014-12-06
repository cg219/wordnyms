var endpoint = require("./../config/urls");
var request = require("./helpers.js");
var config = require("./../config/config");
var mongo = require("./mongo");

module.exports = function(router){
	router.get("/:word", function(req, res){
		var word = req.param("word");
		

		mongo.search(word)
			.then(function(foundWord){
				if( foundWord.length > 0 ){
					console.log("Found Word: ");
					console.log(foundWord);
					res.json(foundWord[0]);
				}
				else{
					console.log("Calling Big Huge Theasaurus for help!")
					request.get({
						endpoint: endpoint.nyms + config.words + "/" + word + "/json",
						success: function(result){
							console.log("Success");
							mongo.store(word, JSON.parse(result))
								.then(function(newWord){
									res.json(newWord);
								})
						},
						error: function(error){
							console.log(error);
							throw Error("Some Error getting Nyms");
						}
					})
				}
			},function(error){

			})
		
	});

	return router;
}