(function(){
	/*
	* Avoid 
	*/
	var createCollection = require('../js/avoid/collection');
	var singleton = require('../js/singleton');

	$(document).ready(function(){
		singleton.init(); 

		var elements = createCollection();
	});	
}())