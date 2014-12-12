(function(){

	var stupid = require('./stupid');
	var singleton = require('./singleton');
	var ease = require('./ease');

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
