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

        var spinnerOptions={
            lines: 13, // The number of lines to draw
            length: 20, // The length of each line
            width: 10, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        },
            spinner = new Spinner(spinnerOptions);

        Util.spin = function(){
            spinner.spin(document.body);
        }

        Util.stopSpinning = function(){
            spinner.stop();
        }

        var load = function (resource, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";

            if (script.readyState) {  //IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback.apply(this, arguments);
                    }
                };
            } else {  //Others
                script.onload = function () {
                    callback.apply(this, arguments);
                };
                ///TODO: find a way to check if an error occured when Internet Explorer. Then use this also.
                //script.onerror = function () {};
            }

            script.src = resource;
            document.getElementsByTagName("head")[0].appendChild(script);
        };

        /**
         *  @function {public void} ? Loads a script dynamically into the page.
         *  @param {Object} args Structure with the arguments to load the script.
         *  @... {String} url Path to the resource.
         *  @... {Function} callback The function to be called after the script is loaded.
         */
        Util.loadScript = function (args) {
            load(args.url, args.callback);
        }

    })(AGNOSTIC.Util = AGNOSTIC.Util || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});
