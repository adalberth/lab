(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
	/*
	* Dynamic Animation - Dette er en test
	*/
	var createDynamicAnimation = require('./../js/dynamic/dynamic_animation');
	var singleton = require('./../js/singleton');

	$(document).ready(function(){
		singleton.init();

		var dynamicAnimation = createDynamicAnimation();
			
	}); 
}())

},{"./../js/dynamic/dynamic_animation":4,"./../js/singleton":7}],2:[function(require,module,exports){
(function(){
	
	var singleton = require('./singleton');

	function createCanvas(){
	 	that = {};


	 	var canvas = document.getElementById('canvas');
	 	var preCanvas = document.createElement('canvas');

	 	_resize();

	 	var ctx = canvas.getContext('2d');
	 	var preCtx = preCanvas.getContext('2d');

 		window.addEventListener('resize', _resize, false);

	 	function _resize(){
	 		canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            preCanvas.width = window.innerWidth;
            preCanvas.height = window.innerHeight;
	 	}

	 	function _clear(){
	 		this.clearRect(0, 0, canvas.width, canvas.height);
	 	}

	 	that.save = function() {
	 		preCtx.save();
	 	};

	 	that.restore = function() {
	 		preCtx.restore();
	 	};

	 	that.clear = function(){
	 		_clear.call(preCtx); 
	 	};

	 	that.getCanvas = function(){
	 		return preCanvas;
	 	};

	 	that.getCtx = function(){
	 		return preCtx;
	 	};

	 	that.update = function(){
	 		_clear.call(ctx);
	 		ctx.drawImage(preCanvas, 0, 0);
	 	};

	 	return that;
	}

	module.exports = createCanvas;

}())
},{"./singleton":7}],3:[function(require,module,exports){
(function(){

	/*
     * Document Elements
     */

    function createDocument() {
        var $body = $('body'),
            $window = $(window),
            $document = $(document),
            $canvasdiv = $('.canvas');

        return {
            getBody: function() {
                return $body;
            },
            getWindow: function() {
                return $window;
            },
            getDocument: function() {
                return $document;
            },
            getCanvasDiv: function() {
                return $canvasdiv;
            },
        }
    }

    module.exports = createDocument; 

}())
},{}],4:[function(require,module,exports){
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
},{"../ease":5,"../pvector":6,"../singleton":7,"../snake/snake_part":8,"../stupid":9}],5:[function(require,module,exports){
/*
*   http://gizma.com/easing/
*   t: current time (time over periode time++)
*   b: start value
*   c: change in value (end value)
*   d: duration 
*/


(function() {

    var Ease = {};
    window.Ease = Ease;

    // simple linear tweening - no easing, no acceleration


    Ease.linearTween = function(t, b, c, d) {
        return c * t / d + b;
    };


    // quadratic easing in - accelerating from zero velocity


    Ease.easeInQuad = function(t, b, c, d) {
        t /= d;
        return c * t * t + b;
    };


    // quadratic easing out - decelerating to zero velocity


    Ease.easeOutQuad = function(t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
    };



    // quadratic easing in/out - acceleration until halfway, then deceleration


    Ease.easeInOutQuad = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };


    // cubic easing in - accelerating from zero velocity


    Ease.easeInCubic = function(t, b, c, d) {
        t /= d;
        return c * t * t * t + b;
    };



    // cubic easing out - decelerating to zero velocity


    Ease.easeOutCubic = function(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    };



    // cubic easing in/out - acceleration until halfway, then deceleration


    Ease.easeInOutCubic = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    };


    // quartic easing in - accelerating from zero velocity


    Ease.easeInQuart = function(t, b, c, d) {
        t /= d;
        return c * t * t * t * t + b;
    };



    // quartic easing out - decelerating to zero velocity


    Ease.easeOutQuart = function(t, b, c, d) {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    };



    // quartic easing in/out - acceleration until halfway, then deceleration


    Ease.easeInOutQuart = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    };


    // quintic easing in - accelerating from zero velocity


    Ease.easeInQuint = function(t, b, c, d) {
        t /= d;
        return c * t * t * t * t * t + b;
    };



    // quintic easing out - decelerating to zero velocity


    Ease.easeOutQuint = function(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t * t * t + 1) + b;
    };



    // quintic easing in/out - acceleration until halfway, then deceleration


    Ease.easeInOutQuint = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
    };


    // sinusoidal easing in - accelerating from zero velocity


    Ease.easeInSine = function(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    };



    // sinusoidal easing out - decelerating to zero velocity


    Ease.easeOutSine = function(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    };



    // sinusoidal easing in/out - accelerating until halfway, then decelerating


    Ease.easeInOutSine = function(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };



    // exponential easing in - accelerating from zero velocity


    Ease.easeInExpo = function(t, b, c, d) {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    };



    // exponential easing out - decelerating to zero velocity


    Ease.easeOutExpo = function(t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
    };



    // exponential easing in/out - accelerating until halfway, then decelerating


    Ease.easeInOutExpo = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        t--;
        return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
    };


    // circular easing in - accelerating from zero velocity


    Ease.easeInCirc = function(t, b, c, d) {
        t /= d;
        return -c * (Math.sqrt(1 - t * t) - 1) + b;
    };



    // circular easing out - decelerating to zero velocity


    Ease.easeOutCirc = function(t, b, c, d) {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t * t) + b;
    };



    // circular easing in/out - acceleration until halfway, then deceleration


    Ease.easeInOutCirc = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        t -= 2;
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
    };


    module.exports = Ease;
}())
},{}],6:[function(require,module,exports){
/**
 * @module Math
 * @for PVector
 */
(function(){

  'use strict';
  
  /**
   * The PVector constructor function.
   *
   * A class to describe a two or three dimensional vector, specifically a Euclidean (also known as geometric) vector. A vector is an entity that has both magnitude and direction. The datatype, however, stores the components of the vector (x,y for 2D, and x,y,z for 3D). The magnitude and direction can be accessed via the methods mag() and heading(). In many of the p5.js examples, you will see PVector used to describe a position, velocity, or acceleration. For example, if you consider a rectangle moving across the screen, at any given instant it has a position (a vector that points from the origin to its location), a velocity (the rate at which the object's position changes per time unit, expressed as a vector), and acceleration (the rate at which the object's velocity changes per time unit, expressed as a vector). Since vectors represent groupings of values, we cannot simply use traditional addition/multiplication/etc. Instead, we'll need to do some "vector" math, which is made easy by the methods inside the PVector class.
   * @class PVector
   * @constructor
   * @param {Number} [x] x component of the vector
   * @param {Number} [y] y component of the vector
   * @param {Number} [z] z component of the vector
   */
  function PVector(x, y, z) {
    /**
     * The x component of the vector
     * @property x
     * @type {Number}
     */
    this.x = x || 0;
    /**
     * The y component of the vector
     * @property y
     * @type {Number}
     */
    this.y = y || 0;
    /**
     * The z component of the vector
     * @property z
     * @type {Number}
     */
    this.z = z || 0;
  }


  /**
   *
   * Sets the x, y, and z component of the vector using two or three separate
   * variables, the data from a PVector, or the values from a float array.
   * @method set
   * 
   * @param {Number|PVector|Array} [x] the x component of the vector or a PVector or an Array
   * @param {Number} [y] the y component of the vector 
   * @param {Number} [z] the z component of the vector 
   */
  PVector.prototype.set = function (x, y, z) {
    if (x instanceof PVector) { return this.set(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.set(x[0], x[1], x[2]); }
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    return this;
  };

  /**
   *
   * Gets a copy of the vector, returns a PVector object.
   *
   * @method get
   * @return {PVector} the copy of the PVector object
   */
  PVector.prototype.get = function () {
    return new PVector(this.x, this.y, this.z);
  };


  /**
   * Adds x, y, and z components to a vector, adds one vector to another, or adds two independent vectors together. The version of the method that adds two vectors together is a static method and returns a PVector, the others have no return value -- they act directly on the vector. See the examples for more context. 
   * 
   * @method add
   * @chainable
   * @param {Number|PVector|Array} x the x component of the vector to be added or a PVector or an Array
   * @param {Number} [y] the y component of the vector to be added
   * @param {Number} [z] the z component of the vector to be added
   * @return {PVector} the PVector object.
   */
  PVector.prototype.add = function (x, y, z) {
    if (x instanceof PVector) { return this.add(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.add(x[0], x[1], x[2]); }
    this.x += x || 0;
    this.y += y || 0;
    this.z += z || 0;
    return this;
  };

  /**
   * Subtracts x, y, and z components from a vector, subtracts one vector from another, or subtracts two independent vectors. The version of the method that substracts two vectors is a static method and returns a PVector, the others have no return value -- they act directly on the vector. See the examples for more context. 
   * 
   * @method sub
   * @chainable
   * @param {Number|PVector|Array} x the x component of the vector or a PVector or an Array
   * @param {Number} [y] the y component of the vector
   * @param {Number} [z] the z component of the vector
   * @return {PVector} PVector object.
   */
  PVector.prototype.sub = function (x, y, z) {
    if (x instanceof PVector) { return this.sub(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.sub(x[0], x[1], x[2]); }
    this.x -= x || 0;
    this.y -= y || 0;
    this.z -= z || 0;
    return this;
  };

  /**
   *
   * Multiply the vector by a scalar.   
   *
   * @method mult
   * @chainable
   * @param {Number} n the number to multiply with the vector
   * @return {PVector} a reference to the PVector object (allow chaining)
   */
  PVector.prototype.mult = function (n) {
    this.x *= n || 0;
    this.y *= n || 0;
    this.z *= n || 0;
    return this;
  };

   /**
   *
   * Divide the vector by a scalar.   
   *
   * @method div
   * @chainable
   * @param {number} n the number to divide the vector by
   * @return {PVector} a reference to the PVector object (allow chaining)
   */
  PVector.prototype.div = function (n) {
    this.x /= n;
    this.y /= n;
    this.z /= n;
    return this;
  };

  /**
   * Calculates the magnitude (length) of the vector and returns the result as a float (this is simply the equation sqrt(x*x + y*y + z*z).)
   * 
   * @method mag
   * @return {Number} magnitude of the vector
   */
  PVector.prototype.mag = function () {
    return Math.sqrt(this.magSq());
  };

  /**
   *
   * Calculates the squared magnitude of the vector and returns the result
   * as a float (this is simply the equation <em>(x*x + y*y + z*z)</em>.)
   * Faster if the real length is not required in the
   * case of comparing vectors, etc.
   *
   * @method magSq
   * @return {number} squared magnitude of the vector
   */
  PVector.prototype.magSq = function () {
    var x = this.x, y = this.y, z = this.z;
    return (x * x + y * y + z * z);
  };

  /**
   *
   * Calculates the dot product of two vectors.
   *
   * @method dot
   * @param {Number|PVector} x x component of the vector or a PVector
   * @param {Number} [y] y component of the vector
   * @param {Number} [z] z component of the vector
   * @return {Number} the dot product
   */
  PVector.prototype.dot = function (x, y, z) {
    if (x instanceof PVector) {
      return this.dot(x.x, x.y, x.z);
    }
    return this.x * (x || 0) +
           this.y * (y || 0) +
           this.z * (z || 0);
  };

  /**
   *
   * Calculates and returns a vector composed of the cross product between two vectors.
   *
   * @method cross
   * @param {PVector} v PVector to be crossed
   * @return {PVector} PVector composed of cross product
   */
  PVector.prototype.cross = function (v) {
    var x = this.y * v.z - this.z * v.y;
    var y = this.z * v.x - this.x * v.z;
    var z = this.x * v.y - this.y * v.x;
    return new PVector(x, y, z);
  };

  /**
   *
   * Calculates the Euclidean distance between two points (considering a
   * point as a vector object).
   *
   * @method dist
   * @param {PVector} v the x, y, and z coordinates of a PVector
   * @return {Number} the distance
   */
  PVector.prototype.dist = function (v) {
    var d = v.get().sub(this);
    return d.mag();
  };

  /**
   *
   * Normalize the vector to length 1 (make it a unit vector).
   *
   * @method normalize
   * @return {PVector} normalized PVector
   */
  PVector.prototype.normalize = function () {
    return this.div(this.mag());
  };

  /**
   *
   * Limit the magnitude of this vector to the value used for the <b>max</b> parameter.
   *
   * @method limit
   * @param {Number} max the maximum magnitude for the vector
   * @return {PVector} the modified PVector
   */
  PVector.prototype.limit = function (l) {
    var mSq = this.magSq();
    if(mSq > l*l) {
      this.div(Math.sqrt(mSq)); //normalize it
      this.mult(l);
    }
    return this;
  };

  /**
   *
   * Set the magnitude of this vector to the value used for the <b>len</b> parameter.
   *
   * @mtehod setMag
   * @param {number} len the new length for this vector
   * @return {PVector} the modified PVector
   */
  PVector.prototype.setMag = function (n) {
    return this.normalize().mult(n);
  };

  /**
   *
   * Calculate the angle of rotation for this vector (only 2D vectors)
   * TODO: deal with AngleMode
   *
   * @method heading
   * @return {Number} the angle of rotation
   */
  PVector.prototype.heading = function () {
    return Math.atan2(this.y, this.x);
  };

  /**
   *
   * Rotate the vector by an angle (only 2D vectors), magnitude remains the same
   * TODO: Change to rotate()
   * TODO: Deal with angleMode
   *
   * @method rotate2D
   * @param {number} angle the angle of rotation
   * @return {PVector} the modified PVector
   */
  PVector.prototype.rotate2D = function (a) {
    var newHeading = this.heading() + a;
    var mag = this.mag();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;
    return this;
  };

  /**
   *
   * Linear interpolate the vector to another vector
   *
   * @method lerp
   * @param {PVector} x the x component or the PVector to lerp to
   * @param {PVector} [y] y the y component 
   * @param {PVector} [z] z the z component
   * @param {Number} amt the amount of interpolation; some value between 0.0 (old vector) and 1.0 (new vector). 0.1 is very near the new vector. 0.5 is halfway in between.
   * @return {PVector} the modified PVector
   */
  PVector.prototype.lerp = function (x, y, z, amt) {
    if (x instanceof PVector) {
      return this.lerp(x.x, x.y, x.z, y);
    }
    this.x += (x - this.x) * amt || 0;
    this.y += (y - this.y) * amt || 0;
    this.z += (z - this.z) * amt || 0;
    return this;
  };

  /**
   *
   * Return a representation of this vector as a float array. This is only
   * for temporary use. If used in any other fashion, the contents should be
   * copied by using the <b>PVector.get()</b> method to copy into your own array.
   *
   * @method array
   * @return {Array} an Array with the 3 values 
   */
  PVector.prototype.array = function () {
    return [this.x || 0, this.y || 0, this.z || 0];
  };


  // Static Methods
  

  /**
   * Make a new 2D unit vector from an angle
   * 
   * @method fromAngle
   * @static
   * @param {Number} angle the desired angle
   * @return {PVector} the new PVector object
   */
  PVector.fromAngle = function(angle) {
    return new PVector(Math.cos(angle),Math.sin(angle),0);
  };

  /**
   * Make a new 2D unit vector from a random angle
   *
   * @method random2D
   * @static
   * @return {PVector} the new PVector object
   */
  PVector.random2D = function () {
    // TODO: This should include an option to use p5.js seeded random number
    return this.fromAngle(Math.random()*Math.PI*2);
  };

  /**
   * Make a new random 3D unit vector.
   *
   * @method random3D
   * @static
   * @return {PVector} the new PVector object
   */
  PVector.random3D = function () {
    // TODO: This should include an option to use p5.js seeded random number
    var angle = Math.random()*Math.PI*2;
    var vz = Math.random()*2-1;
    var vx = Math.sqrt(1-vz*vz)*Math.cos(angle);
    var vy = Math.sqrt(1-vz*vz)*Math.sin(angle);
    return new PVector(vx, vy, vz);
  };


  /**
   *
   * Adds two vectors together and returns a new one.
   *
   * @static
   * @param {PVector} v1 a PVector to add
   * @param {PVector} v2 a PVector to add
   * @return {PVector} the resulting new PVector
   */

  PVector.add = function (v1, v2) {
    return v1.get().add(v2);
  };

  /**
   *
   * Subtracts one PVector from another and returns a new one.  The second vector (v2) is subtracted from the first (v1), resulting in v1-v2.
   *
   * @static
   * @param {PVector} v1 a PVector to subtract from
   * @param {PVector} v2 a PVector to subtract
   * @return {PVector} the resulting new PVector
   */

  PVector.sub = function (v1, v2) {
    return v1.get().sub(v2);
  };


  /**
   *
   * Multiplies a vector by a scalar and returns a new vector.
   *
   * @static
   * @param {PVector} v the PVector to multiply
   * @param {Number} n the scalar
   * @return {PVector} the resulting new PVector
   */
  PVector.mult = function (v, n) {
    return v.get().mult(n);
  };

  /**
   *
   * Divides a vector by a scalar and returns a new vector.
   *
   * @static
   * @param {PVector} v the PVector to divide
   * @param {Number} n the scalar
   * @return {PVector} the resulting new PVector
   */
  PVector.div = function (v, n) {
    return v.get().div(n);
  };


  /**
   *
   * Calculates the dot product of two vectors.
   *
   * @static
   * @param {PVector} v1 the first PVector
   * @param {PVector} v2 the second PVector
   * @return {Number} the dot product
   */
  PVector.dot = function (v1, v2) {
    return v1.dot(v2);
  };

  /**
   *
   * Calculates the cross product of two vectors.
   *
   * @static
   * @param {PVector} v1 the first PVector
   * @param {PVector} v2 the second PVector
   * @return {Number} the cross product
   */
  PVector.cross = function (v1, v2) {
    return v1.cross(v2);
  };

  /**
   *
   * Calculates the Euclidean distance between two points (considering a
   * point as a vector object).
   *
   * @static
   * @param {PVector} v1 the first PVector
   * @param {PVector} v2 the second PVector
   * @return {Number} the distance
   */
  PVector.dist = function (v1,v2) {
    return v1.dist(v2);
  };

  /**
   *
   * Linear interpolate a vector to another vector and return the result as a new vector.
   *
   * @static
   * @param {PVector} v1 a starting PVector
   * @param {PVector} v2 the PVector to lerp to
   * @param {number} the amount of interpolation; some value between 0.0 (old vector) and 1.0 (new vector). 0.1 is very near the new vector. 0.5 is halfway in between.
   */
  PVector.lerp = function (v1, v2, amt) {
    return v1.get().lerp(v2, amt);
  };

  /**
   *
   * Calculates and returns the angle (in radians) between two vectors.
   *
   * @static
   * @param {PVector} v1 the x, y, and z components of a PVector
   * @param {PVector} v2 the x, y, and z components of a PVector
   * @return {Number} the angle between
   * 
   * TODO: Needs to account for angleMode
   */
  PVector.angleBetween = function (v1, v2) {
    return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
  };

  window.PVector = PVector; 
  module.exports = PVector;
    
}())
},{}],7:[function(require,module,exports){
(function(){
	var stupid = require('./stupid');
	
	var createDocument = require('./document');
	var createTick = require('./tick');
	var createCanvas = require('./canvas');
	
	var singleton = {
		init:function(){
			this.document = stupid.createSingleton(createDocument);
			this.tick = stupid.createSingleton(createTick);
			this.canvas = stupid.createSingleton(createCanvas);
		}
	};  

	module.exports = singleton;
}())
},{"./canvas":2,"./document":3,"./stupid":9,"./tick":10}],8:[function(require,module,exports){
(function(){

	var singleton = require('../singleton');
	/*
	* Snake Part
	*/

	function createSnakePart(){
	 	var that = {};
	 	var parent = arguments[0];
	 	var color = parent.color;
	 	var opacity = 1;
	 	var ctx = singleton.canvas.getInstance().getCtx();

	 	var x = parent.getPosition().x;
	 	var y = parent.getPosition().y; 
	 	var width = parent.dim;
	 	var height = parent.dim;

		function _draw(){
			ctx.save();
			ctx.fillStyle = 'rgba('+color.r+','+color.g+','+color.b+','+opacity+')';
			ctx.fillRect(x,y,width,height);
			ctx.restore();
		} 
		/*
		* Public
		*/

		that.getPosition = function() {

			return {
				x: x, 
				y: y
			}
		};

		that.setPosition = function(_x,_y) {
			x = _x;
			y = _y;
			_draw();
		};

		that.setOpacity = function(value){
			opacity = value;
		}



	 	return that;
	}

	module.exports = createSnakePart; 
}())
},{"../singleton":7}],9:[function(require,module,exports){
(function(){

    var stupid = {};


    /*
    * CREATE SINGLETON FUNCTION
    *
    * Creates a singleton out of a function
    * Get the function by using foo.getInstance();
    */

    function createSingleton(createObject){
        return (function () {
            var instance;
         
            function createInstance() {
                var object = createObject();
                return object;
            }
         
            return {
                getInstance: function () {
                    if (!instance) {
                        instance = createInstance();
                    }
                    return instance;
                }
            };
        })();
    }

    stupid.createSingleton = createSingleton;

    /*
    * Collection Loop
    */
    function createCollectionLoop(collection){
        return function(callback){
            var args = Array.prototype.slice.call(arguments);
            args.shift();

            for (var i = 0; i < collection.length; i++) {
                callback(collection[i], i, args);
            };
        }
    }

    stupid.createCollectionLoop = createCollectionLoop;

    /*
    * REQUEST ANIMATION FRAME
    *
    * Shim layer with setTimeout fallback
    */

    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
    })();

    window.cancelAnimFrame = (function(){
        return  window.cancelAnimationFrame ||
                function (id){
                    clearTimeout(id);
                }
    })();


    /*
    * Date now
    */

    if (!Date.now) {
      Date.now = function now() {
        return new Date().getTime();
      };
    }

    /*
    * Random
    */

    stupid.random = {};

    stupid.random.nullOr = function(value){
        return Math.random() < 0.5 ? value : 0;
    }

    stupid.random.rgbColorObject = function(){
        function c() {
           return parseInt(Math.random()*256);
        }

        return {
            r:c(), 
            g:c(), 
            b:c()
        };
    }

    stupid.random.negpos = function(){
        return -1 + Math.round(Math.random()) * 2;  
    }

    stupid.random.rgbColor = function(){
        var rgb = stupid.random.rgbColorObject();

        return "rgba("+rgb.r+","+rgb.g+","+rgb.b+",1);";
    }


    /*
    * Math
    */

    stupid.math = {};

    stupid.math.toRad = function(degrees){
        return degrees * (Math.PI/180);
    }

    stupid.math.toDeg = function(radians){
        return radians * (180/Math.PI);
    }

    stupid.math.atan2Normalized = function(atan2) {
        var result = atan2;
        if (result < 0) {
            result += (2 * Math.PI);
        }
        return(result);
    }
    /*
    * Util
    */

    stupid.util = {};

    stupid.util.lineDistance = function( point1, point2 ){
      var xs = 0;
      var ys = 0;
     
      xs = point2.x - point1.x;
      xs = xs * xs;
     
      ys = point2.y - point1.y;
      ys = ys * ys;
     
      return Math.sqrt( xs + ys );
    }
    
    module.exports = stupid;

}())
},{}],10:[function(require,module,exports){
(function(){

	/*
     * Tick
     */

    function createTick() {
        var collection = [],
            loop = _createAnimationLoop(),
            requestId,
            fps = 30,
            fr = 1000 / fps,
            tick = 0;

        /*
         * Private
         */

        function _createAnimationLoop() {
            var once = false;

            return function() {
                if (once) return;
                var ts = Date.now();

                (function _animloop() {
                    requestId = requestAnimFrame(_animloop);
                    // _render();
                    if( (Date.now() - ts) > fr){
                        ts = Date.now();
                        _render(); 
                    }
                    
                })();

                once = true; 
            }
        }

        function _render() {
            tick += 1;

            for (var i = 0; i < collection.length; i++) {
                collection[i].callback();
            };
        }

        function _checkCollection() {
            if (collection.length > 0 && collection.length < 2) {
                loop();
            } else if (collection.length === 0) {
                cancelAnimFrame(requestId);
                loop = _createAnimationLoop();
            }
        }

        /*
         * Public
         */
        return {
            add: function() {
                var index = collection.indexOf(arguments[0]);
                if (index === -1) collection.push(arguments[0]);
                _checkCollection();
            },
            remove: function() {
                var index = collection.indexOf(arguments[0]);
                if (index > -1) collection.splice(index, 1);
                _checkCollection();
            },
            getFrameRate: function(){
                return fps;
            },
            getTick: function(){
                return tick;
            }
        }
    }

    

    module.exports = createTick;

}())
},{}]},{},[1]);
