angular.module("WordNyms", ["ngRoute", "ngResource"])
	.config(["$routeProvider", "$locationProvider", function(router, location){
		location.html5Mode(true);

		router
			.when("/", {
				templateUrl: "home.html",
				controller: "Main"
			})
			.when("/game/solo/:player/:round", {
				templateUrl: "single.html",
				controller: "SingleGame"
			})
			.when("/results/solo/round/:player/:round", {
				templateUrl: "round.html",
				controller: "RoundRecap"
			})
			.when("/results/solo/final/:player", {
				templateUrl: "final.html",
				controller: "FinalStats"
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
			roundScore: 0,
			correct: 0,
			streak: 0,
			roundStreak: 0,
			highestStreak: 0
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
				location.path("/game/solo/" + player.name + "/1");
			}
	}])
	.controller("SingleGame", ["$scope", "$resource", "WordList", "Word", "$interval", "$location", "Player", "$routeParams",
		function(scope, resource, wordlist, word, interval, location, player, route){
			scope.roundNumber = route.round;
			scope.timer = 10;
			scope.gameLevel = 1;
			player.roundStreak = 0;
			player.roundScore = 0;
			player.correct = 0;

			var timerTick;
			var list = wordlist.get({
				level: scope.gameLevel
			}, function(result){
				console.log(result);
				scope.getRandomWord();
			})
			
			timerTick = interval(function(){
				scope.timer -= 1;
				if(scope.timer <= 0){
					interval.cancel(timerTick);

					player.score += player.roundScore;
					player.highestStreak = player.roundStreak > player.highestStreak ? player.roundStreak : player.highestStreak

					if(scope.roundNumber == 3 ){
						location.path("/results/solo/final/" + player.name);
					}
					else{
						location.path("/results/solo/round/" + player.name + "/" + scope.roundNumber);
					}
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

			scope.updateScore = function(){
				player.streak++;

				var levelMultiplier = scope.roundNumber;
				var guessMultiplier = player.streak >= 3 ? (player.streak - 2) * 10 : 0;
				var baseReward = scope.gameLevel * 10;

				player.roundStreak = player.streak > player.roundStreak ? player.streak : player.roundStreak;
				player.roundScore += (baseReward * levelMultiplier) + guessMultiplier;
				player.correct++;

				console.log("Score: " + player.roundScore);
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
					scope.updateScore();
				}
				else if(_.contains(scope.synonyms, guess.toLowerCase())){
					scope.synonyms = _.without(scope.synonyms, guess.toLowerCase());
					scope.updateScore();
				}
				else{
					scope.timer -= 2;
					player.streak = 0;
				}

				scope.playerGuess = "";
			}

	}])
	.controller("RoundRecap", ["$scope", "$resource", "Player", "$interval", "$location", "$routeParams",
		function(scope, resource, player, interval, location, route){
			scope.player = player;
			scope.timer = 15;

			console.log(route);

			var timerTick = interval(function(){
				scope.timer -= 1;
				if(scope.timer <= 0){
					interval.cancel(timerTick);

					location.path("/game/solo/" + player.name + "/" + ++route.round);
				}
			}, 1000);
		}])
	.controller("FinalStats", ["$scope", "$resource", "Player", "$interval", "$location",
		function(scope, resource, player, interval, location){
			scope.player = player;
		}])