(function(){
	
	var singleton = require('../singleton');
	var PVector = require('../pvector');
	var stupid = require('../stupid');

	function randomColor(){
		
		var colors = [
			[180, 162, 150],
			[110, 102, 98],
			[179, 29, 22],
			[90, 26, 13],
			[85, 14, 9],  
			[0, 0, 0],  
		];

		function random(){
			var ran = stupid.random.negpos() * Math.random() * 20;
			return ran;
		}

		function checkValue(x){
			return parseInt(x < 0 ? 0 : x > 256 ? 256 : x);
		}

		function randomItemInArray(){
			return parseInt(Math.random() * colors.length);
		}

		var color = colors[randomItemInArray()];
		var r = checkValue(color[0] + random());
		var g = checkValue(color[1] + random());
		var b = checkValue(color[2] + random());

		return 'rgba('+r+','+g+','+b+',0.25);'
	}


	function createElement(id){
	 	var self = {};
	 	var canvas = singleton.canvas.getInstance();
	 	var ctx = canvas.getCtx();
	 	var tick = singleton.tick.getInstance();

	 	var color = color || randomColor();

	 	var acc = new PVector(1,1);
	 	var vel = new PVector(0,0);
	 	var loc = new PVector(window.innerWidth / 2, window.innerHeight / 2);

	 	var limit = (Math.random() * 2.5 + 2.5) / 10;

	 	var size = size || 0;
	 	var minRadius = 0.05 + size;
	 	var maxRadius = 0.5 + size;
	 	var radius = Math.random() * (maxRadius - minRadius) + minRadius;

	 	var grow = createGrow(minRadius,maxRadius);
	 	var rotate = createRotate();
	 	var reset = createReset();
	 	var wiggle = createWiggle();

	 	init();

	 	function init(){
	 		render();
	 	}

	 	function getRandomAcceleration(mag){
	 		var mag = mag || 1;
	 		return new PVector(stupid.random.negpos() * Math.random() * mag,stupid.random.negpos() * Math.random() * mag);
	 	}

		function draw(){
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(loc.x, loc.y, radius, 0, 2 * Math.PI);
			ctx.fill();
		}


		function update(){
	 		vel.add(acc);
	 		vel.limit(limit);
		    loc.add(vel);
	 		acc.mult(0);
	 	}

	 	
	 	function applyForce(force){
    		acc.add(force);
	 	}

		function bounderies(){
			if(loc.x < radius * -1){
				loc.x = window.innerWidth + radius;
			}else if(loc.x > window.innerWidth + radius){
				loc.x = radius * -1;
			}

			if(loc.y < radius * -1){
				loc.y = window.innerHeight + radius;
			}else if(loc.y > window.innerHeight + radius){
				loc.y = radius * -1;
			}
		}


		function createWiggle(){
			var max = parseInt(Math.random() * 50 + 50);

			return function(){
				if(tick.getTick() % max < 50){
					applyForce(getRandomAcceleration(1));
					max = parseInt(Math.random() * 50 + 50);
				}
			}
		}

		function createGrow(minRadius, maxRadius){
			var toggle = true;
			var increase = limit / 100;
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
			var mag = 1;
	 		var f1 = Math.random() * 1000 + 500;
	 		var f2 = Math.random() * 1000 + 500;
	 		var startRotation = Math.random() * 100000;

	 		return function(){
	 			var frame = tick.getTick() + startRotation;
	 			var cos = Math.cos( frame / f1);
	 			var sin = Math.sin( frame / f2);

		 		var rot = new PVector(cos,sin);
		 		rot.normalize();
		 		rot.mult(mag);
		 		applyForce(rot);
	 		}
	 	}

	 	function createReset(){

	 		function getRandom(){
	 			return parseInt(Math.random() * 500 + 500);
	 		}

	 		var max = getRandom();

	 		return function(){
	 			if(tick.getTick() % max === 0){
	 				loc = new PVector(window.innerWidth / 2, window.innerHeight / 2);
	 				max = getRandom(); 
	 				rotate = createRotate();
	 			}
	 		}
	 	}

	 	function render(){
			update();
			// bounderies();
	 		rotate();
	 		wiggle();
			// grow();
			draw();
			reset();
	 	}

		self.applyForce = applyForce;
		self.render = render;

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

		self.getID = function() {
			return id;
		};

	 	return self;
	} 

	module.exports = createElement;

}())