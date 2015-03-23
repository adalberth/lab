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