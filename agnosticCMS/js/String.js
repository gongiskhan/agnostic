String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};
(function(AGNOSTIC, undefined){
    (function(String, undefined){

        String.capitalize = function(string){
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        String.prettyPrintCamelCase = function(string){
            var result = "";
            for(var i = 0, len = string.length; i < len; i++ ){
                if(i == 0)
                    result += string[0].toUpperCase();
                else if(string[i] == string[i].toUpperCase())
                    result += (" "+string[i]);
                else
                    result += string[i];
            }
            return result;
        }

    })(AGNOSTIC.String = AGNOSTIC.String || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});
