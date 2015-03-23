(function(){
    /*
    * CREATE SINGLETON FUNCTION
    *
    * Creates a singleton out of a function
    * Get the function by using foo.getInstance();
    *
    * v1.0.0
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

