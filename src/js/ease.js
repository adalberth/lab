/*
*   http://gizma.com/easing/
*   t: current time (time over periode time++)
*   b: start value
*   c: change in value (end value)
*   d: duration 
*/


(function() {

    var Ease = {};
    window.Ease = Ease;

    // simple linear tweening - no easing, no acceleration


    Ease.linearTween = function(t, b, c, d) {
        return c * t / d + b;
    };


    // quadratic easing in - accelerating from zero velocity


    Ease.easeInQuad = function(t, b, c, d) {
        t /= d;
        return c * t * t + b;
    };


    // quadratic easing out - decelerating to zero velocity


    Ease.easeOutQuad = function(t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
    };



    // quadratic easing in/out - acceleration until halfway, then deceleration


    Ease.easeInOutQuad = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };


    // cubic easing in - accelerating from zero velocity


    Ease.easeInCubic = function(t, b, c, d) {
        t /= d;
        return c * t * t * t + b;
    };



    // cubic easing out - decelerating to zero velocity


    Ease.easeOutCubic = function(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    };



    // cubic easing in/out - acceleration until halfway, then deceleration


    Ease.easeInOutCubic = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    };


    // quartic easing in - accelerating from zero velocity


    Ease.easeInQuart = function(t, b, c, d) {
        t /= d;
        return c * t * t * t * t + b;
    };



    // quartic easing out - decelerating to zero velocity


    Ease.easeOutQuart = function(t, b, c, d) {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    };



    // quartic easing in/out - acceleration until halfway, then deceleration


    Ease.easeInOutQuart = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    };


    // quintic easing in - accelerating from zero velocity


    Ease.easeInQuint = function(t, b, c, d) {
        t /= d;
        return c * t * t * t * t * t + b;
    };



    // quintic easing out - decelerating to zero velocity


    Ease.easeOutQuint = function(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t * t * t + 1) + b;
    };



    // quintic easing in/out - acceleration until halfway, then deceleration


    Ease.easeInOutQuint = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
    };


    // sinusoidal easing in - accelerating from zero velocity


    Ease.easeInSine = function(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    };



    // sinusoidal easing out - decelerating to zero velocity


    Ease.easeOutSine = function(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    };



    // sinusoidal easing in/out - accelerating until halfway, then decelerating


    Ease.easeInOutSine = function(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };



    // exponential easing in - accelerating from zero velocity


    Ease.easeInExpo = function(t, b, c, d) {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    };



    // exponential easing out - decelerating to zero velocity


    Ease.easeOutExpo = function(t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
    };



    // exponential easing in/out - accelerating until halfway, then decelerating


    Ease.easeInOutExpo = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        t--;
        return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
    };


    // circular easing in - accelerating from zero velocity


    Ease.easeInCirc = function(t, b, c, d) {
        t /= d;
        return -c * (Math.sqrt(1 - t * t) - 1) + b;
    };



    // circular easing out - decelerating to zero velocity


    Ease.easeOutCirc = function(t, b, c, d) {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t * t) + b;
    };



    // circular easing in/out - acceleration until halfway, then deceleration


    Ease.easeInOutCirc = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        t -= 2;
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
    };

    Ease.easeInElastic = function ( t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    };

    Ease.easeOutElastic = function ( t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    };

    Ease.easeInOutElastic = function ( t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    };

    Ease.easeInBack = function ( t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    };

    Ease.easeOutBack = function ( t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    };

    Ease.easeInOutBack = function ( t, b, c, d, s) {
        if (s == undefined) s = 1.70158; 
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    };
    
    Ease.easeInBounce = function ( t, b, c, d) {
        return c - Ease.easeOutBounce ( d-t, 0, c, d) + b;
    };

    Ease.easeOutBounce = function ( t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    };

    Ease.easeInOutBounce = function ( t, b, c, d) {
        if (t < d/2) return Ease.easeInBounce ( t*2, 0, c, d) * .5 + b;
        return Ease.easeOutBounce ( t*2-d, 0, c, d) * .5 + c*.5 + b;
    }

    module.exports = Ease;
}())