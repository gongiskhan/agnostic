var table;
$(function(){
    $('title, h1').html('Components');
    AGNOSTIC.Ajax.get('component',undefined, function(r){
        table = AGNOSTIC.Table.create({ entityName:'component', target:'#components', data:r, editable:true });
    });
    $('#searchContentButton').click(function(){
        AGNOSTIC.Ajax.get('componentsByContentPart',{contentPart: $('#searchContent').val() }, function(r){
            table.update(r);
        });
    });
});