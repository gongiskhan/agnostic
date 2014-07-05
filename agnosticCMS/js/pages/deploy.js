$(function(){
    $('title, h1').html('Download/Deploy');
    AGNOSTIC.Ajax.get('deliverable',null, function(deliverables){
        for(var i = 0; i < deliverables.length; i++){
            $('#deliverable').append('<option value="'+deliverables[i].id+'">'+deliverables[i].name+'</option>');
        }
    });
    $('.downloadResourcesButton').on('click',function(e){
        e.preventDefault();
        AGNOSTIC.Util.spin();
        var zip = new JSZip(),
            $deliverable = $('#deliverable'),
            contextObjects = {
                viewGroups: [],
                scriptResources: [],
                styleResources: [],
                views: [],
                deliverableTemplates: {}
            },
            asyncObjectsQueue = {
                viewGroups: 1,
                views: 1,
                templateResources: 1,
                componentResources: 1,
                allProcessed: function(){
                    var result = true,
                        keys = AGNOSTIC.Util.objectKeys(this);
                    for(var i = 0; i < keys.length; i++){
                        if(this[keys[i]] > 0){
                            result = false;
                            break;
                        }
                    }
                    return result;
                }
            };
        AGNOSTIC.Ajax.get('viewGroup',null,function(r){
            asyncObjectsQueue.viewGroups = r.length;
            for(var i = 0; i < r.length; i++){
                var viewGroup = r[i];
                if(viewGroup.deliverable == $deliverable.find('option:selected').html()){
                    contextObjects.viewGroups.push(viewGroup);
                }
                asyncObjectsQueue.viewGroups--;
            }
        });
        AGNOSTIC.Ajax.get('deliverable?id='+$deliverable.val(),null,function(deliverable){
            AGNOSTIC.Ajax.get('template',null,function(r){
                asyncObjectsQueue.templateResources = 0;
                for(var i = 0; i < r.length; i++) {
                    var template = r[i];
                    if (template.name == deliverable[template.type + 'Template']) {
                        contextObjects.deliverableTemplates[template.type] = template;
                        asyncObjectsQueue.templateResources += template.resources.length;
                    }
                }
                for(var t in contextObjects.deliverableTemplates){
                    var template = contextObjects.deliverableTemplates[t];
                    for (var it = 0; it < template.resources.length; it++) {
                        var resource = template.resources[it];
                        if(!AGNOSTIC.Util.arrayContains(contextObjects[resource.type=='JavaScript' ? 'scriptResources' : 'styleResources'],'name',resource.name)){
                            AGNOSTIC.Ajax.get('resource?id=' + resource.id, null, function (resource) {
                                contextObjects[resource.type=='JavaScript' ? 'scriptResources' : 'styleResources'].push(resource);
                                var fileContent = resource.content,
                                    b64Position = fileContent.indexOf('base64');
                                if (b64Position != -1) {
                                    fileContent = fileContent.split(',')[1];
                                    fileContent = b64Decode(fileContent);
                                    console.debug(fileContent);
                                }
                                zip.file(resource.name, fileContent);
                                asyncObjectsQueue.templateResources--;
                            });
                        }else{
                            asyncObjectsQueue.templateResources--;
                        }
                    }
                }
            });
        });
        AGNOSTIC.Ajax.get('view',null,function(r){
            asyncObjectsQueue.views = r.length;
            for(var i = 0; i < r.length; i++) {
                var view = r[i];
                if(view.deliverable == $deliverable.find('option:selected').html()){
                    asyncObjectsQueue.componentResources = 0;
                    for(var it = 0; it < view.components.length; it++){
                        var component = view.components[it];
                        asyncObjectsQueue.componentResources += component.scriptResources.length;
                        asyncObjectsQueue.componentResources += component.styleResources.length;
                        for(var iter = 0; iter < component.scriptResources.length; iter++){
                            var resource = component.scriptResources[iter];
                            if(!AGNOSTIC.Util.arrayContains(contextObjects.scriptResources,'name',resource.name)){
                                AGNOSTIC.Ajax.get('resource?id=' + resource.id, null, function (resource) {
                                    contextObjects.scriptResources.push(resource);
                                    var fileContent = resource.content,
                                        b64Position = fileContent.indexOf('base64');
                                    if (b64Position != -1) {
                                        fileContent = fileContent.split(',')[1];
                                        fileContent = b64Decode(fileContent);
                                        console.debug(fileContent);
                                    }
                                    zip.file(resource.name, fileContent);
                                });
                            }
                            asyncObjectsQueue.componentResources--;
                        }
                        for(var iter = 0; iter < component.styleResources.length; iter++){
                            var resource = component.styleResources[iter];
                            if(!AGNOSTIC.Util.arrayContains(contextObjects.styleResources,'name',resource.name)){
                                AGNOSTIC.Ajax.get('resource?id=' + resource.id, null, function (resource) {
                                    contextObjects.styleResources.push(resource);
                                    var fileContent = resource.content,
                                        b64Position = fileContent.indexOf('base64');
                                    if (b64Position != -1) {
                                        fileContent = fileContent.split(',')[1];
                                        fileContent = b64Decode(fileContent);
                                        console.debug(fileContent);
                                    }
                                    zip.file(resource.name, fileContent);
                                });
                            }
                            asyncObjectsQueue.componentResources--;
                        }
                    }
                }
                asyncObjectsQueue.views--;
            }
        });

        var asyncCheck = setInterval(function(){
            console.debug(asyncObjectsQueue);
            if(asyncObjectsQueue.allProcessed()){
                console.debug('Finished loading async objects');
                clearInterval(asyncCheck);

                var formatted = {};

                for(var t in contextObjects.deliverableTemplates){
                    var template = contextObjects.deliverableTemplates[t];
                    loadEngine(template.engine, template.content, function(engine){
                        //render menu and resources
                        if(template.type != 'layout'){
                            formatted[template.type] = engine.render({viewGroups: contextObjects.viewGroups, scriptResources: contextObjects.scriptResources, styleResources: contextObjects.styleResources});
                        }
                    });
                }
                for(var v in contextObjects.views){
                    var view = contextObjects.views[v],
                        layoutTemplate = contextObjects.deliverableTemplates.layout,
                        componentTemplate = contextObjects.deliverableTemplates.component;

                        loadEngine(componentTemplate.engine, componentTemplate.content, function(engine){
                            var contextObjectsForLayout = {
                                    formattedComponents: engine.render({components: view.components}),
                                    formattedMenu: formatted.menu,
                                    formattedScriptResources: formatted.scriptResources,
                                    formattedStyleResources: formatted.styleResources,
                                    view: view,
                                    viewGroups: contextObjects.viewGroups,
                                    scriptResources: contextObjects.scriptResources,
                                    styleResources: contextObjects.styleResources
                                };
                            loadEngine(layoutTemplate.engine, layoutTemplate.content, function(engine){
                                var formattedView = engine.render(contextObjectsForLayout);
                                zip.file(view.name+'.html', formattedView);
                            });
                        });
                }
                var content = zip.generate({type:"blob"});
                saveAs(content, $('#deliverable').val()+".zip");
                AGNOSTIC.Util.stopSpinning();
            }else{
                console.debug('Async objects not loaded yet.');
            }
        },200);
    });
    /*
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
    */
    function loadEngine(engine, tmpl, cb){
        switch(engine){
            case 'KnockoutJS': {
                if(typeof ko == 'undefined'){
                    AGNOSTIC.Util.loadScript({url:'lib/knockout-3.1.0.js', callback: function() {

                        //define a template source that simply treats the template name as its content
                        ko.templateSources.stringTemplate = function (template, templates) {
                            this.templateName = template;
                            this.templates = templates;
                        }

                        ko.utils.extend(ko.templateSources.stringTemplate.prototype, {
                            data: function (key, value) {
                                console.log("data", key, value, this.templateName);
                                this.templates._data = this.templates._data || {};
                                this.templates._data[this.templateName] = this.templates._data[this.templateName] || {};

                                if (arguments.length === 1) {
                                    return this.templates._data[this.templateName][key];
                                }

                                this.templates._data[this.templateName][key] = value;
                            },
                            text: function (value) {
                                if (arguments.length === 0 || typeof value == 'undefined') {
                                    return this.templates[this.templateName];
                                }
                                this.templates[this.templateName] = value;
                            }
                        });

                        //modify an existing templateEngine to work with string templates
                        function createStringTemplateEngine(templateEngine, templates) {
                            templateEngine.makeTemplateSource = function (template) {
                                return new ko.templateSources.stringTemplate(template, templates);
                            }
                            return templateEngine;
                        }

                        ko.renderTemplate = function (name, data) {

                            // create temporary container for rendered html
                            var temp = $("<div>");
                            // apply "template" binding to div with specified data
                            ko.applyBindingsToNode(temp[0], { template: { name: name, data: data } });
                            // save inner html of temporary div
                            var html = temp.html();
                            // cleanup temporary node and return the result
                            temp.remove();
                            return html;
                        };

                        var engine = {
                            render: (function () {
                                return function (data) {

                                    var viewModel = {
                                        templates:{
                                            tempo: tmpl
                                        }
                                    }
                                    for(var d in data){
                                        viewModel[d] = data[d];
                                    }

                                    ko.setTemplateEngine(createStringTemplateEngine(new ko.nativeTemplateEngine(), viewModel.templates));

                                    return ko.renderTemplate('tempo',viewModel);
                                }
                            })()
                        }
                        cb(engine);
                    }});
                }else{
                    var engine = {
                        render: (function() {
                                    return function(data){
                                        var viewModel = {
                                            templates:{
                                                tempo: tmpl
                                            }
                                        }
                                        for(var d in data){
                                            viewModel[d] = data[d];
                                        }

                                        ko.setTemplateEngine(createStringTemplateEngine(new ko.nativeTemplateEngine(), viewModel.templates));

                                        return ko.renderTemplate('tempo',viewModel);
                                    }
                                 })()
                    }
                    cb(engine);
                }
                break;
            }
            case 'Underscore':{
                if(typeof _ == 'undefined'){
                    AGNOSTIC.Util.loadScript({url:'lib/underscore-1.6.0.min.js', callback: function() {
                        var engine = {
                            render: (function() {
                                return function(data){

                                    var compiled = _.template(tmpl);

                                    return compiled(data);
                                }
                            })()
                        }
                        cb(engine);
                    }});
                }else{
                    var engine = {
                        render: (function() {
                            return function(data){

                                var compiled = _.template(tmpl);

                                return compiled(data);
                            }
                        })()
                    }
                    cb(engine);
                }
                break;
            }
            case 'JavaScript':{
                var engine = {
                    render: (function() {
                        return function(data){
                            var args = [];
                            var argsData = [];
                            for(var d in data){
                                args.push(d);
                                argsData.push(data[d]);
                            }
                            var functionBody = 'return ('+tmpl+').apply(undefined,arguments);';
                            var templateFunction = new Function(args, functionBody);
                            return templateFunction.apply(undefined, argsData);
                        }
                    })()
                }
                cb(engine);
                break;
            }
            default:{
                console.debug('DEFAULT?!?!?! LA-DI-DA');
            }
        }
    }
});