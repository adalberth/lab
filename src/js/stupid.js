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