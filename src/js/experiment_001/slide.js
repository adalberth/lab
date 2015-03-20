var onceConstructor = require('../stupid/once');

function slideConstructor(opts){
 	var self = {};
 	var opts = opts || {};
 	
 	var force;
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
 	var di;
	var dv;
	var dd;

 	var once;

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
 		ease = 0.8;
 		mass = 1;
 		edge = 0;
 		force = 0;

 		dx = false;
 		di = 0;
 		dv = 0;
 		dd = 0.7;
 	}
 
 	function move(v){
 		force = v - t;
 		t = v;
 		x = v;

 		return v;
 	}

 	function drag(v){
 		if(!dx) dx = v;

 		di = v - dx;
 		dv = v - (di * dd);
 		force = dv - t;
 		t = dv;
 		x = dv;

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
 		calc(edge);

		return x;
 	}

 	function calc(v){
		force = (-1 * k) * (x - v);
	    acc = force / mass;     
	    vel = damp * (vel + acc);        
	    x += vel;

	    reset();
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