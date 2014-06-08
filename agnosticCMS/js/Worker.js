(function(AGNOSTIC, undefined){
    (function(MemberOfTheWorkingForce){

        var currentWorkers = {};

        $(function(){
            window.onbeforeunload = function() {
                for(var worker in currentWorkers){
                    var now = new Date().getTime(),
                        expire = (now + 1000),
                        ponged = false;

                    currentWorkers[worker].addEventListener('message',function(e){
                        if(e.data.cmd == 'pong'){
                            ponged = true;
                        }
                    });
                    currentWorkers[worker].postMessage({cmd:'ping'});
                    while( now < expire){
                        now = new Date().getTime();
                    }
                    if(!ponged)
                        return 'Agnostic CMS is still working in the background. Please try closing/refreshing this page again in a few seconds. \n\n Important: If you force the browser to close you will loose changes and data might become inconsistent.';
                }
            }
        });

        if(typeof(Worker) !== "undefined") {
            console.debug('Browser supports Web Workers! Cool as a cool thing can be!');
        } else {
            alert('Unfortunately you will not be able to use Agnostic CMS in this browser. Please use a recent version of Chrome or Firefox for best results and absolutely required is a browser that supports Web Workers.');
        }

        MemberOfTheWorkingForce.formatPage = function(template, view){
            var worker = new Worker('js/worker/pageFormatter.js');
            if(currentWorkers.pageFormatter){
                currentWorkers.pageFormatter.postMessage({cmd:'stop'});
                currentWorkers.pageFormatter = null;
                delete currentWorkers.pageFormatter;
            }
            currentWorkers.pageFormatter = worker;
            worker.addEventListener('message',function(e){
                if(e.data.cmd == 'formatted'){
                    console.debug(6  );
                    console.debug(view.id);
                    if(view.id){
                        AGNOSTIC.Ajax.put('page',{id: view.id, name: view.name, content: e.data.page}, function(){
                            console.debug('Updated page: '+view.name);
                        });
                    }else{
                        AGNOSTIC.Ajax.post('page',{name: view.name, content: e.data.page}, function(){
                            console.debug('Created page: '+view.name);
                        });
                    }
                    setTimeout(function(){
                        AGNOSTIC.Ajax.get('page',null,function(r){
                            console.debug(r);
                        });
                    },2000);
                    currentWorkers.pageFormatter = null;
                    delete currentWorkers.pageFormatter;
                }
            });
            worker.postMessage({cmd:'format', template: template, view: view});
        }

    })(AGNOSTIC.Worker = AGNOSTIC.Worker || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});