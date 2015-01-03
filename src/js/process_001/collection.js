(function(){

	var singleton = require('../singleton');
	var stupid = require('../stupid');
	var createElement = require('./element');

	function createCollection(){
	 	var self = {}; 
	 	var numOfElements = 200; //window.innerWidth / 4;
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
	 		// ctx.fillStyle = 'rgba(0,0,0,0.05);';
	 		// ctx.fillRect(0,0,window.innerWidth,window.innerHeight);

	 		renderElemenets();

	 		canvas.update();

	 	}

	 	function renderElemenets(){
	 		loop(outerLoop);
	 	}

	 	function outerLoop(el){
 			el.render();
 			loop(innerLoop, el); 
 		}

 		function innerLoop(other, i, data){
 			var el = data[0];
			if(el.getID() === other.getID()) return;
			
			var loc = el.getLocation(); 
			var otherLoc = other.getLocation();

			var dist = PVector.dist(loc, otherLoc);
			dist -= el.getRadius() + other.getRadius();
			dist = parseInt(dist);

			if(dist < 20 && dist > 0){ 
				var diff = other.getVelocity(); 
				diff.normalize();
				diff.div(dist / 3);
				el.applyForce(diff);
			}else if(dist < 0){
				var diff = PVector.sub(loc, otherLoc);
				diff.normalize();
				diff.mult(1);
				el.applyForce(diff);
			}
		}


	 	function createElements(){
	 		for (var i = 0; i < numOfElements; i++) {
	 			elements.push(createElement(i));			
	 		};
	 	}

	 	return self;
	} 

	module.exports = createCollection;
}())