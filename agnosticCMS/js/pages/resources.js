$(function(){
    $('title, h1').html('Resources');
    var resourcesTable;
    AGNOSTIC.Ajax.get('resource',undefined, function(r){
        resourcesTable = AGNOSTIC.Table.create({ entityName:'resource', target:'#resources', data:r, editable: true });
    });
    $('#searchContentButton').click(function(){
        AGNOSTIC.Ajax.get('resourcesByContentPart',{contentPart: $('#searchContent').val() }, function(r){
            resourcesTable.update(r);
        });
    });
});