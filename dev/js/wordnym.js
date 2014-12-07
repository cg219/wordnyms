angular.module("WordNyms", ["ngRoute", "ngResource"])
	.config(["$routeProvider", "$locationProvider", function(router, location){
		location.html5Mode(true);

		router
			.when("/", {
				templateUrl: "home.html",
				controller: "Main"
			})
			.when("/single/:player", {
				templateUrl: "single.html",
				controller: "SingleGame"
			})
			.when("/single/results/:player/:round", {
				templateUrl: "round.html",
				controller: "RoundRecap"
			})
	}])
	.factory("Word", ["$resource", function(resource){
		return resource("/api/nyms/:word");
	}])
	.factory("WordList", ["$resource", function(resource){
		return resource("/api/nyms/getList/:level")
	}])
	.factory("Player", function(){
		return {
			name: "",
			score: 0,
			correct: 0
		}
	})
	.directive("kmEnter", function(){
		return {
			restrict: "A",
			link: function(scope, element, attrs){
				element.bind("keypress", function(event){
					if(event.which == 13){
						scope.$eval(attrs.kmEnter);
					}
				})
			}
		}
	})
	.controller("Main", ["$scope", "$location", "Player",
		function(scope, location, player){

			scope.updateName = function(){
				player.name = scope.playerName;
			}

			scope.playSingle = function(playerName){
				location.path("/single/" + player.name);
			}
	}])
	.controller("SingleGame", ["$scope", "$resource", "WordList", "Word", "$interval", "$location", "Player",
		function(scope, resource, wordlist, word, interval, location, player){
			var timerTick;
			var list = wordlist.get({
				level: 2
			}, function(result){
				console.log(result);
				scope.getRandomWord();
			})

			scope.roundNumber = 1;
			scope.timer = 10;
			
			timerTick = interval(function(){
				scope.timer -= 1;
				if(scope.timer <= 0){
					interval.cancel(timerTick);
					scope.roundNumber++;
					location.path("/single/results/" + player.name + "/" + scope.roundNumber);
				}
			}, 1000);

			scope.$watch("antonyms", function(){
				scope.antonymsLeft = scope.antonyms ? scope.antonyms.length : 0;
			})

			scope.$watch("synonyms", function(){
				scope.synonymsLeft = scope.synonyms ? scope.synonyms.length : 0;
			})

			scope.getRandomWord = function(){
				console.log("Getting Random Word");

				word.get({
					word: list.words[_.random(list.words.length)]
				}, function(currentWord){
					console.log(currentWord);
					if(!currentWord.type){
						scope.nextWord();
						return;
					}

					scope.currentWordType = currentWord.type;
					scope.currentWord = currentWord.word.name;
					scope.antonyms = currentWord.word.antonyms[currentWord.type];
					scope.synonyms = currentWord.word.synonyms[currentWord.type];
				})
			}

			scope.nextWord = function(lastWord){
				list.words = _.without(list.words, lastWord);
				scope.getRandomWord();
				console.log(list);
			}

			scope.guess = function(){
				var guess = scope.playerGuess;

				if(_.contains(scope.antonyms, guess.toLowerCase())){
					scope.antonyms = _.without(scope.antonyms, guess.toLowerCase());
				}
				else if(_.contains(scope.synonyms, guess.toLowerCase())){
					scope.synonyms = _.without(scope.synonyms, guess.toLowerCase());
				}
				else{
					scope.timer -= 2;
				}

				scope.playerGuess = "";
			}

	}])
	.controller("RoundRecap", ["$scope", "$resource",
		function(scope, resource){

		}])