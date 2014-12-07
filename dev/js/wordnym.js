angular.module("WordNyms", ["ngRoute", "ngResource"])
	.config(["$routeProvider", "$locationProvider", function(router, location){
		location.html5Mode(true);

		router
			.when("/", {
				templateUrl: "home.html"
			})
			.when("/single/:player", {
				templateUrl: "single.html",
				controller: "SingleGame"
			})
	}])
	.factory("Word", ["$resource", function(resource){
		return resource("/api/nyms/:word");
	}])
	.factory("WordList", ["$resource", function(resource){
		return resource("/api/nyms/getList/:level")
	}])
	.controller("Player", ["$scope", "$location", function(scope, location){
		scope.playSingle = function(playerName){
			location.path("/single/" + playerName);
		}
	}])
	.controller("SingleGame", ["$scope", "$resource", "WordList", "Word", function(scope, resource, wordlist, word){
		console.log("Beginning Single Game");

		var list = wordlist.get({
			level: 2
		}, function(result){
			console.log(result);
			scope.getRandomWord();
		})

		scope.roundNumber = 1;

		scope.getRandomWord = function(){
			console.log("Getting Random Word");
			scope.currentWord = list.words[_.random(list.words.length)];
		}

		scope.nextWord = function(lastWord){
			list.words = _.without(list.words, lastWord);
			scope.getRandomWord();
			console.log(list);
		}

		scope.guess = function(guess){

		}

	}])