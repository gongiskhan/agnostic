$(function(){
    $('title, h1').html('View Group');
    var currentViewGroup = {},
        viewGroupsSelect,
        viewsSelect,
        rolesSelect;

    function afterMainLoad(viewGroup, views, roles, viewGroups, contentGroups){
        viewGroupsSelect = AGNOSTIC.MultiSelect.create({
            target:'#viewGroupsMultiSelect',
            legend:'View Groups',
            unique: true,
            data:{
                availableList: viewGroups,
                selectedList: viewGroup && viewGroup.viewGroups ? viewGroup.viewGroups : null,
                currentItem: currentViewGroup
            }
        });
        viewsSelect = AGNOSTIC.MultiSelect.create({
            target:'#viewsMultiSelect',
            legend:'Views',
            unique: true,
            data:{
                availableList: views,
                selectedList: viewGroup && viewGroup.views ? viewGroup.views : null
            }
        });
        rolesSelect = AGNOSTIC.MultiSelect.create({
            target:'#rolesMultiSelect',
            legend:'Roles',
            unique: true,
            data:{
                availableList: roles,
                selectedList: viewGroup && viewGroup.roles ? viewGroup.roles : null
            }
        });
        if(contentGroups)
        for(var i = 0; i < contentGroups.length; i++){
            $('#contentGroup').append('<option value="'+contentGroups[i].id+'">'+contentGroups[i].name+'</option>');
        }
        if(viewGroup)
            $('#contentGroup').val(viewGroup.contentGroup);
    }
    if(AGNOSTIC.Util.getParam('id')){
        AGNOSTIC.Ajax.get('viewGroup',{id: AGNOSTIC.Util.getParam('id')}, function(r){
            currentViewGroup = r;
            $('#name').val(r.name);
            AGNOSTIC.Ajax.get('role?id=1',undefined, function(roles){
                AGNOSTIC.Ajax.get('viewGroup',undefined, function(viewGroups){
                    AGNOSTIC.Ajax.get('view',undefined, function(views){
                        AGNOSTIC.Ajax.get('contentGroup?id=1',undefined, function(contentGroups){
                            afterMainLoad(r, views, roles.value, viewGroups, contentGroups.value);
                        });
                    });
                });
            });
        });
    }else{
        AGNOSTIC.Ajax.get('role?id=1',undefined, function(roles){
            AGNOSTIC.Ajax.get('viewGroup',undefined, function(viewGroups){
                AGNOSTIC.Ajax.get('view',undefined, function(views){
                    AGNOSTIC.Ajax.get('contentGroup?id=1',undefined, function(contentGroups){
                        afterMainLoad(null, views, roles.value, viewGroups, contentGroups.value);
                    });
                });
            });
        });
    }

    function save(){
        console.log('Saving View Group.');
        AGNOSTIC.Ajax.post('viewGroup', {
            id: AGNOSTIC.Util.getParam('id') ? AGNOSTIC.Util.getParam('id') : 0,
            name: $('#name').val(),
            contentGroups: $('#contentGroups').val(),
            views: viewsSelect.getSelected(),
            roles: rolesSelect.getSelected(),
            viewGroups: viewGroupsSelect.getSelected(),
            child: currentViewGroup.child,
            objectName: 'viewGroup'
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
});