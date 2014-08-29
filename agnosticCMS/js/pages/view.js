$(function(){
    $('title, h1').html('View');
    var componentsTable,
        rolesMultiSelect,
        addComponentsModal;

    function afterLoad(view, roles, deliverables){

        //Concatenate config elements with the component fragments for configuration.
        var cmpts = null;
        if(view && view.components){

            cmpts = [];
            for(var i = 0; i < view.components.length; i++){

                var cmpt = view.components[i];
                var cfgElems = cmpt.configElements;
                for(var it = 0; it < cmpt.componentFragments.length; it++){
                    cfgElems = cfgElems.concat(cmpt.componentFragments[it].configElements);
                }
                cmpt.configElements = cfgElems;

                var cmptChildren = [];
                for(var iternity = 0; iternity < cmpt.subComponents.length; iternity++){
                    var cmptChild = cmpt.subComponents[iternity];
                    var cmptChildCfgElems = cmptChild.configElements;
                    for(var it = 0; it < cmptChild.componentFragments.length; it++){
                        cmptChildCfgElems = cmptChildCfgElems.concat(cmptChild.componentFragments[it].configElements);
                    }
                    cmptChild.configElements = cmptChildCfgElems;
                    cmptChildren.push(cmptChild);
                }
                cmpt.subComponents = cmptChildren;

                var subComponents = [];
                for(var iternity = 0; iternity < cmpt.subComponents.length; iternity++){
                    var cmptChild = cmpt.subComponents[iternity];
                    var cmptChildCfgElems = cmptChild.configElements;
                    for(var it = 0; it < cmptChild.componentFragments.length; it++){
                        cmptChildCfgElems = cmptChildCfgElems.concat(cmptChild.componentFragments[it].configElements);
                    }
                    cmptChild.configElements = cmptChildCfgElems;
                    subComponents.push(cmptChild);
                }
                cmpt.subComponents = subComponents;


                cmpts.push(cmpt);
            }
        }

        componentsTable = AGNOSTIC.Table.create({
            entityName: 'component',
            target:'#components',
            data: cmpts,
            configurable:true,
            configData: view && view.componentConfigValues ? view.componentConfigValues : [],
            childConfigData: view && view.subComponentConfigValues ? view.subComponentConfigValues : [],
            isChild: true
        });
        rolesMultiSelect = AGNOSTIC.MultiSelect.create({
            entityName: 'role',
            target: '#rolesMultiSelect',
            legend: 'Roles',
            unique: true,
            data:{
                availableList: roles,
                selectedList: view && view.roles ? view.roles : null
            }
        });
        if(deliverables)
            for(var i = 0; i < deliverables.length; i++){
                $('#deliverable').append('<option value="'+deliverables[i].name+'">'+deliverables[i].name+'</option>');
            }
        if(view)
            $('#deliverable').val(view.deliverable);
    }
    if(AGNOSTIC.Util.getParam('id')){
        $('.cloneButton').show();
        AGNOSTIC.Ajax.get('view',{id: AGNOSTIC.Util.getParam('id')}, function(r){
            $('#name').val(r.name);
            $('#title').val(r.title);
            if(r.fullBody){
                $('#fullBody').next('span').find('.cb-icon-check').show();
                $('#fullBody').next('span').find('.cb-icon-check-empty').hide();
            }
            AGNOSTIC.Ajax.get('deliverable',null, function(deliverables){
                AGNOSTIC.Ajax.get('role',null, function(roles){
                    afterLoad(r, roles, deliverables);
                });
            });
        });
    }else{
        AGNOSTIC.Ajax.get('deliverable',null, function(deliverables){
            AGNOSTIC.Ajax.get('role',null, function(roles){
                afterLoad(null, roles, deliverables);
            });
        });
    }

    $('.addComponentButton').on('click',function(e){
        e.preventDefault();

        AGNOSTIC.Ajax.get('component',undefined, function(componentsFetched){

            addComponentsModal = AGNOSTIC.Modal.create({target:'#modalContainer', legend:'Add Components', formFields: [{
                label:'Components',
                name:'components',
                type:'multiSelect',
                availableList: componentsFetched,
                selectedList: componentsTable.getData()
            }],
                callback:function(object){
                    var c,sc,
                        existingData = componentsTable.getData();
                    for(sc in object.components){
                        //First check if it exists in the current table (so we don't lose config)
                        var exists = false;
                        for(c in existingData){
                            if(object.components[sc].id == existingData[c].id){
                                object.components[sc] = existingData[c];
                                exists = true;
                                break;
                            }
                        }
                        if(!exists){
                            for(c in componentsFetched){
                                if(object.components[sc].id == componentsFetched[c].id){
                                    object.components[sc] = componentsFetched[c];
                                    break;
                                }
                            }
                        }
                    }
                    componentsTable.update(object.components);
                }});
        });

    });

    function getComponentsSubComponentsIds(){
        var componentsSubComponentsIds = [];
        for(var i = 0; i < componentsTable.getData().length; i++){
            var component = componentsTable.getData()[i];
            var subComponentIds = [];
            for(var it = 0; it < component.subComponents.length; it++)
                subComponentIds.push(component.subComponents[it].id);
            componentsSubComponentsIds.push({componentId:component.id, subComponentIds:subComponentIds});
        }
        return componentsSubComponentsIds;
    }

    function save(){
        console.log('Saving View.');

        var view = {
            name: $('#name').val(),
            title: $('#title').val(),
            deliverable: $('#deliverable').val(),
            fullBody: $('#fullBody').next('span').find('.cb-icon-check:visible').size() > 0,
            components: componentsTable.getData(),
            componentConfigValues: componentsTable.getConfigData(),
            subComponentConfigValues: componentsTable.getChildConfigData(),
            componentsSubComponentsIds: getComponentsSubComponentsIds(),
            roles: rolesMultiSelect.getSelected(),
            objectName: 'view',
            id: AGNOSTIC.Util.getParam('id') ? AGNOSTIC.Util.getParam('id') : 0
        };
        AGNOSTIC.Ajax[AGNOSTIC.Util.getParam('id') ? 'put' : 'post']('view', view);
    }
    $('.saveButton').on('click', function(e){
        e.preventDefault();
        save();
    });
    $(window).keydown(function(event) {
        if (!(String.fromCharCode(event.which).toLowerCase() == 's' && event.ctrlKey) && !(event.which == 19)) return true;
        save();
        return false;
    });
    $('.cloneButton').on('click', function(e){
        e.preventDefault();
        AGNOSTIC.Ajax.get('viewClone',{id: AGNOSTIC.Util.getParam('id')}, function(r){
            window.open('view.html?id='+ r.id);
        });
    });
    $('.previewButton').on('click', function(e){
        e.preventDefault();
        preview($('#name').val());
    });
});

function preview(pageName, formatMenuFlag, getTemplates){
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

        page = pageName || 'index';
        formattedMenu = localStorage.getItem('agnostic_formattedMenu');
        formatMenu = formatMenuFlag || !formattedMenu;
        templates = localStorage.getItem('agnostic_templates') ? JSON.parse(localStorage.getItem('agnostic_templates')) : null;
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
                                var w = window.open('','_blank');
                                w.document.write(viewContent);
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
}
