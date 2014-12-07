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
	.controller("Player", ["$scope", "$location",
		function(scope, location){
			scope.playSingle = function(playerName){
				location.path("/single/" + playerName);
		}
	}])
	.controller("SingleGame", ["$scope", "$resource", "WordList", "Word", "$interval",
		function(scope, resource, wordlist, word, interval){
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
				if(scope.timer <= 0){
					interval.cancel(timerTick);
					return;
				}
				scope.timer -= 1;
			}, 1000);

			window.Word = word;

			scope.getRandomWord = function(){
				console.log("Getting Random Word");

				word.get({
					word: list.words[_.random(list.words.length)]
				}, function(currentWord){
					console.log(currentWord);
					scope.currentWordType = currentWord.type;
					scope.currentWord = currentWord.word.name;
				})
			}

			scope.nextWord = function(lastWord){
				list.words = _.without(list.words, lastWord);
				scope.getRandomWord();
				console.log(list);
			}

			scope.guess = function(){
				console.log(scope.playerGuess);
			}

	}])