var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var routes = require("./app/routes")(express.Router());
var nymAPI = require("./app/wordAPI")(express.Router());

app.use("/", routes);
app.use("/api/nyms", nymAPI);

app.listen(1234, function(){
	console.log("Running");
});