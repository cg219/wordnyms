var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var routes = require("./app/routes")(express.Router());
var nymAPI = require("./app/wordAPI")(express.Router(), app);
var host = process.env.NODE_ENV == "production" ? "0.0.0.0" : "localhost";
var port = process.env.PORT || 5000;

app.set("gameLevel", 2);

app.use(express.static(__dirname + "/public"));
app.use("/api/nyms", nymAPI);
app.use("/", routes);

app.listen(port, host, function(){
	console.log("Running");
});