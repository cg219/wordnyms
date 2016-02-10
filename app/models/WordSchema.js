var _ = require("underscore");

module.exports = function(mongoose){
	var schema = new mongoose.Schema({
		name: {
			type: String,
			unique: true
		},
		types: {
			adjective: Boolean,
			noun: Boolean,
			verb: Boolean
		},
		definitions: {
			adjective: String,
			noun: String,
			verb: String
		},
		synonyms: {
			adjective: [String],
			noun: [String],
			verb: [String]
		},
		antonyms: {
			adjective: [String],
			noun: [String],
			verb: [String]
		},
		updated: {
			type: Date,
			default: Date.now
		}

	});

	schema.method("randomType", function(){
		var self = this;
		var validTypes = _.omit(self.types.toJSON(), function(value, key, object){
			return value !== true;
		});
		var validKeys = _.keys(validTypes);

		return validKeys[_.random(validKeys.length - 1)];

	});

	return schema;
}