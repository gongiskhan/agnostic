var table;
$(function(){
    $('title, h1').html('Component Fragments');
    AGNOSTIC.Ajax.get('componentFragment',undefined, function(r){
        table = AGNOSTIC.Table.create({ entityName:'componentFragment', target:'#componentFragments', data:r, editable:true });
    });
    $('#searchContentButton').click(function(){
        AGNOSTIC.Ajax.get('componentFragmentsByContentPart',{contentPart: $('#searchContent').val() }, function(r){
            table.update(r);
        });
    });
});