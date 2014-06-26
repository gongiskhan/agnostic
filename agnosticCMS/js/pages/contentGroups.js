$(function(){
    $('title, h1').html('Content Groups');

    AGNOSTIC.Ajax.get('contentGroup?id=1',undefined, function(r){
        if(r.value){
            var contentGroups = r.value;
            for(var i = 0; i < contentGroups.length; i++){
                $('#contentGroups').append('<li><span>'+contentGroups[i].name+'</span><a contentGroup=\"button\" class=\"removeButton\"><i class=\"icon-remove\"><\/i><\/a></li>');
            }
            $('.removeButton').on('click',function(e){
                e.preventDefault();
                $(e.target).closest('li').remove();
            });
        }
    },function(){
        AGNOSTIC.Ajax.post('contentGroup',{},function(){
            AGNOSTIC.PageLoader.render('contentGroups.html');
        });
    });
    $('.listButton').click(function(e){
        e.preventDefault();
        $(e.target).parent().find('ul').append('<li><span>'+$(e.target).parent().find('input[id="newContentGroup"]').val()+'</span><a contentGroup=\"button\" class=\"removeButton\"><i class=\"icon-remove\"><\/i><\/a></li></li>');
        $('.removeButton').off('click');
        $('.removeButton').on('click',function(e){
            e.preventDefault();
            var index =  $("#contentGroups").index($(e.target).closest('li').get(0));
            $("#contentGroups").children().slice(index).detach();
        });
    });

    $('.saveButton').on('click', function(e){
        e.preventDefault();
        console.log('Saving contentGroups.');
        var contentGroupsArray = [];
        $('#contentGroups li').each(function(it, el){
            contentGroupsArray.push({name: $(el).find('span').html()});
        });
        AGNOSTIC.Ajax.put('contentGroup', {id:1,value:contentGroupsArray});
    });
    $('.downloadResourcesButton').on('click',function(e){
        e.preventDefault();
        AGNOSTIC.Ajax.get('resource',null,function(r){
           console.debug(r);
        });
    });
});