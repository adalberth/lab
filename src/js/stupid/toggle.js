(function(){

	function toggleConstructor(active,deactive){
 		var toggle = true;

 		return function() {

 			if(toggle){
	 			active();
	 		}else{
	 			deactive();
	 		}

	 		toggle = !toggle;
 		};
 	}

 	module.exports = toggleConstructor;

}())