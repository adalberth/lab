(function(){
	
	var createCollection = require('../js/process_003/collection');
	var singleton = require('../js/singleton');

	$(document).ready(function(){
		singleton.init(); 
 
		var elements = createCollection(); 
	});	 

}())