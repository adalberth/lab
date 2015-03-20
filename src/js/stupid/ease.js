(function(){

	function easeConstructor(opts){
		var opts = opts || {};

 		var dx = 0;
 		var x = opts.start || 0;
 		var ease = opts.ease || 0.05;
 		var limit = opts.limit || 100;

 		return function(value){

	 		dx = parseInt((value - x) * limit) / limit;
			x += (dx * ease);

			return x;
 		}
 	}

 	module.exports = easeConstructor;

}())