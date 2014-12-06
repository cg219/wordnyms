module.exports = function(mongoose){
	return new mongoose.Schema({
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
}