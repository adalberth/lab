(function(){
	
	var singleton = require('../singleton');
	var PVector = require('../pvector');
	var stupid = require('../stupid');

	function randomColor(){
		
		function random(){
			var ran = stupid.random.negpos() * Math.random() * 15;
			return ran;
		}

		function checkValue(x){
			return parseInt(x < 0 ? 0 : x > 256 ? 256 : x);
		}

		colors = [
			{ r:224, g:221, b:152 },
			{ r:150, g:148, b:102 },
			{ r:233, g:231, b:183 },
			{ r:22, g:79, b:112 },
			// { r:10, g:35, b:35 }
		];


		var color = colors[parseInt(Math.random() * colors.length)];
		var r = checkValue(color.r + random());
		var g = checkValue(color.g + random());
		var b = checkValue(color.b + random());

		return 'rgba('+r+','+g+','+b+',0.75);'
	}


	function createElement(){
	 	var self = {};
	 	var canvas = singleton.canvas.getInstance();
	 	var ctx = canvas.getCtx();
	 	var tick = singleton.tick.getInstance();

	 	
	 	var color = randomColor();

	 	var dir = getRandomAcceleration(5);
	 	var acc = dir;
	 	var vel = new PVector(0,0);
	 	var loc = new PVector(window.innerWidth * Math.random(), window.innerHeight * Math.random());

	 	var minRadius = 10;
	 	var maxRadius = 20;
	 	var radius = Math.random() * (maxRadius - minRadius) + minRadius;
	 	var grow = createGrow(minRadius,maxRadius);
	 	var rotate = createRotate();
	 	var wings = createDrawWings();

	 	var limit = 0.2; 

	 	init();

	 	function init(){
	 		render();
	 	}

	 	function getRandomAcceleration(mag){
	 		var mag = mag || 1;
	 		return new PVector(stupid.random.negpos() * Math.random() * mag,stupid.random.negpos() * Math.random() * mag);
	 	}

		function draw(){
			ctx.save();
				ctx.fillStyle = color;
				ctx.beginPath();
				ctx.arc(loc.x,loc.y, radius, 0, 2 * Math.PI);
				ctx.fill();
			ctx.restore();
		}


		function update(){
			acc.limit(limit);

			// applyForce(dir);

	 		vel.add(acc);
	 		vel.limit(limit);

		    loc.add(vel);

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

		function createDrawWings(){

			var rotateSpeed = Math.random() * 300 + 300;

			return function() {
				var rot = Math.PI * tick.getTick() / rotateSpeed % Math.PI * 2;
				ctx.save();
					ctx.translate(loc.x,loc.y);
					ctx.rotate(rot + Math.random() / 2);
						ctx.strokeStyle = color;
						ctx.beginPath();
						ctx.moveTo(radius * -1, 0);
						ctx.lineTo(radius, 0);
						ctx.stroke();
				ctx.restore();
			};

		}
		function createGrow(minRadius, maxRadius){
			var toggle = true;
			var increase = 0.05;
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
			// wings();
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

	 	return self;
	} 

	module.exports = createElement;

}())