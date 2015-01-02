(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
	/* 
	* Curved Animation
	*/
	var createCurvedAnimation = require('../js/curve/curved_animation');
	var singleton = require('../js/singleton'); 

	$(document).ready(function(){
		singleton.init(); 
 
		var curvedAnimation = createCurvedAnimation(); 
			
	}); 

}())
  
},{"../js/curve/curved_animation":3,"../js/singleton":6}],2:[function(require,module,exports){
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
},{"./singleton":6}],3:[function(require,module,exports){
(function(){

	var stupid = require('../stupid');
	var singleton = require('../singleton');
	var ease = require('../ease');

	function createCurvedAnimation(){
	 	that = {};
	 	var identify = {callback:_render};
	 	var canvas = singleton.canvas.getInstance();
	 	var ctx = singleton.canvas.getInstance().getCtx();
	 	
	 	var x = 100, y = 100;
	 	var w = 20, h = 20;

	 	var animation = _createAnimation(100,100,50);


	 	var cosAnimation = _createEase(0,10,50);

	 	var rad360 = stupid.math.toRad(360);
	 	var easeAnimation = _createEase(0,rad360,100);

	 	var rad360d = stupid.math.toRad(360 * 2);
	 	var easeAnimationd = _createEase(0,rad360d,100);

	 	singleton.tick.getInstance().add(identify)

	 	function _createEase(b,c,d){
	 		var t = 0;
	 		var e = b;
	 		return function() {
	 			if(t > d) return e;
	 			e = ease.easeInOutSine(t,b,c,d); 
	 			t += 1;
	 			return e;
	 		};
	 	}

	 	function _createAnimation(ex,ey,t){
	 		return function() {
	 			return {
		 			x: _createEase(x,ex,t),
		 			y: _createEase(y,ey,t)
		 		}
	 		};
	 	}


	 	function _update(){
	 		_drawS();
	 		// drawSAndC(); 
	 		// drawCos();
	 	}

	 	function _draw(){
	 		ctx.fillStyle = "red";
	 		ctx.fillRect(x,y,w,h);
	 	}

	 	function _render(){
	 		canvas.clear();
	 		_update();
	 		_draw();
	 		canvas.update();
	 	}

	 	/*
	 	* Draw Cos
	 	*/


	 	function drawCos(){
	 		var value = cosAnimation(); 
	 		var d = 100;
	 		var o = 300; 
	 		var r = 0;
	 		x = ( (Math.cos(value) * (d + r) ) + o); 
	 		y = ( (Math.cos(value) * (d - r) ) + o);
	 	}

	 	/*
	 	* Draw Straight And Curve
	 	*/

	 	function drawSAndC(){
	 		var value = easeAnimationd(); 
	 		var tx, ty;
	 		var point = rad360d / 4;
	 		if(value < point){
	 			tx = 300; 
		 		ty = 500 - (value * 100);
	 		}else if(value < point * 3) {
	 			tx = Math.cos(value) * 100 + 400; 
		 		ty = Math.sin(value) * 100 + 200; 
	 		}else if(value < point * 4) {
	 			tx = 300; 
		 		ty = 1100 - (value * 100);
	 		}

	 		x = tx;
	 		y = ty;
	 	}
	 	/*
	 	* Draw An S
	 	*/
	 	function _drawS(){
	 		var value = easeAnimation();
	 		var tx, ty;
	 		var h = stupid.math.toRad(90);

	 		if(value < rad360 / 2){
	 			tx = Math.sin(value) * 100 + 300; 
		 		ty = Math.cos(value) * 80 + 300;
	 		}else{
	 			tx = Math.cos(value - h) * 100 + 300; 
		 		ty = Math.sin(value - h) * 80 + 140;
	 		}

	 		x = tx;
	 		y = ty;
	 	}

	 	return that;
	 }

	module.exports = createCurvedAnimation; 

}())

},{"../ease":5,"../singleton":6,"../stupid":7}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{"./canvas":2,"./document":4,"./stupid":7,"./tick":8}],7:[function(require,module,exports){
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
