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
 	var damp2;

 	var edge;

 	/*
 	* Private
 	*/
 
 	function init(){
 		t = 0;
 		damp = 0.75;
 		damp2 = 0.9;
 		x = 0;
 		acc = 0;
 		vel = 0;
 		force = 0;
 		k = 0.025;
 		mass = 1;

 		edge = 0;
 	}
 
 	function update(v){
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

		force *= damp2;

		return x;
 	}

 	function edge(){
 		calc(edge);

		return x;
 	}

 	function calc(v){
		force = -k * (x - v);
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
 	
 	self.update = update;
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