(function(){
	
	var createCollection = require('../js/process_004/waves');
	var singleton = require('../js/singleton');

	$(document).ready(function(){
		singleton.init(); 
 
		var elements = createCollection(); 
	});	 

}())