module.exports = function(mongoose){
	var WordSchema = require("./WordSchema")(mongoose);
	var Word = mongoose.model("Word", WordSchema);

	return Word;
}