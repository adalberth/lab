(function(){
	
	var singleton = require('../singleton');
	var PVector = require('../pvector');
	var stupid = require('../stupid');

	function createElement(){
	 	var self = {};
	 	var canvas = singleton.canvas.getInstance();
	 	var ctx = canvas.getCtx();
	 	var tick = singleton.tick.getInstance();

	 	var minRadius = 1;
	 	var maxRadius = Math.random() * 2 + 1;
	 	var radius = minRadius;

	 	var solidColor = stupid.random.rgbColor();
	 	var transparentColor = 'rgba(0,0,0,0)';
	 	var color = solidColor;

	 	var acc = getRandomAcceleration();
	 	var vel = new PVector(0,0);
	 	var loc = new PVector(window.innerWidth * Math.random(), window.innerHeight * Math.random());

	 	var offset = stupid.random.negpos() * Math.random() * 1000;
	 	var limit = 2;

	 	var grow = createGrow();
	 	var rotate = createRotate();


	 	init();

	 	function init(){
	 		draw();
	 	}

	 	function getRandomAcceleration(mag){
	 		var mag = mag || 1;
	 		return new PVector(stupid.random.negpos() * Math.random() * mag,stupid.random.negpos() * Math.random() * mag);
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
	 		vel.add(acc);
		    loc.add(vel);
	 		vel.limit(limit);
	 		acc.mult(0);
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

		function createGrow(){
			var toggle = true;
			var increase = 0.01;
			return function() {
				if(radius > maxRadius || radius < minRadius) toggle = !toggle;
				if(toggle){
					radius += increase;
				}else{
					radius -= increase;
				}
			};
		}

		function createRotate(){
	 		var frequencyCos = Math.random() * 100 + 100;
	 		var frequencySin = Math.random() * 100 + 100;

	 		return function(){
		 		var frame = tick.getTick() + offset;
		 		var cos = Math.cos(frame / frequencyCos );
		 		var sin = Math.sin(frame / frequencySin );
		 		var rot = new PVector(cos,sin);
		 		rot.normalize();
		 		rot.div(100);
		 		applyForce(rot);
	 		}
	 	}


		self.applyForce = applyForce;

		self.render = function(){
			rotate();
			update();
			bounderies();
			grow();
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

	 	return self;
	} 

	module.exports = createElement;

}())