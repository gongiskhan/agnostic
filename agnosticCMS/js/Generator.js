(function(AGNOSTIC, undefined){
    (function(Generator, undefined){

        Generator.contextObjects = {
            viewGroups: [],
            scriptResources: [],
            styleResources: [],
            otherResources: [],
            views: [],
            deliverableTemplates: {}
        };
        Generator.formatted = {};
        Generator.currentFormattedView = null;

        Generator.getTemplates = function(deliverableId, complete, callback){

            var queue = AGNOSTIC.Queue.create();
            queue.add(AGNOSTIC.Ajax.get, ['deliverable?id=' + deliverableId, null], function (deliverable) {
                queue.add(AGNOSTIC.Ajax.get, ['template', null], function (r) {
                    for (var i = 0; i < r.length; i++) {
                        var template = r[i];
                        if (template.name == deliverable[template.type + 'Template']) {
                            Generator.contextObjects.deliverableTemplates[template.type] = template;
                        }
                    }
                    for (var t in Generator.contextObjects.deliverableTemplates) {
                        var template = Generator.contextObjects.deliverableTemplates[t];
                        for (var it = 0; it < template.resources.length; it++) {
                            var resource = template.resources[it];
                            var resourcesArray = resource.type == 'JavaScript' ? Generator.contextObjects.scriptResources : resource.type == 'CSS' ? Generator.contextObjects.styleResources : Generator.contextObjects.otherResources;
                            if (resourcesArray && !AGNOSTIC.Util.arrayContains(resourcesArray, 'name', resource.name)) {
                                queue.add(AGNOSTIC.Ajax.get, ['resource?id=' + resource.id, null], (function (resourcesArray) {
                                    return function (resource) {
                                        resourcesArray.push(resource);
                                    }
                                })(resourcesArray));
                            }
                        }
                    }
                });
            });
            queue.run((function(){ return function(){
                complete(Generator.contextObjects.deliverableTemplates, Generator.contextObjects.scriptResources, Generator.contextObjects.styleResources, Generator.contextObjects.otherResources);
                callback();
            }})());
        }

        Generator.generateMenu = function(deliverable, complete, callback){
            var queue = AGNOSTIC.Queue.create();
            queue.add(AGNOSTIC.Ajax.get, ['viewGroup', null], function (r) {
                for (var i = 0; i < r.length; i++) {
                    var viewGroup = r[i];
                    if (viewGroup.deliverable == deliverable) {
                        Generator.contextObjects.viewGroups.push(viewGroup);
                        if(typeof viewGroup.views != 'undefined')
                            for(var it = 0; it < viewGroup.views.length; it++){
                                queue.add(AGNOSTIC.Ajax.get, ['view?id='+viewGroup.views[it].id, null], (function(viewGroupCounter, viewCounter){ return function (view) {
                                    Generator.contextObjects.viewGroups[viewGroupCounter].views.splice(viewCounter,1,view);
                                }})(i, it));
                            }
                    }
                }
            });
            queue.add(function (callback) {
                var template = Generator.contextObjects.deliverableTemplates.menu;
                console.debug(Generator.contextObjects.viewGroups);
                loadEngine(template.engine, template.content, (function (template, cb) {
                    return function (engine) {
                        Generator.formatted.menu = engine.render({viewGroups: Generator.contextObjects.viewGroups});
                        cb();
                    }
                })(template, callback));
            }, []);
            queue.run((function(){ return function(){
                complete(Generator.formatted.menu);
                callback();
            }})());
        }

        Generator.generateScriptResources = function(complete, callback){
            var queue = AGNOSTIC.Queue.create();
            queue.add(function (callback) {
                var template = Generator.contextObjects.deliverableTemplates.scriptResource;
                Generator.formatted.scriptResources = '';
                for (var r in Generator.contextObjects.scriptResources) {
                    var resource = Generator.contextObjects.scriptResources[r];
                    queue.add((function(resource){
                        return function(callback) {
                            loadEngine(template.engine, template.content, (function (resource, cb) {
                                return function (engine) {
                                    Generator.formatted.scriptResources += engine.render({resource: resource});
                                    cb();
                                }
                            })(resource, callback));
                        }
                    })(resource),[]);
                }
                callback();
            }, []);
            queue.run((function(){ return function(){
                complete(Generator.formatted.scriptResources, Generator.contextObjects.scriptResources);
                callback();
            }})());
        }

        Generator.generateStyleResources = function(complete, callback){
            var queue = AGNOSTIC.Queue.create();
            queue.add(function (callback) {
                var template = Generator.contextObjects.deliverableTemplates.styleResource;
                Generator.formatted.styleResources = '';
                for (var r in Generator.contextObjects.styleResources) {
                    var resource = Generator.contextObjects.styleResources[r];
                    queue.add((function(resource){
                        return function(callback) {
                            loadEngine(template.engine, template.content, (function (resource, cb) {
                                return function (engine) {
                                    Generator.formatted.styleResources += engine.render({resource: resource});
                                    cb();
                                }
                            })(resource,  callback));
                        }
                    })(resource),[]);
                }
                callback();
            }, []);
            queue.run((function(){ return function(){
                complete(Generator.formatted.styleResources, Generator.contextObjects.styleResources);
                callback();
            }})());
        }

        Generator.getViews = function(deliverable, complete, callback){
            var queue = AGNOSTIC.Queue.create();
            queue.add(AGNOSTIC.Ajax.get, ['view', null], function (r) {
                for (var i = 0; i < r.length; i++) {
                    var view = r[i];
                    if (view.deliverable == deliverable) {
                        Generator.contextObjects.views.push(view);
                        for (var it = 0; it < view.components.length; it++) {
                            var component = view.components[it];
                            for (var iter = 0; iter < component.scriptResources.length; iter++) {
                                var resource = component.scriptResources[iter];
                                if (!AGNOSTIC.Util.arrayContains(Generator.contextObjects.scriptResources, 'name', resource.name)) {
                                    queue.add(AGNOSTIC.Ajax.get, ['resource?id=' + resource.id, null], (function(resource){return function (resource) {
                                        Generator.contextObjects.scriptResources.push(resource);
                                    }})(resource));
                                }
                            }
                            for (var iter = 0; iter < component.styleResources.length; iter++) {
                                var resource = component.styleResources[iter];
                                if (!AGNOSTIC.Util.arrayContains(Generator.contextObjects.styleResources, 'name', resource.name)) {
                                    queue.add(AGNOSTIC.Ajax.get, ['resource?id=' + resource.id, null], (function(resource){return function (resource) {
                                        Generator.contextObjects.styleResources.push(resource);
                                    }})(resource));
                                }
                            }
                        }
                    }
                }
            });
            queue.run((function(){ return function(){
                complete(Generator.contextObjects.views);
                callback();
            }})());
        }

        Generator.generateViews = function(deliverable, complete, callback){
            var queue = AGNOSTIC.Queue.create();
            queue.add(Generator.getViews, [deliverable, function(views){
                Generator.formatted.views = [];
                for (var v in Generator.contextObjects.views) {
                    var view = Generator.contextObjects.views[v];
                    queue.add(Generator.generateView, [view, function(formattedView){
                        Generator.formatted.views.push(formattedView);
                    }, view]);
                }
            }]);
            queue.run((function(){ return function(){
                complete(Generator.formatted.views);
                callback();
            }})());
        }

        Generator.generateView = function(view, complete, callback){
            var queue = AGNOSTIC.Queue.create();
            var layoutTemplate = Generator.contextObjects.deliverableTemplates.layout,
                componentTemplate = Generator.contextObjects.deliverableTemplates.component;

            queue.add(function(callback) {
                loadEngine(componentTemplate.engine, componentTemplate.content, function (engine) {
                    var formattedComponents = '';
                    for (var iternity = 0; iternity < view.components.length; iternity++) {
                        var component = view.components[iternity];
                        var componentConfiguration = [];
                        if (view.componentConfigValues)
                            for (var cmpConfig in view.componentConfigValues) {
                                var comConfigValue = view.componentConfigValues[cmpConfig];
                                if (comConfigValue.configurableItemPosition == iternity) {
                                    componentConfiguration.push(comConfigValue);
                                }
                            }
                        formattedComponents += engine.render({component: component, config: componentConfiguration});
                    }
                    var contextObjectsForLayout = {
                        formattedComponents: formattedComponents,
                        formattedMenu: Generator.formatted.menu,
                        formattedScriptResources: Generator.formatted.scriptResources,
                        formattedStyleResources: Generator.formatted.styleResources,
                        view: view,
                        viewGroups: Generator.contextObjects.viewGroups,
                        scriptResources: Generator.contextObjects.scriptResources,
                        styleResources: Generator.contextObjects.styleResources
                    };
                    queue.add(function(callback) {
                        loadEngine(layoutTemplate.engine, layoutTemplate.content, function(engine) {
                            var formattedView = engine.render(contextObjectsForLayout);
                            Generator.currentFormattedView = {name: contextObjectsForLayout.view.name, content: formattedView};
                            callback();
                        });
                    },[]);
                    callback();
                })
            },[]);
            queue.run((function(){ return function(){
                complete(Generator.currentFormattedView);
                callback();
            }})());
        }

        function loadEngine(engine, tmpl, callback){
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
                            callback(engine);
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
                        callback(engine);
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
                            callback(engine);
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
                        callback(engine);
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
                    callback(engine);
                    break;
                }
                default:{
                    console.debug('DEFAULT?!?!?! LA-DI-DA');
                }
            }
        }

    })(AGNOSTIC.Generator = AGNOSTIC.Generator || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});
