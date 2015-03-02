
(function(){
	
	var singleton = require('../singleton');
	var stupid = require('../stupid');
	

	function linearRandomSeriesConstructor(seriesLength, min, max){
		
		var randomSeries = [];
		var min = min;
		var max = max;
		var val = min;
		var seriesLength = seriesLength + 1;
		var seriesLengthHalf = seriesLength / 2;
		var subtract = max / seriesLength;

		for (var i = 0; i < seriesLength; i++) {
			var newVal = val + Math.random() + 1;

			if(seriesLength > seriesLengthHalf && max > min) max -= subtract;
			console.log(max);

			val = newVal;
			if(newVal <= min) val = min;
			if(newVal >= max) val = max;

			randomSeries.push(val);
		};

		return function(i){
			return randomSeries[i];
		}
	}

	function wavesConstructor(opts){
	 	var self = {};
	 	var opts = opts || {};

	 	var singleCanvas = singleton.canvas.getInstance();
		var tick = singleton.tick.getInstance(); 
	 	var identify = { callback:render };
	 	
	 	var collection = [];
		var numOfChildren = 180; 
		var randomSeries = linearRandomSeriesConstructor(numOfChildren,20,50);  

		init();

	 	function init(){ 

	 		for (var i = 0; i < numOfChildren; i++) {
	 			
	 			collection.push(waveItemConstructor({
	 				circleOffset: stupid.math.toRad((360 / numOfChildren) * i),
	 				number: i,
	 				scale: randomSeries(i)
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

	function waveItemConstructor(opts){
	 	var self = {};
	 	var opts = opts || {};

		var tick = singleton.tick.getInstance(); 
		var singleCanvas = singleton.canvas.getInstance();
	 	var canvas = singleCanvas.getCanvas();
	 	var ctx = singleCanvas.getCtx(); 

	 	var size = opts.size || 1;
	 	var circleOffset = opts.circleOffset || 0;
	 	var linearOffset = circleOffset * 4;

	 	var speed = opts.speed || 100;
	 	var radius = opts.radius || 100;
	 	var scale = opts.scale || 10;
	 	var offset = 200;

	 	function growth(){
	 		var t = tick.getTick() / speed; 
	 		return Math.sin(t + linearOffset) * scale;
	 	}

	 	function render(){	
	 		var t = 1; //tick.getTick() / speed;

	 		var sin = Math.sin(t + circleOffset);
	 		var cos = Math.cos(t + circleOffset);

	 		var linearGrowth = growth() + radius;

	 		var x = (sin * linearGrowth) + offset;
	 		var y = (cos * linearGrowth) + offset;

	 		ctx.fillStyle = "white";
			ctx.beginPath();
			ctx.arc(x,y, size, 0, 2 * Math.PI);
			ctx.fill();
	 	}

	 	self.render = render;

	 	return self;
	}

	module.exports = wavesConstructor;

}())