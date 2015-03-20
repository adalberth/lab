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