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