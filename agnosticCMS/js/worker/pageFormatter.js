(function(){
    String.prototype.replaceAll = function(target, replacement) {
        return this.split(target).join(replacement);
    };
    self.addEventListener('message', function(e) {
        var data = e.data;
        switch (data.cmd) {
            case 'ping':
                self.postMessage({cmd:'pong'});
                break;
            case 'format':
                formatPage(data.template, data.view);
                break;
            case 'stop':
                self.close();
                break;
            default:
                self.postMessage('Unknown command: ' + JSON.stringify(e.data));
        };
    }, false);
    function formatPage(template, view){
        var page = template.content;
        page = page.replaceAll('$TITLE',view.title);
        page = page.replaceAll('$VIEW',view.name);
        //TODO: pensar em sistema de colocar placeholders que são substituidos aqui (o melhor seria chamar um script que devolve um objecto para pode ir buscar informacao a webservices por exemplo)
        //page = page.replaceAll('[PLACEHOLDER_SERVICE]',view.service);

        var componentScriptResources = [];
        for(var component in view.components)
            mergeProperty(view.components[component],'scriptResources','subComponents',componentScriptResources);
        var componentStyleResources = [];
        for(var component in view.components)
            mergeProperty(view.components[component],'styleResources','subComponents',componentStyleResources);

        console.debug('MERGED:');
        console.debug(componentScriptResources);
        console.debug(componentStyleResources);
        for(var i = 0; i < componentScriptResources.length; i++){
            console.debug(componentScriptResources[i]);
        }
        for(var i = 0; i < componentStyleResources.length; i++){
            console.debug(componentStyleResources[i]);
        }

        self.postMessage({cmd:'formatted', page: page});
    }
    function mergeProperty(object,property,childObject,result){
        if(!result)
            result = [];
        for(var prop in object[property])
            if(result.indexOf(object[property][prop]) == -1)
                result.push(object[property][prop]);
        for(var prop in object[childObject][property])
            if(result.indexOf(object[childObject][property][prop]) == -1)
                mergeProperty(object[childObject][property][prop],property,childObject,result);
        return result;
    }
})();
