$(function(){
    $('title, h1').html('View Group');
    var currentViewGroup = {},
        viewGroupsSelect,
        viewsSelect,
        rolesSelect;

    function afterMainLoad(viewGroup, views, roles, viewGroups, services){
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
        for(var i = 0; i < services.length; i++){
            $('#service').append('<option value="'+services[i]+'">'+services[i]+'</option>');
        }
        $('#service').val(viewGroup ? viewGroup.service : 'common');
    }
    if(AGNOSTIC.Util.getParam('id')){
        AGNOSTIC.Ajax.get('viewGroup',{id: AGNOSTIC.Util.getParam('id')}, function(r){
            currentViewGroup = r;
            $('#name').val(r.name);
            AGNOSTIC.Ajax.get('roles',undefined, function(roles){
                AGNOSTIC.Ajax.get('viewGroups',undefined, function(viewGroups){
                    AGNOSTIC.Ajax.get('views',undefined, function(views){
                        AGNOSTIC.Ajax.get('availableServices',undefined, function(services){
                            afterMainLoad(r, views, roles, viewGroups, services);
                        });
                    });
                });
            });
        });
    }else{
        AGNOSTIC.Ajax.get('roles',undefined, function(roles){
            AGNOSTIC.Ajax.get('viewGroups',undefined, function(viewGroups){
                AGNOSTIC.Ajax.get('views',undefined, function(views){
                    AGNOSTIC.Ajax.get('availableServices',undefined, function(services){
                        afterMainLoad(null, views, roles, viewGroups, services);
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
            service: $('#service').val(),
            views: viewsSelect.getSelected(),
            roles: rolesSelect.getSelected(),
            viewGroups: viewGroupsSelect.getSelected(),
            child: currentViewGroup.child
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