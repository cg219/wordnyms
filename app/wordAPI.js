var endpoint = require("./../config/urls");
var request = require("./helpers.js");
var config = require("./../config/config");
var mongo = require("./mongo");

module.exports = function(router, app){

	router.param("word", function(req, res, next, word){
		if(!word){
			return next(err);
		}

		req.word = word;
		next();
	})

	router.param("level", function(req, res, next, level){
		if(!level){
			req.level = 1;
			return next();
		}

		req.level = level;
		next();
	})

	router.get("/:word", function(req, res){
		mongo.search(req.word)
			.then(function(foundWord){
				if( foundWord.length > 0 ){
					console.log("Found Word");
					// console.log(foundWord[0])
					// console.log("Type: " + foundWord[0].randomType());
					res.json({
						word: foundWord[0],
						type: foundWord[0].randomType()
					});
				}
				else{
					console.log("Calling Big Huge Theasaurus for help!")
					request.get({
						endpoint: endpoint.nyms + config.words + "/" + req.word + "/json",
						success: function(result){
							console.log("Success");
							mongo.store(req.word, JSON.parse(result))
								.then(function(newWord){
									// console.log("Type: " + newWord.randomType());
									// console.log(newWord)
									res.json({
										word: newWord,
										type: newWord.randomType()
									});
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

	router.get("/getList/:level", function(req, res){
		console.log(req.level);
		res.json(require("./words")(req.level));
	})

	return router;
}