(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function($){
	
	var scrollBoxConstructor = require('../js/experiment_001/scrollBox/scrollbox');
	var control;

	$(document).ready(function(){
		scrollBox = scrollBoxConstructor();
	});	 

}(jQuery))
},{"../js/experiment_001/scrollBox/scrollbox":3}],2:[function(require,module,exports){
(function(){

	/*
    * Drag
    * v1.0.0
    */
    
	function dragConstructor(opts){
	 	var self = {};
	 	var opts = opts || {};
	 	
	 	var x;
	 	var s;

	 	/*
	 	* Private
	 	*/
	 	function init(){
	 		x = 0;
	 		s = 0;
	 	}

	 	function start(v){
	 		s = x - v;
	 	}

	 	function stop(v){
	 		update(v);
	 	}

	 	function move(v){
	 		x =  s + v;
	 		return x;
	 	}

	 	function update(v){
	 		x = v;
	 	}


	 	/*
	 	* Public
	 	*/

	 	self.start = start;
	 	self.stop = stop;

	 	self.move = move;
	 	self.update = update;

	 	/*
	 	* Init
	 	*/

	 	init();

	 	return self;
	}

	module.exports = dragConstructor;
}())
},{}],3:[function(require,module,exports){
var prefix = require('./stupid/prefix');
var proxy = require('./stupid/proxy');
var dragConstructor = require('./drag');
var slideConstructor = require('./slide');
var tickSingleton = require('./stupid/tick');


/*
* ScrollBox
* v1.0.0
*/

function scrollBoxConstructor(opts){
 	var self = {};
 	var opts = opts || {};
 	
 	var tick = tickSingleton.getInstance();
 	var identify;
 	
 	var getContent;
 	var getWrapper;
 	var getWindow;

 	var clientX;
 	var clientY;

 	var x;
 	var y;

 	var dragX; 
 	var dragY;

 	var slideX;
 	var slideY;

 	var wDiff;
 	var hDiff;

 	var moving;
	 	
 	/*
 	* Private
 	*/
 
 	function init(){
 		getContent = proxy(function(){
 			return $(opts.content || '.content');
 		});

 		getWrapper = proxy(function(){
 			return $(opts.wrapper || '.wrapper');
 		});

 		getWindow = proxy(function(){
 			return $(window);
 		});

 		dragX = dragConstructor();
 		dragY = dragConstructor();

 		slideX = slideConstructor({name: 'slideX'});
 		slideY = slideConstructor();

 		x = 0;
 		y = 0;

 		moving = false;

 		identify = {callback:render};

 		updateDiffs();

 		center();

		tick.add(identify);

		render();

 	}

 	function updateDiffs(){
 		wDiff = getWrapper()[0].offsetWidth - getContent()[0].offsetWidth;
 		hDiff = getWrapper()[0].offsetHeight - getContent()[0].offsetHeight;
 	}

 	function events(){

 		getWindow().on('resize', function(){
 			updateDiffs();
 		});

 		getWrapper().on('mousedown touchstart', function(e){
 			setClient(e)
 			mouseDown(e);

 			getWrapper().on('mousemove touchmove', function(e){
 				e.preventDefault();
	 			setClient(e)
	 			mouseMove(e);
	 		});

 			getWindow().on('mouseup', function(e){
 				mouseUp(e);
 			});

 			getWrapper().on('touchend', function(e){
 				mouseUp(e);
 			});
 		});

 		getWrapper().trigger('mousedown touchstart');
 	}

 	function setClient(e){
		clientX = e.originalEvent.touches ? e.originalEvent.touches[0].clientX : e.clientX;
		clientY = e.originalEvent.touches ? e.originalEvent.touches[0].clientY : e.clientY;
 	}

 	function center(){
 		x = wDiff / 2;
 		y = hDiff / 2;
 		slideX.setValue(x);
 		slideY.setValue(y);
 	}

 	function mouseDown(e){
 		moving = true;

 		dragX.start(clientX);
 		dragY.start(clientY);
 	}

 	function mouseMove(e){
 		
 	}

 	function mouseUp(e){
 		moving = false;
 		
 		getWrapper().off('mousemove touchmove');
 		getWindow().off('mouseup touchup');
 	}

 	function isBelow(v, v2){
 		return Boolean(v >= v2);
 	}

 	function isAbove(v, v2){
 		return Boolean(v <= v2);
 	}


 	function move(){
 		x = isBelow(x, 0) || isAbove(x, wDiff) ? slideX.drag( dragX.move(clientX) ) : slideX.move( dragX.move(clientX) );
		y = isBelow(y, 0) || isAbove(y, hDiff) ? slideY.drag( dragY.move(clientY) ) : slideY.move( dragY.move(clientY) );
 	}

 	function idle(){
 		if(isBelow(x, 0) && wDiff < 0){
			slideX.setEdge(0);
		}else if(isAbove(x, wDiff) && wDiff < 0){
			slideX.setEdge(wDiff);
		}else if(wDiff > 0){
			slideX.setEdge(wDiff / 2);
		}

		x = isBelow(x, 0) || isAbove(x, wDiff) ? slideX.edge() : slideX.idle();

		dragX.update(x);

		if(isBelow(y, 0) && hDiff < 0){
			slideY.setEdge(0);
		}else if(isAbove(y, hDiff) && hDiff < 0){
			slideY.setEdge(hDiff);
		}else if(hDiff > 0){
			slideY.setEdge(hDiff / 2);
		}

		y = isBelow(y, 0) || isAbove(y, hDiff) ? slideY.edge() : slideY.idle();

		dragY.update(y); 
 	}

 	function render(){

 		if(moving){
 			move();
 		}else{
 			idle();
 		}

 		getContent()[0].style[prefix.js + 'Transform'] = "translate3d("+ x +"px,"+ y +"px, 0px)";
 	}

 	/*
 	* Public
 	*/
 	
 	self.updateContent = updateDiffs;

 	/*
 	* Init
 	*/
 
 	init();
 	events();
 
 	return self;
 }

 module.exports = scrollBoxConstructor;

},{"./drag":2,"./slide":4,"./stupid/prefix":5,"./stupid/proxy":6,"./stupid/tick":8}],4:[function(require,module,exports){
/*
* Slide
* v1.0.0
*/

function slideConstructor(opts){
 	var self = {};
 	var opts = opts || {};
 	
 	var force;
 	var mForce;

 	var acc;
 	var vel;

 	var t;
 	var x;
 	var k;
 	var mass;
 	var damp;
 	var ease;
 	var edge;

	var dragForce;

 	/*
 	* Private
 	*/
 
 	function init(){
 		k = opts.k || 0.1;
 		damp = opts.damp || 0.6;
 		ease = opts.ease || 0.9;
 		mass = opts.mase || 1;
 		mForce = opts.mForce || 30;
 		dragForce = opts.dragForce || 0.6;

 		t = 0;
 		x = 0;
 		acc = 0;
 		vel = 0;
 		edge = 0;
 		force = 0;
 	}
 
 	function move(v){
 		force = maxForce(v - t);
 		x = v;
 		t = v;
 		
 		return v;
 	}

 	function drag(v){
 		x = v - ((v - t) * dragForce);

 		return x;
 	}

 	function idle(){
		acc = force;     
		vel = damp * (vel + acc); 
		x += vel;
		t = x;

		force *= ease;

		return x;
 	}

 	function edge(){
		force = (-1 * k) * (x - edge);
	    acc = force / mass;     
	    vel = damp * (vel + acc);        
	    x += vel;
	    t = x;

		return x;
 	}

	function setEdge(v){
		edge = v;
	}

 	function value(){ 
 		return x;
 	}

 	function setValue(v){
 		x = v;
 	}

 	function maxForce(f){
 		return Math.abs(f) > mForce ? f < 0 ? mForce * -1 : mForce : f;
 	}

 	/*
 	* Public
 	*/
 	
 	self.move = move;
 	self.drag = drag;
 	self.idle = idle;
 	self.edge = edge;
 	self.setEdge = setEdge;
 	self.value = value;
 	self.setValue = setValue;

 	/*
 	* Init
 	*/
 
 	init();
 
 	return self;
 }
 
 module.exports = slideConstructor;
},{}],5:[function(require,module,exports){
(function() {

    /*
    * Prefix
    * v1.0.0
    */

    var createPrefix = function() {

        return (function(){

          function getVendorPrefix () {

              var ua = navigator.userAgent.toLowerCase(),
                  match = /opera/.exec(ua) || /msie/.exec(ua) || /firefox/.exec(ua) || /(chrome|safari)/.exec(ua),
                  vendors = {
                      opera: 'O',
                      chrome: 'webkit',
                      safari: 'webkit',
                      firefox: 'Moz',
                      msie: 'ms'
                  };
              
              return vendors[match[0]];
          } 

          return {
              js: getVendorPrefix(),
          };

        })();
    };

    module.exports = createPrefix();  

}())
},{}],6:[function(require,module,exports){
(function(){

	/*
    * Proxy
    * v1.0.0
    */

	function proxyConstructor(func){
		var element = null;

		return function (){
			if(element === null) element = func();
			return element;
		};
	}

	module.exports = proxyConstructor;
}())
},{}],7:[function(require,module,exports){
(function(){
    /*
    * CREATE SINGLETON FUNCTION
    *
    * Creates a singleton out of a function
    * Get the function by using foo.getInstance();
    *
    * v1.0.0
    */

    function singletonConstructor(createObject){
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

    module.exports = singletonConstructor;
     
}())


},{}],8:[function(require,module,exports){
(function(){

    var singletonConstructor = require('./singleton');

    /*
     * Tick
     *
     * v1.0.0
     */

    function tickConstructor() {
        var self = {};

        var requestAnimationFrame = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(callback) { return setTimeout(callback, 1000 / 60); };

        var cancelAnimationFrame = window.cancelAnimationFrame 
        || function (id) { clearTimeout(id); };

        var collection = [];
        var loop = _createAnimationLoop();
        var requestId;
        var tick = 0;


        /*
         * Private
         */

        function _createAnimationLoop() {
            var once = false;

            return function() {
                if (once) return;

                (function _animloop() {
                    requestId = requestAnimationFrame(_animloop);
                    _render();
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
                cancelAnimationFrame(requestId);
                loop = _createAnimationLoop();
            }
        }



        function add() {
            var index = collection.indexOf(arguments[0]);
            if (index === -1) collection.push(arguments[0]);
            _checkCollection();
        }

        function remove() {
            var index = collection.indexOf(arguments[0]);
            if (index > -1) collection.splice(index, 1);
            _checkCollection();
        }

        function getTick(){
            return tick;
        }

        self.add = add;
        self.remove = remove;
        self.getTick = getTick;

        self.id = Math.random();    

        return self;
    }

    

    module.exports = singletonConstructor(tickConstructor);

}())
},{"./singleton":7}]},{},[1]);
