
(function(){
	
	var singleton = require('../singleton');
	var stupid = require('../stupid');
	var tweenConstructor = require('../tween');

	function waveConstructor(opts){
	 	var self = {};
	 	var opts = opts || {};

	 	var singleCanvas = singleton.canvas.getInstance();
	 	var ctx = singleCanvas.getCtx(); 
		var tick = singleton.tick.getInstance(); 
	 	var identify = { callback:render };
	 	
	 	var collection = [];
		var numOfChildren = 11; 

		var position;

		var radius = 0;
		var radiusTween = tweenConstructor('easeInOutQuad',0,100,120);

		var opacity = 0;
		var opacityTween = tweenConstructor('easeInOutQuad',0,1, 140);

		// ctx.setLineDash([1,10]);

		init();

	 	function init(){ 

	 		for (var i = 0; i < numOfChildren; i++) {
	 			
	 			collection.push(wavePointConstructor({
	 				circleOffset: stupid.math.toRad((360 / numOfChildren) * i),
	 				number: i,
	 				scale: Math.random() * 50
	 			}));
	 		};

	 		tick.add(identify);
	 	}

	 	function render(){	
	 		singleCanvas.clear();

	 		opacity = 1; // - opacityTween();
	 		radius = radiusTween();

	 		ctx.beginPath();
	 		ctx.strokeStyle = "rgba(255,255,255,"+opacity+")";

	 		position = stupid.util.prev(collection[0], collection).getPosition();
	 		ctx.moveTo(position.lx,position.ly);

	 		for (var i = 0; i < collection.length; i++) {

	 			collection[i].setRadius(radius);
	 			collection[i].render(stupid.util.next(collection[i], collection));

	 		};

	 		ctx.stroke();
	 	}

	 	return self;
	}

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
		// var scaleTween = tweenConstructor('easeInOutQuad',1,scale,60);

	 	var offsetX = 200;
	 	var offsetY = 200;

	 	var x;
	 	var y;
	 	var lx;
	 	var ly;



	 	function growth(){
	 		var t = tick.getTick() / speed; 
	 		return Math.sin(t) * scale; //Math.sin(t + linearOffset) * scale;
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

	module.exports = waveConstructor;

}())