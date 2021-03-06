var prefix = require('./stupid/prefix');
var proxy = require('./stupid/proxy');
var dragConstructor = require('./drag');
var slideConstructor = require('./slide');
var tickSingleton = require('./stupid/tick');


/*
* ScrollBox
* v1.0.0
*/

function scrollBoxConstructor(opts){
 	var self = {};
 	var opts = opts || {};
 	
 	var tick = tickSingleton.getInstance();
 	var identify;
 	
 	var getContent;
 	var getWrapper;
 	var getWindow;

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
 			return $(opts.content || '.content');
 		});

 		getWrapper = proxy(function(){
 			return $(opts.wrapper || '.wrapper');
 		});

 		getWindow = proxy(function(){
 			return $(window);
 		});

 		dragX = dragConstructor();
 		dragY = dragConstructor();

 		slideX = slideConstructor({name: 'slideX'});
 		slideY = slideConstructor();

 		x = 0;
 		y = 0;

 		moving = false;

 		identify = {callback:render};

 		updateDiffs();

 		center();

		tick.add(identify);

		render();

 	}

 	function updateDiffs(){
 		wDiff = getWrapper()[0].offsetWidth - getContent()[0].offsetWidth;
 		hDiff = getWrapper()[0].offsetHeight - getContent()[0].offsetHeight;
 	}

 	function events(){

 		getWindow().on('resize', function(){
 			updateDiffs();
 		});

 		getWrapper().on('mousedown touchstart', function(e){
 			setClient(e)
 			mouseDown(e);

 			getWrapper().on('mousemove touchmove', function(e){
 				e.preventDefault();
	 			setClient(e)
	 			mouseMove(e);
	 		});

 			getWindow().on('mouseup', function(e){
 				mouseUp(e);
 			});

 			getWrapper().on('touchend', function(e){
 				mouseUp(e);
 			});
 		});

 		getWrapper().trigger('mousedown touchstart');
 	}

 	function setClient(e){
		clientX = e.originalEvent.touches ? e.originalEvent.touches[0].clientX : e.clientX;
		clientY = e.originalEvent.touches ? e.originalEvent.touches[0].clientY : e.clientY;
 	}

 	function center(){
 		x = wDiff / 2;
 		y = hDiff / 2;
 		slideX.setValue(x);
 		slideY.setValue(y);
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
 		getWindow().off('mouseup touchup');
 	}

 	function isBelow(v, v2){
 		return Boolean(v >= v2);
 	}

 	function isAbove(v, v2){
 		return Boolean(v <= v2);
 	}


 	function move(){
 		x = isBelow(x, 0) || isAbove(x, wDiff) ? slideX.drag( dragX.move(clientX) ) : slideX.move( dragX.move(clientX) );
		y = isBelow(y, 0) || isAbove(y, hDiff) ? slideY.drag( dragY.move(clientY) ) : slideY.move( dragY.move(clientY) );
 	}

 	function idle(){
 		if(isBelow(x, 0) && wDiff < 0){
			slideX.setEdge(0);
		}else if(isAbove(x, wDiff) && wDiff < 0){
			slideX.setEdge(wDiff);
		}else if(wDiff > 0){
			slideX.setEdge(wDiff / 2);
		}

		x = isBelow(x, 0) || isAbove(x, wDiff) ? slideX.edge() : slideX.idle();

		dragX.update(x);

		if(isBelow(y, 0) && hDiff < 0){
			slideY.setEdge(0);
		}else if(isAbove(y, hDiff) && hDiff < 0){
			slideY.setEdge(hDiff);
		}else if(hDiff > 0){
			slideY.setEdge(hDiff / 2);
		}

		y = isBelow(y, 0) || isAbove(y, hDiff) ? slideY.edge() : slideY.idle();

		dragY.update(y); 
 	}

 	function render(){

 		if(moving){
 			move();
 		}else{
 			idle();
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

 module.exports = scrollBoxConstructor;
