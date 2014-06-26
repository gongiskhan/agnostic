var table;
$(function(){
    $('title, h1').html('Templates');
    AGNOSTIC.Ajax.get('template',undefined, function(r){
        table = AGNOSTIC.Table.create({ entityName:'template', target:'#templates', data:r, editable:true });
    });
    $('#searchContentButton').click(function(){
        AGNOSTIC.Ajax.get('like',{objectName: 'template',like: $('#searchContent').val() }, function(r){
            table.update(r);
        });
    });
});