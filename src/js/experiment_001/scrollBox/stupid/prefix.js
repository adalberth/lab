(function() {

    /*
    * Prefix
    * v1.0.0
    */

    var createPrefix = function() {

        return (function(){

          function getVendorPrefix () {

              var ua = navigator.userAgent.toLowerCase(),
                  match = /opera/.exec(ua) || /msie/.exec(ua) || /firefox/.exec(ua) || /(chrome|safari)/.exec(ua),
                  vendors = {
                      opera: 'O',
                      chrome: 'webkit',
                      safari: 'webkit',
                      firefox: 'Moz',
                      msie: 'ms'
                  };
              
              return vendors[match[0]];
          } 

          return {
              js: getVendorPrefix(),
          };

        })();
    };

    module.exports = createPrefix();  

}())