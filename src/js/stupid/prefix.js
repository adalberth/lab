(function() {

    var createPrefix = function() {
        return (function(){

          var styles = window.getComputedStyle(document.documentElement, ''),

              pre = (Array.prototype.slice
                  .call(styles)
                  .join('')
                  .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
              )[1],

              dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
          return {
              dom: dom,
              lowercase: pre,
              css: '-' + pre + '-',
              // js: pre[0].toUpperCase() + pre.substr(1),
              js: pre[0] + pre.substr(1),
          };

        })();
    };

    module.exports = createPrefix();  

}())