var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var routes = require("./app/routes")(express.Router());
var nymAPI = require("./app/wordAPI")(express.Router(), app);
var port = process.env.NODE_ENV == "production" ? process.env.PORT : 5000;

app.set("gameLevel", 2);

app.use(express.static(__dirname + "/public"));
app.use("/api/nyms", nymAPI);
app.use("/", routes);

app.listen(port, function(){
	console.log("Running");
});