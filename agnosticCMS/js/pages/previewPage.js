var page,
    formattedMenu,
    formatMenu,
    getTemplates,
    templates,
    currentDeliverableId,
    currentDeliverable,
    queue,
    formattedStyleResources,
    formattedScriptResources,
    allResourcesByName,
    allResourcesById;

page = AGNOSTIC.Util.getParam("page") || 'index';
formattedMenu = localStorage.getItem('agnostic_formattedMenu');
formatMenu = localStorage.getItem('agnostic_formatMenuFlag') || !formattedMenu;
templates = localStorage.getItem('agnostic_templates') ? JSON.parse(localStorage.getItem('agnostic_templates')) : null;
getTemplates = localStorage.getItem('agnostic_getTemplatesFlag') || !templates;
currentDeliverableId = localStorage.getItem('agnostic_currentDeliverableId');
currentDeliverable = localStorage.getItem('agnostic_currentDeliverable');
queue = AGNOSTIC.Queue.create();
formattedStyleResources = '';
formattedScriptResources = '';
allResourcesByName = {};
allResourcesById = {};

if (!currentDeliverableId) {
    alert('Please select a Active Deliverable from the Deliverables page first.');
} else {

    queue.add(AGNOSTIC.Ajax.get, ['resource',null], function (resources) {
        for(var r in resources){
            if(resources.hasOwnProperty(r)){
                var resource = resources[r];
                allResourcesByName[resource.name] = resource;
                allResourcesById[resource.id] = resource;
            }
        }
    });

    if (!templates) {
        templates = {};
        localStorage.setItem('agnostic_templates', JSON.stringify(templates));
    }

    if (getTemplates || !templates || !templates[currentDeliverableId]) {
        queue.add(AGNOSTIC.Generator.getTemplates, [currentDeliverableId, function (deliverableTemplates, scriptResources, styleResources, otherResources) {
            console.debug('getTemplates completed.');
            templates[currentDeliverableId] = deliverableTemplates;
            localStorage.setItem('agnostic_templates', JSON.stringify(templates));
            gotTemplates(templates[currentDeliverableId]);
        }]);
    } else {
        queue.add(gotTemplates, [templates[currentDeliverableId]]);
    }
    if (formatMenu) {
        queue.add(AGNOSTIC.Generator.generateMenu, [currentDeliverable, function () {
            console.debug('generateMenu completed.');
        }]);
    } else {
        AGNOSTIC.Generator.formatted.menu = formattedMenu;
    }

    queue.add(AGNOSTIC.Ajax.get, ['view',null], function (views) {
        for(var v in views){
            if(views.hasOwnProperty(v)){
                var view = views[v];
                console.debug(view.name);
                if(view.name == page){
                    queue.add(AGNOSTIC.Generator.generateView, [view, function (formattedView) {
                        var viewContent = formattedView.content;
                        var reg = /<img [^>]*src="([^"]+)"[^>]*>/ig;
                        var mtch = reg.exec(viewContent);
                        while(mtch != null){
                            var url = mtch[1];
                            if(allResourcesByName[url] && !url.contains('http')){
                                viewContent = viewContent.replaceAll(url,allResourcesByName[url].content);
                            }else{
                                console.warn('Resource not found: '+url);
                            }
                            mtch = reg.exec(viewContent);
                        }
                        document.write(viewContent);
                        $(window).trigger('DOMContentReady');
                        $(window).trigger('load');
                    }]);
                    break;
                }
            }
        }
    });

    queue.run(function(){

    });
}

function gotTemplates(delTemplates) {
    AGNOSTIC.Generator.contextObjects.deliverableTemplates = delTemplates;
    for (var tem in AGNOSTIC.Generator.contextObjects.deliverableTemplates) {
        for (var res in AGNOSTIC.Generator.contextObjects.deliverableTemplates[tem].resources) {
            var resou = AGNOSTIC.Generator.contextObjects.deliverableTemplates[tem].resources[res];
            var resource = allResourcesById[resou.id];
            var resourceContent;

            if (resource.type == 'JavaScript') {
                resourceContent = '<script type=\"text/javascript\">';
                var fileContent = resource.content,
                    b64Position = fileContent.indexOf('base64');
                if (b64Position != -1) {
                    fileContent = fileContent.split(',')[1];
                    fileContent = atob(fileContent);
                }
                resourceContent += fileContent;
                resourceContent += '<\/script>';
                formattedScriptResources += resourceContent;
            }
            else if (resource.type == 'CSS') {
                resourceContent = '<style type=\"text/css\">';
                resourceContent += resource.content;
                resourceContent += '<\/style>';
                formattedStyleResources += resourceContent;
            }
        }
    }
    var cssUrlsRegEx = /url\((.*?)[\)|\?|#]/ig;
    var matchUrl = cssUrlsRegEx.exec(formattedStyleResources);
    while (matchUrl != null) {
        var url = matchUrl[1].replaceAll('\'','').replaceAll('../','');
        if(allResourcesByName[url] && !url.contains('http')){
            formattedStyleResources = formattedStyleResources.replaceAll(matchUrl[1],allResourcesByName[url].content);
        }else{
            console.warn('Resource not found: '+url);
        }
        matchUrl = cssUrlsRegEx.exec(formattedStyleResources);
    }
    AGNOSTIC.Generator.formatted.scriptResources = formattedScriptResources;
    AGNOSTIC.Generator.formatted.styleResources = formattedStyleResources;
}