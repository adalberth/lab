(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function($){
	
	var controlConstructor = require('../js/experiment_001');
	var control;

	$(document).ready(function(){
		control = controlConstructor();
	});	 

}(jQuery))
},{"../js/experiment_001":3}],2:[function(require,module,exports){
(function(){
	function dragConstructor(opts){
	 	var self = {};
	 	var opts = opts || {};
	 	
	 	var x;
	 	var sx;

	 	/*
	 	* Private
	 	*/
	 	function init(){
	 		x = 0;
	 		sx = 0;
	 	}

	 	function start(vx){
	 		sx = x - vx;
	 	}

	 	function stop(vx){
	 		update(vx);
	 	}

	 	function move(vx){
	 		x =  sx + vx;
	 		return x;
	 	}

	 	function update(vx){
	 		x = vx;
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
var prefix = require('../stupid/prefix');
var proxy = require('../stupid/proxy');
var dragConstructor = require('./drag');
var slideConstructor = require('./slide');
var tickSingleton = require('../stupid/tick');

function controlConstructor(opts){
 	var self = {};
 	var opts = opts || {};
 	
 	var identify = {callback:render};
 	var tick = tickSingleton.getInstance();
 	
 	var getSquare;
 	var getWrapper;
 	var getBody;

 	var clientX;
 	var clientY;

 	var itemX;
 	var itemY;

 	var x;
 	var y;

 	var dragX;
 	var dragY;
 	var slideX;
 	var slideY;

 	var moving;

 	var state;
	 	
 	/*
 	* Private
 	*/
 
 	function init(){
 		getSquare = proxy(function(){
 			return $('.square');
 		});

 		getWrapper = proxy(function(){
 			return $('.wrapper');
 		});

 		getBody = proxy(function(){
 			return $('body');
 		});

 		dragX = dragConstructor();
 		dragY = dragConstructor();

 		slideX = slideConstructor();
 		slideY = slideConstructor();

 		itemX = 0;
 		itemY = 0;

 		x = 0;
 		y = 0;

 		moving = false;

		tick.add(identify);
 	}

 	function events(){

 		getWrapper().on('mousedown',function(e){
 			setClient(e)
 			mouseDown(e);

 			getWrapper().on('mousemove',function(e){
	 			setClient(e)
	 			mouseMove(e);
	 		});

 			getBody().on('mouseup',function(e){
 				setClient(e)
 				mouseUp(e);
 			})
 		});
 	}

 	function setClient(e){
 		e.preventDefault();
		clientX = e.clientX;
		clientY = e.clientY;
 	}

 	function mouseDown(e){
 		// console.log('mouseDown');
 		moving = true;
 		dragX.start(clientX);
 	}

 	function mouseMove(e){
 		// console.log('mouseMove');
 		// itemX = drag.move(clientX);
 		// itemY = 0; //d.y;
 	}

 	function mouseUp(e){
 		moving = false;
 		// console.log('mouseUp');
 		getWrapper().off('mousemove');
 		getBody().off('mouseup');
 	}


 	function render(){

 		if(moving){

 			x = slideX.update( dragX.move(clientX) );
 			y = slideY.update( dragY.move(clientY) );

 		}else{

 			var isBelow = Boolean(x > 0);
 			var isAbove = Boolean(x < (getWrapper()[0].offsetWidth - getSquare()[0].offsetWidth));

 			if(isBelow) slideX.setEdge(0);
 			if(isAbove) slideX.setEdge(getWrapper()[0].offsetWidth - getSquare()[0].offsetWidth);

			x = isBelow || isAbove ? slideX.edge() : slideX.idle();

 			dragX.update(x); 
 		}

 		getSquare()[0].style[prefix.js + 'Transform'] = "translate3d("+ x +"px,"+ 0 +"px,0px)";
 	}

 	/*
 	* Public
 	*/
 
 	/*
 	* Init
 	*/
 
 	init();
 	events();
 
 	return self;
 }

 module.exports = controlConstructor;

},{"../stupid/prefix":5,"../stupid/proxy":6,"../stupid/tick":8,"./drag":2,"./slide":4}],4:[function(require,module,exports){
function slideConstructor(opts){
 	var self = {};
 	var opts = opts || {};
 	
 	var force;
 	var acc;
 	var vel;
 	var t;
 	var x;
 	var k;

 	var mass;

 	var damp;
 	var damp2;

 	var edge;

 	/*
 	* Private
 	*/
 
 	function init(){
 		t = 0;
 		damp = 0.75;
 		damp2 = 0.9;
 		x = 0;
 		acc = 0;
 		vel = 0;
 		force = 0;
 		k = 0.025;
 		mass = 1;

 		edge = 0;
 	}
 
 	function update(v){
 		force = v - t;
 		t = v;
 		x = v;

 		return v;
 	}

 	function idle(){
		acc = force;     
		vel = damp * (vel + acc); 
		x += vel;

		t = x;

		force *= damp2;

		return x;
 	}

 	function edge(){
 		calc(edge);

		return x;
 	}

 	function calc(v){
		force = -k * (x - v);
	    acc = force / mass;     
	    vel = damp * (vel + acc);        
	    x += vel;
	}

	function setEdge(v){
		edge = v;
	}

 	function value(){
 		return x;
 	}

 	/*
 	* Public
 	*/
 	
 	self.update = update;
 	self.idle = idle;
 	self.edge = edge;
 	self.setEdge = setEdge;
 	self.value = value;

 	/*
 	* Init
 	*/
 
 	init();
 
 	return self;
 }
 
 module.exports = slideConstructor;
},{}],5:[function(require,module,exports){
(function() {

    var createPrefix = function() {
        return (function(){

          var styles = window.getComputedStyle(document.documentElement, ''),

              pre = (Array.prototype.slice
                  .call(styles)
                  .join('')
                  .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
              )[1],

              dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
          return {
              dom: dom,
              lowercase: pre,
              css: '-' + pre + '-',
              // js: pre[0].toUpperCase() + pre.substr(1),
              js: pre[0] + pre.substr(1),
          };

        })();
    };

    module.exports = createPrefix();  

}())
},{}],6:[function(require,module,exports){
(function(){
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
