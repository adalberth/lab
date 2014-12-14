(function(){
	/* 
	* Curved Animation
	*/
	var createCurvedAnimation = require('../js/curve/curved_animation');
	var singleton = require('../js/singleton'); 

	$(document).ready(function(){
		singleton.init(); 
 
		var curvedAnimation = createCurvedAnimation(); 
			
	}); 

	console.log("Hello World");

}())
  