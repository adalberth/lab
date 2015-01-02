(function(){
	/*
	* Avoid 
	*/
	var createCollection = require('../js/process_001/collection');
	var singleton = require('../js/singleton');

	$(document).ready(function(){
		singleton.init(); 

		var elements = createCollection();
	});	 
}())