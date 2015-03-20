(function(){
	function onceConstructor(inFunc, outFunc){
 		var boo = false;
 		var inFunc = inFunc || function(){};
 		var outFunc = outFunc || function(){};

 		return {
 			in:function() {
 				if(boo) return;
 				inFunc();
 				boo = true;
 			},
 			out:function() {
 				if(!boo) return;
 				outFunc();
 				boo = false;
 			}
 		}
 	}

 	module.exports = onceConstructor;
}())