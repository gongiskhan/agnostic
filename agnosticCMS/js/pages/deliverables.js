var table;
$(function(){
    $('title, h1').html('Deliverable');
    AGNOSTIC.Ajax.get('deliverable',undefined, function(r){
        for(var i = 0; i < r.length; i++){
            $('#deliverable').append('<option value="'+r[i].id+'">'+r[i].name+'</option>');
        }
        if(!localStorage.getItem('agnostic_currentDeliverableId')){
            localStorage.setItem('agnostic_currentDeliverable', r[0].name);
            localStorage.setItem('agnostic_currentDeliverableId', r[0].id);
        }
        table = AGNOSTIC.Table.create({ entityName:'deliverable', target:'#deliverables', data:r, editable:true });

        $('#deliverable').on('change',function(e){
            localStorage.setItem('agnostic_currentDeliverable', $('#deliverable').find('option:selected').html());
            localStorage.setItem('agnostic_currentDeliverableId', $('#deliverable').val());
        });
    });
    $('#searchContentButton').click(function(){
        AGNOSTIC.Ajax.get('search',{objectName: 'deliverable',like: $('#searchContent').val() }, function(r){
            table.update(r);
        });
    });
});