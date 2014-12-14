(function(){

	var stupid = require('../stupid');
	var singleton = require('../singleton');
	var ease = require('../ease');
	var Pvector = require('../pvector');
	var createSnakePart = require('../snake/snake_part');

	function createDynamicAnimation(){
	 	that = {};
	 	
	 	var snake = [];
		var snakePosition = [];
		var loop = stupid.createCollectionLoop(snake);
		var step = 5;

	 	var identify = {callback:_render};
	 	var canvas = singleton.canvas.getInstance();
	 	var ctx = singleton.canvas.getInstance().getCtx();
	 	
	 	var w = 20, h = 20;

	 	var acc = new PVector(0,0);
	 	var vel = new PVector(0,0);
	 	var loc = new Pvector(100,100);

	 	var tick = singleton.tick.getInstance();

	 	var draftForce;





	 	/*
	 	* Keypress
	 	*/
	 	var keyPressed = [];
	 	var resetKeys = 0;

 		singleton.document.getInstance().getDocument().keypress(function(e) {

		    var key = e.which;

		    if(keyPressed.indexOf(key) === -1) keyPressed.push(key); 

		    for (var i = 0; i < keyPressed.length; i++) {
		    	var pressedKey = keyPressed[i];
			    if(pressedKey === 119) keyPressedForce('up');
			    if(pressedKey === 100) keyPressedForce('right');
			    if(pressedKey === 115) keyPressedForce('down');
			    if(pressedKey === 97) keyPressedForce('left');
		    };

		    clearTimeout(resetKeys);
		    resetKeys = setTimeout(resetKeysTimeout,300);

		});

		function resetKeysTimeout(){
			keyPressed = []
		}

		function keyPressedForce(direction){
			console.log(direction);
			if(direction === "up"){
				_applyForce(PVector.fromAngle(stupid.math.toRad(270)));
			}

			if(direction === "right"){
				_applyForce(PVector.fromAngle(stupid.math.toRad(0)));
			}

			if(direction === "down"){
				_applyForce(PVector.fromAngle(stupid.math.toRad(90)));
			}

			if(direction === "left"){	
				_applyForce(PVector.fromAngle(stupid.math.toRad(180)));
			}

			loc.add(_snakeMovementForce());
		}

	 	/*
		* Public
		*/

		that.color = "red"; //stupid.random.rgbColorObject();
		that.dim = w;
		that.getPosition = function(){
			return {
				x: loc.x,
				y: loc.y
			}
		};

	 	_init();

	 	function _init(){
	 		_buildBody(10);
	 		_draw();
	 		canvas.update();
	 		tick.add(identify);
	 	}

	 	function _buildBody(length){
			for (var i = 0; i < length; i++) {
				_addNewElementToSnake();
			};
		}

		function _addNewElementToSnake(){
			var el = createSnakePart(that);
			snake.push(el);
			var lastPosition = snakePosition[snakePosition.length - 1] || el;
			snakePosition.push({
				x: lastPosition.x,
				y: lastPosition.y
			});
		}

		function _udpatePositionHistory(){
			snakePosition.unshift({x:loc.x,y:loc.y});
			if(snakePosition.length > snake.length) snakePosition.pop();
		}

		function _displayPosition(){
			function loopFunction(el,i){
				el.setPosition(snakePosition[i].x,snakePosition[i].y);
			}
			loop(loopFunction);
		}

		function _getDirection(){
			var diRad = Math.atan2(vel.y, vel.x);
			var diDeg = stupid.math.toDeg(diRad);

			return {
				rad: diRad,
				deg: parseInt( diDeg < 0 ? 360 + diDeg : diDeg)
			}
		}

		function _snakeMovement(amplitude, frequency){
			var rad = _getDirection().rad;

			// Snake/Fish movement from side to side
			var beta = rad + Math.PI / 2.0 ;
			var amplitude = amplitude || 2;
			var frequency = frequency || 0.2;
			var currentDistance = amplitude * Math.sin(frequency * tick.getTick());
			var snakeMoveX = Math.cos(beta) * currentDistance;
			var snakeMoveY = Math.sin(beta) * currentDistance;

			return {
				x: snakeMoveX,
				y: snakeMoveY
			}

		}

		function _snakeMovementForce(amplitude, frequency){
			var speed = vel.mag();
			var amplitude = amplitude || speed / 1.5; 
			var frequency = frequency || speed / 20;

			var snakeMovementPos = _snakeMovement(amplitude, frequency);
			var vector = new PVector(snakeMovementPos.x,snakeMovementPos.y);
			return vector;
		}

		function _headDirection(){

			var radius = 50;

			var rad = _getDirection().rad;
			var deg = _getDirection().deg;

			// Location at end of line
			var _x = radius * Math.sin(deg) + loc.x;
			var _y = radius * Math.cos(deg) + loc.y;

			ctx.save();
				ctx.translate(loc.x, loc.y);
				ctx.rotate(rad);
				ctx.lineWidth = 5;
				ctx.beginPath();
				ctx.moveTo(0,0);
				ctx.lineTo(radius,0);
				ctx.strokeStyle = 'blue';
				ctx.stroke(); 
			ctx.restore();

		}

		function _position(){
			_positionBounderies();
			_udpatePositionHistory();
			_displayPosition();
		}

	 	function _update(){
	 		vel.mult(0.98);

	 		vel.add(acc);
		    loc.add(vel);

	 		vel.limit(15);
		    acc.mult(0);
	 	}

	 	function _applyForce(force){
    		acc.add(force);
	 	}

	 	function _draw(){
	 		ctx.fillStyle = that.color;
	 		ctx.fillRect(loc.x,loc.y,w,h);
	 	}

	 	function _randomForce(){
	 		var rx = stupid.random.negpos() * ( Math.random() * 2);
	 		var ry = stupid.random.negpos() * ( Math.random() * 2);
	 		return new PVector(rx,ry);
	 	}

	 	function _positionBounderies(){
			var width = window.innerWidth;
			var height = window.innerHeight;

			if(loc.x < 0){
				loc.x = width;
			}else if(loc.x > width){
				loc.x = 0;
			}

			if(loc.y < 0){
				loc.y = height;
			}else if(loc.y > height){
				loc.y = 0;
			}
		}
	 	
	 	function _forces(){
	 		var time = tick.getTick() % 150;

	 		if(time === 1){
	 			var ran = stupid.random.negpos() * 0.1;
	 			draftForce = Math.random() < 0.5 ? new PVector(ran,0) : new PVector(0,ran);
	 		}

	 		if(time > 125){
	 			_applyForce(_randomForce());
	 		}

	 		if(time < 75){
		 		_applyForce(_snakeMovementForce());
	 		}else{
	 			_applyForce(draftForce);
	 		}
	 	}

	 	function _render(){
	 		canvas.clear();

	 		_forces(); 
	 		_update();
	 		_position();
	 		_draw();

	 		canvas.update();
	 	}

	 	return that;
	 }



	module.exports = createDynamicAnimation; 

}())