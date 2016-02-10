var config = require("./../config/config.js") || {
	mongo: process.env.mongo,
	words: process.env.words
}
var mongoose = require("mongoose");
var WordModel = require("./models/WordModel")(mongoose);
var _ = require("underscore");
var conn;
var options = {
	server: {
		socketOptions: {
			keepAlive: 1,
			connectTimeoutMS: 30000
		}
	},
	replset: {
		socketOptions: {
			keepAlive: 1,
			connectTimeoutMS : 30000
		}
	}
};

mongoose.connect(config.mongo, options);
conn = mongoose.connection;

conn.on("error", function(error){
	console.log(error);
})

function loopNyms(collection, type, model){
	console.log(collection)
	_.each(collection, function(value, key, list){
		if(key == "syn" || key == "ant"){
			var section = key == "syn" ? "synonyms" : "antonyms"

			_.each(value, function(element, index, array){
				model[section][type] = array;
			})
		}
		
	})
}

var MongoNym = function(){

}

MongoNym.prototype.connect = function() {
	mongoose.connect(config.mongo);
};

MongoNym.prototype.search = function(word) {
	return WordModel
		.find({ name: word })
		.limit(1)
		.exec()
		.addCallback(function(results){
			if( results.length > 0){
				console.log("Found")
				return results;
			}
			else{
				console.log("Not Found");
				return undefined;
			}
		})
		.addErrback(function(error){
			console.log("Error");
			console.log(error);
			return error;
		});
};

MongoNym.prototype.store = function(word, data) {

	var self = this;
	var model = self.createNewWordModel(word, data);
	
	return WordModel
		.create(model)
		.addCallback(function(err, newWord){
			console.log("New Word Added to Database");
			return newWord;
		})
};

MongoNym.prototype.createNewWordModel = function(word, data) {
	var model = {
		name: word,
		types: {
			adjective: false,
			noun: false,
			verb: false
		},
		definitions: {
			adjective: "",
			noun: "",
			verb: ""
		},
		synonyms: {
			adjective: [],
			noun: [],
			verb: []
		},
		antonyms: {
			adjective: [],
			noun: [],
			verb: []
		},
	};

	_.each(data, function(value, key, list){
		switch(key){
			case "noun":
			case "verb":
			case "adjective":
				model.types[key] = true;
				loopNyms(value, key, model);
				break;
		}
	})

	return model;
};

module.exports = new MongoNym();

console.log("Connected to Mongo");