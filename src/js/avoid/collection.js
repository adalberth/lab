(function(){

	var singleton = require('../singleton');
	var stupid = require('../stupid');
	var createElement = require('./element');

	function createCollection(){
	 	var self = {};
	 	var numOfElements = 200;
	 	var elements = [];
	 	var loop = stupid.createCollectionLoop(elements);
	 	var identify = { callback:render };
	 	var canvas = singleton.canvas.getInstance();
	 	var ctx = canvas.getCtx();

	 	init();

	 	function init(){
	 		createElements();
	 		singleton.tick.getInstance().add(identify);	
	 	}

	 	function render(){

	 		// singleton.canvas.getInstance().clear();
	 		ctx.fillStyle = 'rgba(0,0,0,0.05);';
	 		ctx.fillRect(0,0,window.innerWidth,window.innerHeight);

	 		renderElemenets();

	 		canvas.update();

	 	}

	 	function renderElemenets(){
	 		loop(outerLoop);

	 		function outerLoop(el){
	 			
	 			loop(innerLoop);

	 			function innerLoop(other){
	 				if(el === other) return;
	 				
	 				var loc = el.getLocation();
	 				var otherLoc = other.getLocation();

	 				var dist = PVector.dist(loc, otherLoc);
	 				dist -= el.getRadius() + other.getRadius();
	 				dist = dist < 0 ? 0 : dist;

	 				if(dist < 100){
	 					var diff = PVector.sub(loc, otherLoc);
	 					diff.normalize();
	 					diff.div(dist);
	 					el.applyForce(diff);
	 				}
	 			}

	 			el.render();
	 		}
	 	}


	 	function createElements(){
	 		for (var i = 0; i < numOfElements; i++) {
	 			elements.push(createElement());			
	 		};
	 	}

	 	return self;
	} 

	module.exports = createCollection;
}())