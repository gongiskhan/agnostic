$(function(){
    $('title, h1').html('Views');
    AGNOSTIC.Ajax.get('view',undefined, function(r){
        AGNOSTIC.Table.create({ entityName:'view', target:'#views', data:r, editable:true });
    });
    AGNOSTIC.Ajax.get('viewGroup',{contentGroup:'cont1'},function(response){
       console.debug(response);
    });
});