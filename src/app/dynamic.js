(function(){
	/*
	* Dynamic Animation - Dette er en test
	*/
	var createDynamicAnimation = require('./../js/dynamic/dynamic_animation');
	var singleton = require('./../js/singleton');

	$(document).ready(function(){
		singleton.init();

		var dynamicAnimation = createDynamicAnimation();
			
	}); 
}())
