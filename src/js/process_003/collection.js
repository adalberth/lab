(function(){

	var singleton = require('../singleton');
	var stupid = require('../stupid');
	var createElement = require('./element');

	function createCollection(){
	 	var self = {}; 
	 	var numOfElements = window.innerHeight / 2; //window.innerWidth / 4;
	 	var elements = [];
	 	var loop = stupid.createCollectionLoop(elements);
	 	var identify = { callback:render };
	 	var singleCanvas = singleton.canvas.getInstance();
	 	var canvas = singleCanvas.getCanvas();
	 	var ctx = singleCanvas.getCtx();

	 	init();

	 	function init(){
	 		createElements();
	 		singleton.tick.getInstance().add(identify);	
	 	}

	 	function render(){

	 		// singleCanvas.clear(); 
	 		// ctx.fillStyle = 'rgba(2, 2, 24, 0.01)'; 
	 		// ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
	 		
	 		ctx.drawImage(canvas,
	 			0, 0, canvas.width, canvas.height,
	 			-1, 0, canvas.width, canvas.height
	 		);

	 		renderElemenets(); 


	 	}

	 	function renderElemenets(){
	 		loop(outerLoop);
	 	}

	 	function outerLoop(el){
 			el.render();
 			// loop(innerLoop, el); 
 		}

 	// 	function innerLoop(other, i, data){
 	// 		var el = data[0];
		// 	if(el.getID() === other.getID()) return;
			
		// 	var loc = el.getLocation(); 
		// 	var otherLoc = other.getLocation();

		// 	var dist = PVector.dist(loc, otherLoc);
		// 	dist -= el.getRadius() + other.getRadius();
		// 	dist = parseInt(dist);

		// 	if(dist < 20){
		// 		var otherDist = dist < 1 ? 1 : dist / 10 + 1;
		// 		var force = other.getVelocity(); 
		// 		force.normalize();
		// 		// force.div( otherDist / 5);
		// 		el.applyForce(force);
		// 	}

		// 	if(dist < 0){
		// 		var diff = PVector.sub(loc, otherLoc);
		// 		diff.normalize();
		// 		// diff.mult(1.5);
		// 		el.applyForce(diff);
		// 	}
		// }


	 	function createElements(){
	 		for (var i = 0; i < numOfElements; i++) {
	 			elements.push(createElement(i));			
	 		};
	 	}

	 	return self;
	} 

	module.exports = createCollection;
}())