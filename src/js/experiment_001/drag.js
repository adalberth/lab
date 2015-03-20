(function(){
	function dragConstructor(opts){
	 	var self = {};
	 	var opts = opts || {};
	 	
	 	var x;
	 	var sx;

	 	/*
	 	* Private
	 	*/
	 	function init(){
	 		x = 0;
	 		sx = 0;
	 	}

	 	function start(vx){
	 		sx = x - vx;
	 	}

	 	function stop(vx){
	 		update(vx);
	 	}

	 	function move(vx){
	 		x =  sx + vx;
	 		return x;
	 	}

	 	function update(vx){
	 		x = vx;
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