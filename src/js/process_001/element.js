(function(){
	
	var singleton = require('../singleton');
	var PVector = require('../pvector');
	var stupid = require('../stupid');

	function randomColor(){
		
		var colors = [
			[255, 255, 255],
			[22, 79, 112],
			[10, 39, 55]
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

	 	var dir = getRandomAcceleration(5);
	 	var acc = dir;
	 	var vel = new PVector(0,0);
	 	var loc = new PVector(window.innerWidth * Math.random(), window.innerHeight * Math.random());

	 	var limit = 0.5; //0.25; 

	 	var size = size || 1;
	 	var minRadius = 1 + size;
	 	var maxRadius = 5 + size;
	 	var radius = Math.random() * (maxRadius - minRadius) + minRadius;
	 	var grow = createGrow(minRadius,maxRadius);
	 	var rotate = createRotate();

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
			ctx.arc(loc.x,loc.y, radius, 0, 2 * Math.PI);
			ctx.fill();
		}


		function update(){
			acc.limit(limit);

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
			var frequency = 200;
	 		var frequencyCos = Math.random() * frequency + frequency;
	 		var frequencySin = Math.random() * frequency + frequency;
	 		var offset = stupid.random.negpos() * Math.random() * 1000 + 10;

	 		return function(){
		 		var frame = tick.getTick() + offset;
		 		var cos = Math.cos(frame / frequencyCos );
		 		var sin = Math.sin(frame / frequencySin );
		 		var rot = new PVector(cos,sin);
		 		rot.normalize();
		 		rot.mult(mag);
		 		applyForce(rot);
	 		}
	 	}

	 	function render(){
			update();
			bounderies();
	 		rotate();
			grow();
			draw();
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