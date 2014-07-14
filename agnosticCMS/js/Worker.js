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
            console.debug('Browser supports Web Workers. That\'s cool as a cool thing can be!');
        } else {
            alert('Unfortunately you will not be able to use Agnostic CMS in this browser. Please use a recent version of Chrome or Firefox for best results and absolutely required is a browser that supports Web Workers.');
        }

        MemberOfTheWorkingForce.formatPage = function(templateConfig, view, viewGroups){

            formatPage(templateConfig, view, viewGroups);

            function formatPage(template, view, viewGroups){
                var page = template.content;
                page = page.replaceAll('$TITLE',view.title);
                page = page.replaceAll('$VIEW',view.name);
                //TODO: pensar em sistema de colocar placeholders que são substituidos aqui (o melhor seria chamar um script que devolve um objecto para pode ir buscar informacao a webservices por exemplo)
                //page = page.replaceAll('[PLACEHOLDER_SERVICE]',view.service);

                var componentScriptResources = [];
                for(var i = 0; i < view.components.length; i++)
                    mergeProperty(view.components[i],'scriptResources','subComponents',componentScriptResources);
                var componentStyleResources = [];
                for(var i = 0; i < view.components.length; i++)
                    mergeProperty(view.components[i],'styleResources','subComponents',componentStyleResources);

                page = page.replaceAll('%%_TEMPLATE_RESOURCES',template.resources);
                page = page.replaceAll('%%_SCRIPT_COMPONENT_RESOURCES',componentScriptResources);
                page = page.replaceAll('%%_STYLE_COMPONENT_RESOURCES',componentStyleResources);
                var menuHTML = '';
                formatMenu(viewGroups,menuHTML);
                page = page.replaceAll('%%_MENU',menuHTML);

                //self.postMessage({cmd:'formatted', page: page});
            }
            function mergeProperty(object,property,childObject,result){
                if(!result)
                    result = [];
                for(var i = 0; i < object[property].length; i++){
                    if(!AGNOSTIC.Util.arrayContains(result, 'id', object[property][i].id)){
                        result.push(object[property][i]);
                    }
                }
                if(object[childObject])
                for(var i = 0; i < object[childObject].length; i++){
                    mergeProperty(object[childObject][i],property,childObject,result);
                }
                return result;
            }

            /*
            var worker = new Worker('js/worker/pageFormatter.js');
            if(currentWorkers.pageFormatter){
                currentWorkers.pageFormatter.postMessage({cmd:'stop'});
                currentWorkers.pageFormatter = null;
                delete currentWorkers.pageFormatter;
            }
            currentWorkers.pageFormatter = worker;
            worker.addEventListener('message',function(e){
                if(e.data.cmd == 'formatted'){
                    //console.debug(6  );
                    //console.debug(view.id);
                    /*
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
            */
        }

    })(AGNOSTIC.Worker = AGNOSTIC.Worker || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});