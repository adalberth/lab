(function(){
	
	/*
	* Snake
	*/
	// var createSnakeCollection = require('./snake_collection');
	// var singleton = require('./singleton');

	// $(document).ready(function(){
	// 	singleton.init();

	// 	var numberOfSnakes = window.innerWidth / 40;

	// 	var snakeCollection = createSnakeCollection({
	// 		numberOfSnakes: numberOfSnakes,
	// 		delayBetweenSnakes:0
	// 	});
	// });	
	

	/*
	* Curved Animation
	*/
	// var createCurvedAnimation = require('./curved_animation');
	// var singleton = require('./singleton');

	// $(document).ready(function(){
	// 	singleton.init();

	// 	var curvedAnimation = createCurvedAnimation();
			
	// });	

	/*
	* Dynamic Animation
	*/
	var createDynamicAnimation = require('./dynamic_animation');
	var singleton = require('./singleton');

	$(document).ready(function(){
		singleton.init();

		var dynamicAnimation = createDynamicAnimation();
			
	});
}())
