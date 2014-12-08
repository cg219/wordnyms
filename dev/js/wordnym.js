$.material.init();

angular.module("WordNyms", ["ngRoute", "ngResource", "ngAudio"])
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
			highestStreak: 0,
			allGuesses: [],
			currentWordInfo: {},
			currentCorrectAnswers: [],
			gameLevel: 1,
			resetStats: function(){
				this.score = 0;
				this.roundScore = 0;
				this.correct = 0;
				this.streak = 0;
				this.roundStreak = 0;
				this.highestStreak = 0;
				this.allGuesses = [];
				this.currentWordInfo = {};
				this.currentCorrectAnswers = [];
			}
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
	.controller("Main", ["$scope", "$location", "Player", "ngAudio",
		function(scope, location, player, audio){
			var validateFields = function(){
				var isValid = true;
				
				if(scope.playerName == "" || scope.playerName == undefined){
					isValid = false;
				}
				
				if(scope.playerAge == "" || scope.playerAge == undefined){
					isValid = false;
				}

				return isValid;
			}

			scope.chosenLevel = 1;

			scope.updateName = function(){
				player.name = scope.playerName;
			}

			scope.playSingle = function(playerName){
				if(validateFields()){
					player.gameLevel = scope.chosenLevel;
					location.path("/game/solo/" + player.name + "/1");
				}
				else{
					alert("Please fill out Age and Name");
				}
			}
	}])
	.controller("SingleGame", ["$scope", "$resource", "WordList", "Word", "$interval", "$location", "Player", "$routeParams",
		function(scope, resource, wordlist, word, interval, location, player, route){
			
			var gameLevel;
			var timerTick;
			var list;

			scope.checkingGuess = false
			scope.roundNumber = route.round;
			scope.timer = 60;
			scope.guesses = [];
			scope.score = 0;
			gameLevel = player.gameLevel;
			player.roundStreak = 0;
			player.roundScore = 0;
			player.correct = 0;
			list = wordlist.get({
				level: gameLevel
			}, function(result){
				// console.log(result);
				getRandomWord();
			})
			
			timerTick = interval(function(){
				if(scope.timer <= 0){
					interval.cancel(timerTick);

					player.score += player.roundScore;
					player.highestStreak = player.roundStreak > player.highestStreak ? player.roundStreak : player.highestStreak

					if(!scope.checkingGuess){
						gotoEndPage();
					}
				}
				scope.timer -= 1;
			}, 1000);

			scope.$watch("antonyms", function(){
				scope.antonymsLeft = scope.antonyms ? scope.antonyms.length : 0;
			})

			scope.$watch("synonyms", function(){
				scope.synonymsLeft = scope.synonyms ? scope.synonyms.length : 0;
			})

			scope.$watch("checkingGuess", function(){
				if(scope.timer <= 0){
					if(!scope.checkingGuess){
						gotoEndPage();
					}
				}
			})

			/* Functions */

			var getRandomWord = function(){
				console.log("Getting Random Word");

				word.get({
					word: list.words[_.random(list.words.length)]
				}, function(currentWord){
					// console.log(currentWord);
					if(!currentWord.type){
						scope.nextWord();
						return;
					}

					scope.currentWordType = currentWord.type;
					scope.currentWord = currentWord.word.name;
					scope.antonyms = currentWord.word.antonyms[currentWord.type];
					scope.synonyms = currentWord.word.synonyms[currentWord.type];

					var wordAnswers = {
						antonyms: currentWord.word.antonyms[currentWord.type],
						synonyms: currentWord.word.synonyms[currentWord.type],
						word: currentWord.word.name,
						type: currentWord.type
					}

					player.currentWordInfo = wordAnswers;
					player.currentCorrectAnswers = [];
				})
			}

			var updateScore = function(){
				player.streak++;

				var levelMultiplier = scope.roundNumber;
				var guessMultiplier = player.streak >= 3 ? (player.streak - 2) * 10 : 0;
				var baseReward = gameLevel * 10;

				player.roundStreak = player.streak > player.roundStreak ? player.streak : player.roundStreak;
				player.roundScore += (baseReward * levelMultiplier) + guessMultiplier;
				player.correct++;

				scope.score = player.roundScore;
			}

			var gotoEndPage = function(){
				if(scope.roundNumber == 3 ){
					location.path("/results/solo/final/" + player.name);
				}
				else{
					location.path("/results/solo/round/" + player.name + "/" + scope.roundNumber);
				}
			}

			/* Scope Functions */

			scope.nextWord = function(lastWord){
				player.allGuesses.push({
					name: player.currentWordInfo.word,
					type: player.currentWordInfo.type,
					synonyms: player.currentWordInfo.synonyms,
					antonyms: player.currentWordInfo.antonyms,
					correct: player.currentCorrectAnswers,
					round: scope.roundNumber
				})

				scope.guesses = [];
				list.words = _.without(list.words, lastWord);
				getRandomWord();
				// console.log(list);
			}

			scope.guess = function(){
				var guess = scope.playerGuess.toLowerCase();
				scope.checkingGuess = true;

				if(_.contains(scope.antonyms, guess)){
					scope.antonyms = _.without(scope.antonyms, guess);
					updateScore();
					scope.checkingGuess = false;
					player.currentCorrectAnswers.push(guess);
					scope.guesses.push({
						word: guess,
						class: "info"
					})
				}
				else if(_.contains(scope.synonyms, guess)){
					scope.synonyms = _.without(scope.synonyms, guess);
					updateScore();
					scope.checkingGuess = false;
					player.currentCorrectAnswers.push(guess);
					scope.guesses.push({
						word: guess,
						class: "info"
					})
				}
				else{
					scope.timer -= 2;
					player.streak = 0;
					scope.checkingGuess = false;
					scope.guesses.push({
						word: guess,
						class: "danger"
					})
				}

				if(scope.synonymsLeft <= 0 && scope.antonymsLeft <= 0 ){
					scope.nextWord(scope.currentWord);
				}

				scope.playerGuess = "";
			}

	}])
	.controller("RoundRecap", ["$scope", "$resource", "Player", "$interval", "$location", "$routeParams",
		function(scope, resource, player, interval, location, route){
			scope.player = player;
			scope.timer = 15;
			scope.roundNumber = route.round;

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

			scope.playAgain = function(){
				player.resetStats();
				location.path("/game/solo/" + player.name + "/1");
			}
		}])