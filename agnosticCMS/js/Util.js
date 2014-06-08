(function(AGNOSTIC, undefined){
    (function(Util, undefined){

        Util.getParam = function(name){
            try {
                var location = window.top.location.href.replace('#','');
                if (location.indexOf(name) != -1) {
                    var start = location.indexOf(name) + name.length + 1;
                    var end = location.indexOf('&', start);
                    if (end <= 1)end = location.length;
                    return location.substring(start, end);
                }
            } catch (err) {
            }
            return null;
        }

        Util.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        };

        Util.isObject = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Object]';
        };

        Util.objectKeys = window.Object.keys || function (obj) {
            var keys = [],
                key;
            for (key in obj) {
                if (window.Object.prototype.hasOwnProperty.call(obj, key)) {
                    keys.push(key);
                }
            }
            return keys;
        }

        Util.joinByProp = function (array, prop) {
            var s = "";
            for(var i = 0, len = array.length; i < len; i++)
                s += (array[i][prop] + (i!=len-1 ? ', ' : ''));
            return s;
        };

        Util.arrayContains = function(array, prop, value){
            var b = false;
            if(array)
            for(var i = 0, len = array.length; i < len; i++)
                if((prop && array[i][prop] == value) || array[i] == value)
                    b=true;
            return b;
        }

    })(AGNOSTIC.Util = AGNOSTIC.Util || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});
