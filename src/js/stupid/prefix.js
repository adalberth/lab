(function() {

     /**
     * Returns proper vendor prefix name
     */
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

    var createPrefix = function() {

        return (function(){

          // var styles = window.getComputedStyle(document.documentElement, ''),

          //     pre = (Array.prototype.slice
          //         .call(styles)
          //         .join('')
          //         .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
          //     )[1],

          //     dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

          return {
              // dom: dom,
              // lowercase: pre,
              // css: '-' + pre + '-',
              // js: pre[0].toUpperCase() + pre.substr(1), 
              js: getVendorPrefix(),
          };

        })();
    };

    module.exports = createPrefix();  

}())