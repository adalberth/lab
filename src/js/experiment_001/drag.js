(function(){
	function dragConstructor(opts){
	 	var self = {};
	 	var opts = opts || {};
	 	
	 	var x;
	 	var s;

	 	/*
	 	* Private
	 	*/
	 	function init(){
	 		x = 0;
	 		s = 0;
	 	}

	 	function start(v){
	 		s = x - v;
	 	}

	 	function stop(v){
	 		update(v);
	 	}

	 	function move(v){
	 		x =  s + v;
	 		return x;
	 	}

	 	function update(v){
	 		x = v;
	 	}


	 	/*
	 	* Public
	 	*/

	 	self.start = start;
	 	self.stop = stop;

	 	self.move = move;
	 	self.update = update;

	 	/*
	 	* Init
	 	*/

	 	init();

	 	return self;
	}

	module.exports = dragConstructor;
}())