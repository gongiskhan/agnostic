$(function(){
    $('title, h1').html('Resource');
    if(AGNOSTIC.Util.getParam('id')){
        $('html, body').scrollTo(1000);
    }

    var content,
        currentResource = {};

    function afterLoad(r, deliverables){
        if(r){
            currentResource = r;
            $('#name').val(r.name);
            $('#type').val(r.type);
            if(r && (r.type == 'JavaScript' || r.type == 'CSS')){
                $('#content').val(r.content);
            }else{
                $('#content').val('Not Editable (Only JavaScript and CSS resource types are supported)');
                $('#content').attr('disabled','disabled');
            }
        }
        AGNOSTIC.CodeEditor.makeEditable('content',r ? r.type.toLowerCase() : 'javascript', function(editor){
            content = editor.getValue();
        },true);
        if(deliverables && deliverables.length > 0);
        for(var i = 0; i < deliverables.length; i++){
            var deliverable = deliverables[i];
            $('#deliverable').append('<option value="'+deliverable.name+'">'+deliverable.name+'</option>');
        }
    }

    if(AGNOSTIC.Util.getParam('id')){
        AGNOSTIC.Ajax.get('resource',{id: AGNOSTIC.Util.getParam('id')}, function(r){
            AGNOSTIC.Ajax.get('deliverable',undefined, function(deliverables){
                afterLoad(r, deliverables);
            });
        });
    }else{
        AGNOSTIC.Ajax.get('deliverable',undefined, function(deliverables){
            afterLoad(null, deliverables);
        });
    }

    function save(){
        var resource = {
            name: $('#name').val(),
            type: $('#type').val(),
            deliverable: $('#deliverable').val(),
            content: content,
            priority: currentResource.priority,
            objectName: 'resource',
            id: AGNOSTIC.Util.getParam('id') ? AGNOSTIC.Util.getParam('id') : 0
        };
        console.debug(resource);
        AGNOSTIC.Ajax[AGNOSTIC.Util.getParam('id') ? 'put' : 'post']('resource', resource,function(){
            $('#info').text('Saved Successfully').css('display','block');
        });
    }

    $('.saveButton').on('click',function(e){
        e.preventDefault();
        save();
    });
    $(window).keydown(function(event) {
        if (!(String.fromCharCode(event.which).toLowerCase() == 's' && event.ctrlKey) && !(event.which == 19)) return true;
        save();
        return false;
    });
});