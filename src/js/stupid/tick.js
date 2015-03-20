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