$(function(){
    $('title, h1').html('View Groups');
    AGNOSTIC.Ajax.get('viewGroup',undefined, function(r){
        AGNOSTIC.Table.create({ entityName:'viewGroup', target:'#viewGroups', data:r, editable:true });
        if(localStorage)
            localStorage.setItem('agnosticCMSViewGroups',r);
    });
});