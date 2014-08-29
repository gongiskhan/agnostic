$(function(){
    $('title, h1').html('Roles');
    AGNOSTIC.Ajax.get('role',undefined, function(roles){
        if(roles){
            for(var i = 0; i < roles.length; i++){
                addRow(roles[i].id, roles[i].name);
            }
        }
    });
    function addRow(id, name){
        $('#roles').append('<li><span id="'+id+'">'+name+'</span><a role=\"button\" class=\"removeButton\"><i class=\"fa fa-times\"><\/i><\/a></li></li>');
        $('.removeButton').off('click');
        $('.removeButton').on('click',function(e){
            e.preventDefault();
            var id = $(e.target).closest('li').find('span').attr('id');
            AGNOSTIC.Ajax.delete('role',id);
            var index =  $("#roles").index($(e.target).closest('li').get(0));
            $("#roles").children().slice(index).detach();
        });
    }
    $('.listButton').click(function(e){
        e.preventDefault();
        addRow('', $(e.target).parent().find('input[id="newRole"]').val());
    });

    $('.saveButton').on('click', function(e){
        e.preventDefault();
        console.log('Saving Roles.');
        $('#roles li').each(function(it, el){
            var id = $(el).find('span').attr('id');
            if(!id)
                AGNOSTIC.Ajax.post('role',{name: $(el).find('span').html(), objectName:'role'});
        });
    });

});