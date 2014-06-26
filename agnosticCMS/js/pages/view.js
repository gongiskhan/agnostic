$(function(){
    $('title, h1').html('View');
    var componentsTable,
        rolesMultiSelect,
        addComponentsModal;

    function afterLoad(view, roles, contentGroups){

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
                for(var iternity = 0; iternity < cmpt.subComponentsUsed.length; iternity++){
                    var cmptChild = cmpt.subComponentsUsed[iternity];
                    var cmptChildCfgElems = cmptChild.configElements;
                    for(var it = 0; it < cmptChild.componentFragments.length; it++){
                        cmptChildCfgElems = cmptChildCfgElems.concat(cmptChild.componentFragments[it].configElements);
                    }
                    cmptChild.configElements = cmptChildCfgElems;
                    cmptChildren.push(cmptChild);
                }
                cmpt.subComponentsUsed = cmptChildren;

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
            target: '#rolesMultiSelect',
            legend: 'Roles',
            unique: true,
            data:{
                availableList: roles,
                selectedList: view && view.roles ? view.roles : null
            }
        });
        $('#contentGroup').val(view ? view.contentGroup : 'common');
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

            AGNOSTIC.Ajax.get('role?id=1',undefined, function(roles){
                afterLoad(r, roles, null);
            });
        });
    }else{
        AGNOSTIC.Ajax.get('role?id=1',null, function(roles){
            afterLoad(null, roles, null);
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
            id: AGNOSTIC.Util.getParam('id') ? AGNOSTIC.Util.getParam('id') : 0,
            name: $('#name').val(),
            title: $('#title').val(),
            contentGroup: $('contentGroup').val(),
            fullBody: $('#fullBody').next('span').find('.cb-icon-check:visible').size() > 0,
            components: componentsTable.getData(),
            componentConfigValues: componentsTable.getConfigData(),
            subComponentConfigValues: componentsTable.getChildConfigData(),
            componentsSubComponentsIds: getComponentsSubComponentsIds(),
            roles: rolesMultiSelect.getSelected(),
            objectName: 'view'
        };
        console.debug(view);
        AGNOSTIC.Ajax[AGNOSTIC.Util.getParam('id') ? 'put' : 'post']('view', view, function(){
            AGNOSTIC.Ajax.get('viewGroup',{contentGroup:'cont1'},function(response){

                /*
                AGNOSTIC.Worker.formatPage(template, view, response);
                $('#info').html('Saved. '+res.responseText).show();
                */
            });
        });
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
});
