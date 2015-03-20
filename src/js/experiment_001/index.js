var prefix = require('../stupid/prefix');
var proxy = require('../stupid/proxy');
var dragConstructor = require('./drag');
var slideConstructor = require('./slide');
var tickSingleton = require('../stupid/tick');

function controlConstructor(opts){
 	var self = {};
 	var opts = opts || {};
 	
 	var identify = {callback:render};
 	var tick = tickSingleton.getInstance();
 	
 	var getSquare;
 	var getWrapper;
 	var getBody;

 	var clientX;
 	var clientY;

 	var itemX;
 	var itemY;

 	var x;
 	var y;

 	var dragX;
 	var dragY;
 	var slideX;
 	var slideY;

 	var moving;

 	var state;
	 	
 	/*
 	* Private
 	*/
 
 	function init(){
 		getSquare = proxy(function(){
 			return $('.square');
 		});

 		getWrapper = proxy(function(){
 			return $('.wrapper');
 		});

 		getBody = proxy(function(){
 			return $('body');
 		});

 		dragX = dragConstructor();
 		dragY = dragConstructor();

 		slideX = slideConstructor();
 		slideY = slideConstructor();

 		itemX = 0;
 		itemY = 0;

 		x = 0;
 		y = 0;

 		moving = false;

		tick.add(identify);
 	}

 	function events(){

 		getWrapper().on('mousedown',function(e){
 			setClient(e)
 			mouseDown(e);

 			getWrapper().on('mousemove',function(e){
	 			setClient(e)
	 			mouseMove(e);
	 		});

 			getBody().on('mouseup',function(e){
 				setClient(e)
 				mouseUp(e);
 			})
 		});
 	}

 	function setClient(e){
 		e.preventDefault();
		clientX = e.clientX;
		clientY = e.clientY;
 	}

 	function mouseDown(e){
 		// console.log('mouseDown');
 		moving = true;
 		dragX.start(clientX);
 	}

 	function mouseMove(e){
 		// console.log('mouseMove');
 		// itemX = drag.move(clientX);
 		// itemY = 0; //d.y;
 	}

 	function mouseUp(e){
 		moving = false;
 		// console.log('mouseUp');
 		getWrapper().off('mousemove');
 		getBody().off('mouseup');
 	}


 	function render(){

 		if(moving){

 			x = slideX.update( dragX.move(clientX) );
 			y = slideY.update( dragY.move(clientY) );

 		}else{

 			var isBelow = Boolean(x > 0);
 			var isAbove = Boolean(x < (getWrapper()[0].offsetWidth - getSquare()[0].offsetWidth));

 			if(isBelow) slideX.setEdge(0);
 			if(isAbove) slideX.setEdge(getWrapper()[0].offsetWidth - getSquare()[0].offsetWidth);

			x = isBelow || isAbove ? slideX.edge() : slideX.idle();

 			dragX.update(x); 
 		}

 		getSquare()[0].style[prefix.js + 'Transform'] = "translate3d("+ x +"px,"+ 0 +"px,0px)";
 	}

 	/*
 	* Public
 	*/
 
 	/*
 	* Init
 	*/
 
 	init();
 	events();
 
 	return self;
 }

 module.exports = controlConstructor;
