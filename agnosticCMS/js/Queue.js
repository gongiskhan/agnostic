(function(AGNOSTIC, undefined){
    (function(Queue){

        var constructor = function(){
            this.functions = [];
            this.currentPosition = 0;
            this.running = false;
        }

        constructor.prototype.add = function(func, args, callback){
            if(this.running){
                this.functions.splice(this.currentPosition+1,0,{func: func, args: args, cb: callback});
            }else{
                this.functions.push({func: func, args: args, cb: callback});
            }
        }

        constructor.prototype.run = function(complete){
            var self = this;
            self.running = true;
            self.next = function(){
                var f = self.functions[self.currentPosition];
                var funcParameters = funcParams(f.func);
                var getCallback= function(cb, handleComplete){
                    return function(res){
                        if(typeof cb != 'undefined')
                            cb.apply(this,[res]);
                        self.currentPosition++;
                        if(typeof self.functions[self.currentPosition] != 'undefined'){
                            self.next();
                        }else{
                            self.running = false;
                            if(complete){
                                complete();
                            }
                        }
                    }
                };
                var callbackFound = false;
                for (var it = 0; it < funcParameters.length; it++){
                    var param = funcParameters[it].trim();
                    if(param == 'callback'){
                        f.args.splice(it, 0, getCallback(f.cb, complete));
                        callbackFound = true;
                        break;
                    }
                }
                f.func.apply(f.func, f.args);
                if(!callbackFound){
                    getCallback(f.cb, complete)();
                }
            }
            self.next();
        }

        var funcParams = function(func){
            var reg = /\(([\s\S]*?)\)/;
            var params = reg.exec(func);
            if (params)
                var param_names = params[1].split(',');
            return param_names;
        }

        Queue.create = function(){
            return new constructor();
        }

    })(AGNOSTIC.Queue = AGNOSTIC.Queue || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});