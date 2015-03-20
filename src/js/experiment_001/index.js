var prefix = require('../stupid/prefix');
var proxy = require('../stupid/proxy');
var dragConstructor = require('./drag');
var slideConstructor = require('./slide');
var tickSingleton = require('../stupid/tick');

function controlConstructor(opts){
 	var self = {};
 	var opts = opts || {};
 	
 	var tick = tickSingleton.getInstance();
 	var identify;
 	
 	var getContent;
 	var getWrapper;
 	var getBody;

 	var clientX;
 	var clientY;

 	var x;
 	var y;

 	var dragX;
 	var dragY;

 	var slideX;
 	var slideY;

 	var wDiff;
 	var hDiff;

 	var moving;
	 	
 	/*
 	* Private
 	*/
 
 	function init(){
 		getContent = proxy(function(){
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

 		x = 0;
 		y = 0;

 		moving = false;

 		identify = {callback:render};

 		updateDiffs();

		tick.add(identify);
 	}

 	function updateDiffs(){
 		wDiff = getWrapper()[0].offsetWidth - getContent()[0].offsetWidth;
 		hDiff = getWrapper()[0].offsetHeight - getContent()[0].offsetHeight;
 	}

 	function events(){
 		getWrapper().on('mousedown touchstart',function(e){
 			setClient(e)
 			mouseDown(e);

 			getWrapper().on('mousemove touchmove',function(e){
 				e.preventDefault();
	 			setClient(e)
	 			mouseMove(e);
	 		});

 			getBody().on('mouseup',function(e){
 				mouseUp(e);
 			});

 			getWrapper().on('touchend',function(e){
 				mouseUp(e);
 			});
 		});
 	}

 	function setClient(e){
		clientX = e.originalEvent.touches ? e.originalEvent.touches[0].clientX : e.clientX;
		clientY = e.originalEvent.touches ? e.originalEvent.touches[0].clientY : e.clientY;
 	}

 	function mouseDown(e){
 		moving = true;

 		dragX.start(clientX);
 		dragY.start(clientY);
 	}

 	function mouseMove(e){

 	}

 	function mouseUp(e){
 		moving = false;
 		getWrapper().off('mousemove touchmove');
 		getBody().off('mouseup touchup');
 	}

 	function isBelow(v, v2){
 		return Boolean(v > v2);
 	}

 	function isAbove(v, v2){
 		return Boolean(v < v2);
 	}

 	function render(){

 		if(moving){

 			x = slideX.move( dragX.move(clientX) );
 			y = slideY.move( dragY.move(clientY) );

 		}else{

 			if(isBelow(x, 0)){
 				slideX.setEdge(0);
 			}else if(isAbove(x, wDiff)){
 				slideX.setEdge(wDiff);
 			}

			x = isBelow(x, 0) || isAbove(x, wDiff) ? slideX.edge() : slideX.idle();
 			dragX.update(x);


 			if(isBelow(y, 0)){
 				slideY.setEdge(0);
 			}else if(isAbove(y, hDiff)){
 				 slideY.setEdge(hDiff);
 			}

			y = isBelow(y, 0) || isAbove(y, hDiff) ? slideY.edge() : slideY.idle();
 			dragY.update(y); 
 		}

 		getContent()[0].style[prefix.js + 'Transform'] = "translate3d("+ x +"px,"+ y +"px, 0px)";
 	}

 	/*
 	* Public
 	*/
 	
 	self.updateContent = updateDiffs;

 	/*
 	* Init
 	*/
 
 	init();
 	events();
 
 	return self;
 }

 module.exports = controlConstructor;
