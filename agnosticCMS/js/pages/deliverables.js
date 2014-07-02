var table;
$(function(){
    $('title, h1').html('Deliverable');
    AGNOSTIC.Ajax.get('deliverable',undefined, function(r){
        table = AGNOSTIC.Table.create({ entityName:'deliverable', target:'#deliverables', data:r, editable:true });
    });
    $('#searchContentButton').click(function(){
        AGNOSTIC.Ajax.get('search',{objectName: 'deliverable',like: $('#searchContent').val() }, function(r){
            table.update(r);
        });
    });
});