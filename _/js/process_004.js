(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
	
	var createCollection = require('../js/process_004/waves');
	var singleton = require('../js/singleton');

	$(document).ready(function(){
		singleton.init(); 
 
		var elements = createCollection(); 
	});	 

}())
},{"../js/process_004/waves":4,"../js/singleton":5}],2:[function(require,module,exports){
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
},{"./singleton":5}],3:[function(require,module,exports){
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
	

	function linearRandomSeriesConstructor(seriesLength, min, max){
		
		var randomSeries = [];
		var min = min;
		var max = max;
		var val = min;
		var seriesLength = seriesLength + 1;
		var seriesLengthHalf = seriesLength / 2;
		var subtract = max / seriesLength;

		for (var i = 0; i < seriesLength; i++) {
			var newVal = val + (Math.random() * max);

			// if(seriesLength > seriesLengthHalf && max > min) max -= subtract;

			val = newVal;
			if(newVal <= min) val = min;
			if(newVal >= max) val = max;

			randomSeries.push(val);
		};

		return function(i){
			return randomSeries[i];
		}
	}






	function waveConstructor(opts){
	 	var self = {};
	 	var opts = opts || {};

	 	var singleCanvas = singleton.canvas.getInstance();
	 	var ctx = singleCanvas.getCtx(); 
		var tick = singleton.tick.getInstance(); 
	 	var identify = { callback:render };
	 	
	 	var collection = [];
		var numOfChildren = 11; 
		var randomSeries = linearRandomSeriesConstructor(numOfChildren,0,50);  

		init();

	 	function init(){ 

	 		for (var i = 0; i < numOfChildren; i++) {
	 			
	 			collection.push(wavePointConstructor({
	 				circleOffset: stupid.math.toRad((360 / numOfChildren) * i),
	 				number: i,
	 				scale: randomSeries(i)
	 			}));
	 		};

	 		tick.add(identify);
	 	}

	 	function render(){	
	 		singleCanvas.clear();

	 		ctx.beginPath();
	 		ctx.strokeStyle = "white";
	 		ctx.setLineDash([1,10]);

	 		var position = stupid.util.prev(collection[0], collection).getPosition();
	 		ctx.moveTo(position.lx,position.ly);

	 		for (var i = 0; i < collection.length; i++) {
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
	 	var offset = 200;

	 	var x;
	 	var y;
	 	var lx;
	 	var ly;

	 	function growth(){
	 		var t = tick.getTick() / speed; 
	 		return Math.sin(t + linearOffset) * scale;
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

	 		x = (sin * linearGrowth) + offset;
	 		y = (cos * linearGrowth) + offset;

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

	 	self.getPosition = getPosition;
	 	self.render = render;

	 	return self;
	}

	module.exports = waveConstructor;

}())
},{"../singleton":5,"../stupid":6}],5:[function(require,module,exports){
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
},{"./canvas":2,"./document":3,"./stupid":6,"./tick":7}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
