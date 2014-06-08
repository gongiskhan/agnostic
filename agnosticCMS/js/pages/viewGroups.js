$(function(){
    $('title, h1').html('View Groups');
    AGNOSTIC.Ajax.get('viewGroups',undefined, function(r){
        AGNOSTIC.Table.create({ entityName:'viewGroup', target:'#viewGroups', data:r, editable:true });
    });
});