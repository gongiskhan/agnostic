$(function(){
    $('title, h1').html('Roles');
    AGNOSTIC.Ajax.get('roles',undefined, function(r){
        for(var i = 0; i < r.length; i++){
            $('#roles').append('<li><span>'+r[i].name+'</span><a role=\"button\" class=\"removeButton\"><i class=\"icon-remove\"><\/i><\/a></li>');
        }
        $('.removeButton').on('click',function(e){
            e.preventDefault();
            $(e.target).closest('li').remove();
        });
    });
    $('.listButton').click(function(e){
        e.preventDefault();
        $(e.target).parent().find('ul').append('<li><span>'+$(e.target).parent().find('input[id="newRole"]').val()+'</span><a role=\"button\" class=\"removeButton\"><i class=\"icon-remove\"><\/i><\/a></li></li>');
        $('.removeButton').off('click');
        $('.removeButton').on('click',function(e){
            e.preventDefault();
            var index =  $("#roles").index($(e.target).closest('li').get(0));
            $("#roles").children().slice(index).detach();
        });
    });

    $('.saveButton').on('click', function(e){
        e.preventDefault();
        console.log('Saving Roles.');
        var rolesArray = [];
        $('#roles li').each(function(it, el){
            rolesArray.push({name: $(el).find('span').html()});
        });
        AGNOSTIC.Ajax.post('roles', rolesArray);
    });

});