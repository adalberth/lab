function slideConstructor(opts){
 	var self = {};
 	var opts = opts || {};
 	
 	var force;
 	var acc;
 	var vel;
 	var t;
 	var x;
 	var k;
 	var mass;
 	var damp;
 	var ease;
 	var edge;

 	/*
 	* Private
 	*/
 
 	function init(){
 		t = 0;
 		x = 0;
 		k = 0.03;
 		acc = 0;
 		vel = 0;
 		damp = 0.7;
 		ease = 0.9;
 		mass = 1;
 		edge = 0;
 		force = 0;
 	}
 
 	function move(v){
 		force = v - t;
 		t = v;
 		x = v;

 		return v;
 	}

 	function idle(){
		acc = force;     
		vel = damp * (vel + acc); 
		x += vel;
		t = x;
		force *= ease;

		return x;
 	}

 	function edge(){
 		calc(edge);

		return x;
 	}

 	function calc(v){
		force = (-1 * k) * (x - v);
	    acc = force / mass;     
	    vel = damp * (vel + acc);        
	    x += vel;
	}

	function setEdge(v){
		edge = v;
	}

 	function value(){
 		return x;
 	}

 	/*
 	* Public
 	*/
 	
 	self.move = move;
 	self.idle = idle;
 	self.edge = edge;
 	self.setEdge = setEdge;
 	self.value = value;

 	/*
 	* Init
 	*/
 
 	init();
 
 	return self;
 }
 
 module.exports = slideConstructor;