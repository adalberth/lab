var onceConstructor = require('../stupid/once');

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
 	var tx;
 	var mass;
 	var damp;
 	var ease;
 	var edge;

 	var dx;
	var dd;

 	var once;

 	/*
 	* Private
 	*/
 
 	function init(){
 		t = 0;
 		x = 0;

 		k = 0.1;
 		damp = 0.6;
 		ease = 0.8;
 		mass = 1;

 		acc = 0;
 		vel = 0;
 		
 		edge = 0;

 		force = 0;
 		mForce = 30;

 		dx = false;
 		dd = 0.6;
 	}
 
 	function move(v){
 		force = maxForce(v - t);
 		t = v;
 		x = v;

 		return v;
 	}

 	function drag(v){
 		if(!dx) dx = v;

 		x = v - ((v - dx) * dd);

 		return x;
 	}

 	function idle(){
		acc = force;     
		vel = damp * (vel + acc); 
		x += vel;
		t = x;

		force *= ease;

		reset();

		return x;
 	}

 	function edge(){
		force = (-1 * k) * (x - edge);
	    acc = force / mass;     
	    vel = damp * (vel + acc);        
	    x += vel;

	    reset();

		return x;
 	}

	function setEdge(v){
		edge = v;
	}

 	function value(){ 
 		return x;
 	}

 	function reset(){
 		dx = false;
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

 	/*
 	* Init
 	*/
 
 	init();
 
 	return self;
 }
 
 module.exports = slideConstructor;