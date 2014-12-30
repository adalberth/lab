(function(){
	
	var singleton = require('../singleton');
	var PVector = require('../pvector');
	var stupid = require('../stupid');

	function createElement(){
	 	var self = {};
	 	var canvas = singleton.canvas.getInstance();
	 	var ctx = canvas.getCtx();
	 	var tick = singleton.tick.getInstance();

	 	var radius = Math.random() * 10 + 20;

	 	var color = "white";

	 	var acc = getRandomAcceleration();
	 	var vel = new PVector(0,0);
	 	var loc = new PVector(window.innerWidth * Math.random(), 
	 						  window.innerHeight * Math.random());

	 	init();

	 	function init(){
	 		draw();
	 	}

	 	function getRandomAcceleration(){
	 		return new PVector(stupid.random.negpos() * Math.random(),stupid.random.negpos() * Math.random());
	 	}
		function draw(){
			ctx.save();
				ctx.fillStyle = color;
				ctx.beginPath();
				ctx.arc(loc.x,loc.y,radius, 0 , 2*Math.PI);
				ctx.fill();
			ctx.restore();
		}

		function update(){
	 		vel.mult(0.5);

	 		vel.add(acc);
		    loc.add(vel);

	 		vel.limit(2);
	 		acc.limit(5);
	 		//acc.mult(0.25);
	 		// if(singleton.tick.getInstance().getTick() % 25 === 0) acc = getRandomAcceleration();

	 	}
	 	
	 	function applyForce(force){
    		acc.add(force);
	 	}

		function bounderies(){
			var width = window.innerWidth;
			var height = window.innerHeight;

			if(loc.x < radius * -1){
				loc.x = width + radius;
			}else if(loc.x > width + radius){
				loc.x = radius * -1;
			}

			if(loc.y < radius * -1){
				loc.y = height + radius;
			}else if(loc.y > height + radius){
				loc.y = radius * -1;
			}
		}


		self.applyForce = applyForce;

		self.render = function(){
			update();
			bounderies();
			draw();
		}

		self.getLocation = function(){
			return loc;
		}

		self.getVelocity = function(){
			return vel;
		}

		self.getAcceleration = function() {
			return acc;
		};

		self.getRadius = function() {
			return radius;
		};

		self.active = function() {
			color = "red";
		};

		self.normal = function() {
			color = "white";
		};

	 	return self;
	} 

	module.exports = createElement;

}())