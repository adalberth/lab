(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
	
	var createCollection = require('../js/process_002/collection');
	var singleton = require('../js/singleton');

	$(document).ready(function(){
		singleton.init(); 

		var elements = createCollection();
	});	 
}())
},{"../js/process_002/collection":4,"../js/singleton":7}],2:[function(require,module,exports){
(function(){
	
	var singleton = require('./singleton');

	function createCanvas(){
	 	that = {};


	 	var canvas = document.getElementById('canvas');
	 	// var preCanvas = document.createElement('canvas');

	 	_resize();

	 	var ctx = canvas.getContext('2d');
	 	// var preCtx = preCanvas.getContext('2d');

 		window.addEventListener('resize', _resize, false);

	 	function _resize(){
	 		canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // preCanvas.width = window.innerWidth;
            // preCanvas.height = window.innerHeight;
	 	}

	 	function _clear(){
	 		this.clearRect(0, 0, canvas.width, canvas.height);
	 	}

	 	that.save = function() {
	 		ctx.save(); //preCtx.save();
	 	};

	 	that.restore = function() {
	 		ctx.restore(); //preCtx.restore();
	 	};

	 	that.clear = function(){
	 		_clear.call(ctx); 
	 		// _clear.call(preCtx);  
	 	};

	 	that.getCanvas = function(){
	 		return canvas; //preCanvas;
	 	};

	 	that.getCtx = function(){
	 		return ctx; //preCtx;
	 	};

	 	that.update = function(){
	 		// _clear.call(ctx);
	 		// ctx.drawImage(preCanvas, 0, 0);
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

	var singleton = require('../singleton');
	var stupid = require('../stupid');
	var createElement = require('./element');

	function createCollection(){
	 	var self = {}; 
	 	var numOfElements = 500; //window.innerWidth / 4;
	 	var elements = [];
	 	var loop = stupid.createCollectionLoop(elements);
	 	var identify = { callback:render };
	 	var canvas = singleton.canvas.getInstance();
	 	var ctx = canvas.getCtx();

	 	init();

	 	function init(){
	 		createElements();
	 		singleton.tick.getInstance().add(identify);	
	 	}

	 	function render(){

	 		// singleton.canvas.getInstance().clear(); 
	 		// ctx.fillStyle = 'rgba(2, 2, 24, 0.01)'; 
	 		// ctx.fillRect(0,0,window.innerWidth,window.innerHeight);

	 		renderElemenets(); 
	 	}

	 	function renderElemenets(){
	 		loop(outerLoop);
	 	}

	 	function outerLoop(el){
 			el.render();
 			// loop(innerLoop, el); 
 		}

 	// 	function innerLoop(other, i, data){
 	// 		var el = data[0];
		// 	if(el.getID() === other.getID()) return;
			
		// 	var loc = el.getLocation(); 
		// 	var otherLoc = other.getLocation();

		// 	var dist = PVector.dist(loc, otherLoc);
		// 	dist -= el.getRadius() + other.getRadius();
		// 	dist = parseInt(dist);

		// 	if(dist < 20){
		// 		var otherDist = dist < 1 ? 1 : dist / 10 + 1;
		// 		var force = other.getVelocity(); 
		// 		force.normalize();
		// 		// force.div( otherDist / 5);
		// 		el.applyForce(force);
		// 	}

		// 	if(dist < 0){
		// 		var diff = PVector.sub(loc, otherLoc);
		// 		diff.normalize();
		// 		// diff.mult(1.5);
		// 		el.applyForce(diff);
		// 	}
		// }


	 	function createElements(){
	 		for (var i = 0; i < numOfElements; i++) {
	 			elements.push(createElement(i));			
	 		};
	 	}

	 	return self;
	} 

	module.exports = createCollection;
}())
},{"../singleton":7,"../stupid":8,"./element":5}],5:[function(require,module,exports){
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
},{"../pvector":6,"../singleton":7,"../stupid":8}],6:[function(require,module,exports){
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
},{"./canvas":2,"./document":3,"./stupid":8,"./tick":9}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
                    _render();
                    // if( (Date.now() - ts) > fr){
                    //     ts = Date.now();
                    //     _render(); 
                    // }
                    
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
