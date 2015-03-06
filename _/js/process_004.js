(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
	
	var createCollection = require('../js/process_004/waves');
	var singleton = require('../js/singleton');

	$(document).ready(function(){
		singleton.init(); 
 
		var elements = createCollection(); 
	});	 

}())
},{"../js/process_004/waves":5,"../js/singleton":6}],2:[function(require,module,exports){
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
},{"./singleton":6}],3:[function(require,module,exports){
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

    Ease.easeInElastic = function ( t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    };

    Ease.easeOutElastic = function ( t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    };

    Ease.easeInOutElastic = function ( t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    };

    Ease.easeInBack = function ( t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    };

    Ease.easeOutBack = function ( t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    };

    Ease.easeInOutBack = function ( t, b, c, d, s) {
        if (s == undefined) s = 1.70158; 
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    };
    
    Ease.easeInBounce = function ( t, b, c, d) {
        return c - Ease.easeOutBounce ( d-t, 0, c, d) + b;
    };

    Ease.easeOutBounce = function ( t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    };

    Ease.easeInOutBounce = function ( t, b, c, d) {
        if (t < d/2) return Ease.easeInBounce ( t*2, 0, c, d) * .5 + b;
        return Ease.easeOutBounce ( t*2-d, 0, c, d) * .5 + c*.5 + b;
    }

    module.exports = Ease;
}())
},{}],5:[function(require,module,exports){

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
},{"../singleton":6,"../stupid":7,"../tween":9}],6:[function(require,module,exports){
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
},{"./canvas":2,"./document":3,"./stupid":7,"./tick":8}],7:[function(require,module,exports){
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

    stupid.random.between = function(min,max){
        return Math.random()*(max-min+1)+min;
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

    stupid.math.lerp = function(sx, fx, progress){
        var progress = progress || 0.5;
        var px = sx + (fx - sx) * progress;
        return px;
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

    stupid.util.next = function(current, collection){
      return collection[ collection.indexOf(current) + 1 ] || collection[0];
    }

    stupid.util.prev = function (current, collection){
      return collection[ collection.indexOf(current) - 1 ] || collection[collection.length - 1];
    }
    
    module.exports = stupid;

}())
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
var Ease = require('./ease');

(function(){

	function tween(type, b, c, d){
		var t = 0;
		var e;
		return function(){
			if(t > d) return e;
			e = Ease[type](t, b, c, d);
			t += 1;
			return e; 
		}
	}

	module.exports = tween;

}())
},{"./ease":4}]},{},[1]);
