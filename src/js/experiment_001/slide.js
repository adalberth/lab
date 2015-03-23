function slideConstructor(opts){
 	var self = {};
 	var opts = opts || {};
 	
 	var force;
 	var mForce;

 	var acc;
 	var vel;

 	var t;
 	var x;
 	var k;
 	var mass;
 	var damp;
 	var ease;
 	var edge;

	var dragForce;

 	/*
 	* Private
 	*/
 
 	function init(){
 		k = opts.k || 0.1;
 		damp = opts.damp || 0.6;
 		ease = opts.ease || 0.9;
 		mass = opts.mase || 1;
 		mForce = opts.mForce || 30;
 		dragForce = opts.dragForce || 0.5;

 		t = 0;
 		x = 0;
 		acc = 0;
 		vel = 0;
 		edge = 0;
 		force = 0;
 	}
 
 	function move(v){
 		force = maxForce(v - t);
 		x = v;
 		t = v;
 		return v;
 	}

 	function drag(v){
 		x = v - ((v - t) * dragForce);

 		return x;
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
		force = (-1 * k) * (x - edge);
	    acc = force / mass;     
	    vel = damp * (vel + acc);        
	    x += vel;
	    t = x;

		return x;
 	}

	function setEdge(v){
		edge = v;
	}

 	function value(){ 
 		return x;
 	}

 	function setValue(v){
 		x = v;
 	}

 	function maxForce(f){
 		return Math.abs(f) > mForce ? f < 0 ? mForce * -1 : mForce : f;
 	}

 	/*
 	* Public
 	*/
 	
 	self.move = move;
 	self.drag = drag;
 	self.idle = idle;
 	self.edge = edge;
 	self.setEdge = setEdge;
 	self.value = value;
 	self.setValue = setValue;

 	/*
 	* Init
 	*/
 
 	init();
 
 	return self;
 }
 
 module.exports = slideConstructor;