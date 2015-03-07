(function(){
	
	var singleton = require('../singleton');
	var stupid = require('../stupid');
	var tweenConstructor = require('../tween');

	/*
	* Waves
	*/

	function wavesConstructor(opts){
	 	var self = {};
	 	var opts = opts || {};
	 	var collection = [];
	 	var noc = 10;

	 	var singleCanvas = singleton.canvas.getInstance();
	 	var ctx = singleCanvas.getCtx(); 
		var tick = singleton.tick.getInstance(); 
	 	var identify = { callback:render };
		
		var x = 300;
		var y = 250;

		var pulseRange = 25;

	 	// Dashed Lines
		// ctx.setLineDash([1,10]);

	 	init();

	 	function init(){ 

	 		for (var i = 0; i < noc; i++) {
	 			collection.push(waveConstructor({
	 				pulseRange: pulseRange / 2,
	 				radius: (i + 1) * pulseRange,
	 				x: x,
	 				y: y
	 				// scale: i,
	 				// speed: i * 100
	 			}));
	 		};

	 		tick.add(identify);
	 	}

	 	function render(){
	 		singleCanvas.clear();
	 		for (var i = 0; i < collection.length; i++) {
	 			collection[i].render();
	 		};
	 	}

	 	return self;
	}

	/*
	* Wave (Singlelar)
	*/

	function waveConstructor(opts){
	 	var self = {};
	 	var opts = opts || {};

	 	var singleCanvas = singleton.canvas.getInstance();
	 	var ctx = singleCanvas.getCtx(); 
	 	
	 	var collection = [];
		var noc = opts.noc || stupid.random.between(8,11); 

		var position;


		var radius = opts.radius || 100;
		var radiusTween = tweenConstructor('easeInOutQuad',0,radius,120);

		var opacity = 0.75;
		var opacityTween = tweenConstructor('easeInOutQuad',0,1, 140);

		var pulseRange = opts.pulseRange || 1;

		var scale = opts.scale || radius / pulseRange;
		var speed = opts.speed || 100;

		var offsetX = opts.x || 0;
		var offsetY = opts.y || 0;


		init();

	 	function init(){ 
	 		for (var i = 0; i < noc; i++) {
	 			
	 			collection.push(wavePointConstructor({
	 				circleOffset: stupid.math.toRad((360 / noc) * i),
	 				number: i,
	 				scale: scale,
	 				speed: stupid.random.between(100,150),
	 				radius: radius,
	 				offsetX: offsetX,
	 				offsetY: offsetY
	 			}));
	 		};
	 	}

	 	function render(){	
	 		// opacity = 1 - opacityTween();
	 		radius = radiusTween();

	 		ctx.beginPath();
	 		ctx.strokeStyle = "rgba(255,255,255,"+opacity+")";

	 		position = stupid.util.prev(collection[0], collection).getPosition();
	 		ctx.moveTo(position.lx,position.ly);

	 		for (var i = 0; i < collection.length; i++) {

	 			// collection[i].setRadius(radius);
	 			collection[i].render(stupid.util.next(collection[i], collection));

	 		};

	 		ctx.stroke();
	 	}


	 	self.render = render;

	 	return self;
	}

	/*
	* Wave Point
	*/

	function wavePointConstructor(opts){
	 	var self = {};
	 	var opts = opts || {};

		var tick = singleton.tick.getInstance(); 
		var singleCanvas = singleton.canvas.getInstance();
	 	var canvas = singleCanvas.getCanvas();
	 	var ctx = singleCanvas.getCtx(); 

	 	var size = opts.size || 1;
	 	var circleOffset = opts.circleOffset || 0;

	 	var speed = opts.speed || stupid.random.between(100,150);
	 	var rotateSpeed = opts.rotateSpeed || 750;

	 	var radius = opts.radius || 100;

	 	var scale = opts.scale || 0;

	 	var offsetX = opts.offsetX || 0;
	 	var offsetY = opts.offsetY || 0;

	 	var x;
	 	var y;
	 	var lx;
	 	var ly;



	 	function growth(){
	 		var t = tick.getTick() / speed; 
	 		return Math.sin(t) * scale;
	 	} 

	 	function render(next){	
	 		calcPosition();
	 		calcNextPosition(next);
	 		ctx.quadraticCurveTo(x,y,lx,ly); 
	 	}

	 	function calcPosition(){
	 		var t = tick.getTick() / rotateSpeed;

	 		var sin = Math.sin(t + circleOffset);
	 		var cos = Math.cos(t + circleOffset);

	 		var radiusGrowth = growth() + radius;
	 		
	 		x = (sin * radiusGrowth) + offsetX;
	 		y = (cos * radiusGrowth) + offsetY;

	 	} 

	 	function calcNextPosition(next){
	 		var nextPosition = next.getPosition();
	 		lx = stupid.math.lerp(nextPosition.x, x);
	 		ly = stupid.math.lerp(nextPosition.y, y);

	 		// Funny nice effect
	 		// lx = lx > x ? lx * 0.99 : lx * 1.01;
	 		// ly = ly > y ? ly * 0.99 : ly * 1.01;
	 	}

	 	function getPosition(){
	 		return {
	 			x:x,
	 			y:y,
	 			lx:lx,
	 			ly:ly
	 		}
	 	}

	 	function setRadius(_radius){
	 		radius = _radius;
	 	}

	 	self.getPosition = getPosition;
	 	self.setRadius = setRadius;
	 	self.render = render;

	 	return self;
	}

	module.exports = wavesConstructor;

}())