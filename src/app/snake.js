(function(){
	/*
	* Snake 
	*/
	var createSnakeCollection = require('../js/snake/snake_collection');
	var singleton = require('../js/singleton');

	$(document).ready(function(){
		singleton.init();

		var numberOfSnakes = window.innerWidth / 40;

		var snakeCollection = createSnakeCollection({
			numberOfSnakes: numberOfSnakes,
			delayBetweenSnakes:0
		});
	});	
}())