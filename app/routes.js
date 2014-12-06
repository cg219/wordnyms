module.exports = function(router){
	router.get("/", function(req, res){
		console.log("Hi");
		res.send("Hi");
	})

	return router;
}

