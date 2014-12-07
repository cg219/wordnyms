var _ = require("underscore");

var WordList = function(words){
	this.words = words || [];
	return this;
}

WordList.prototype.get = function() {
	var self = this;
	var wordIndex = _.random(self.words.length).value();
	
	return self.words[wordIndex];
};

WordList.prototype.remove = function(word) {
	var self = this;

	self.words = _.without(self.words, word).value();
	return self;
};

WordList.prototype.add = function(word) {
	var self = this;

	self.words.push(word);
	return self;
};

WordList.prototype.addAll = function(list) {
	var self = this;

	self.words = list;
	return self;
};

module.exports = WordList;