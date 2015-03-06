
(function(){
	
	var singleton = require('../singleton');
	var stupid = require('../stupid');
	var tweenConstructor = require('../tween');
	

	// function linearRandomSeriesConstructor(seriesLength, min, max){
		
	// 	var randomSeries = [];
	// 	var min = min;
	// 	var max = max;
	// 	var val = min;
	// 	var seriesLength = seriesLength + 1;
	// 	var seriesLengthHalf = seriesLength / 2;
	// 	var subtract = max / seriesLength;

	// 	for (var i = 0; i < seriesLength; i++) {
	// 		var newVal = val + (Math.random() * max);

	// 		val = newVal;
	// 		if(newVal <= min) val = min;
	// 		if(newVal >= max) val = max;

	// 		randomSeries.push(val);
	// 	};

	// 	return function(i){
	// 		return randomSeries[i];
	// 	}
	// }



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
	 				scale: Math.random() * 50,
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

	 	var corners = 1;
	 	var size = opts.size || 1;
	 	var circleOffset = opts.circleOffset || 0;
	 	var linearOffset = circleOffset * corners;

	 	var speed = opts.speed || stupid.random.between(100,150);
	 	var radius = opts.radius || 100;
	 	var scale = opts.scale || 10;

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
	 		var t = 0; //tick.getTick() / 500;

	 		var sin = Math.sin(t + circleOffset);
	 		var cos = Math.cos(t + circleOffset);

	 		var linearGrowth = growth() + radius;
	 		
	 		x = (sin * linearGrowth) + offsetX;
	 		y = (cos * linearGrowth) + offsetY;

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