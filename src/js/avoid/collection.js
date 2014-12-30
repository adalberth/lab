(function(){

	var singleton = require('../singleton');
	var stupid = require('../stupid');
	var createElement = require('./element');

	function createCollection(){
	 	var self = {};
	 	var numOfElements = 20;
	 	var elements = [];
	 	var loop = stupid.createCollectionLoop(elements);
	 	var identify = { callback:render };

	 	init();

	 	function init(){
	 		createElements();
	 		singleton.tick.getInstance().add(identify);	
	 	}

	 	function render(){

	 		singleton.canvas.getInstance().clear();

	 		loop(outerLoop);

	 		function outerLoop(el){
	 			el.normal();
	 			
	 			loop(innerLoop);

	 			function innerLoop(other){
	 				if(el === other) return;
	 				
	 				var loc = el.getLocation();
	 				var otherLoc = other.getLocation();

	 				var dist = PVector.dist(loc, otherLoc);
	 				dist -= el.getRadius() + other.getRadius();
	 				dist = dist < 0 ? 0 : dist;

	 				if(dist === 0){
	 					//el.active();
	 					var diff = PVector.sub(loc, otherLoc);
	 					diff.normalize();
	 					el.applyForce(diff);
	 				}
	 			}

	 			el.render();
	 		}

	 		singleton.canvas.getInstance().update();

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