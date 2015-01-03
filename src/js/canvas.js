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