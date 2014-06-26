$(function(){
    $('title, h1').html('Resource');
    if(AGNOSTIC.Util.getParam('id')){
        $('html, body').scrollTo(1000);
    }

    var content,
        currentResource = {};

    function afterLoad(r, contentGroups){
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
        for(var i = 0; i < contentGroups.length; i++){
            $('#contentGroup').append('<option value="'+contentGroups[i]+'">'+contentGroups[i]+'</option>');
        }
        $('#contentGroup').val(r ? r.contentGroups : 'common');
    }

    if(AGNOSTIC.Util.getParam('id')){
        AGNOSTIC.Ajax.get('resource',{id: AGNOSTIC.Util.getParam('id')}, function(r){
            AGNOSTIC.Ajax.get('contentGroup',undefined, function(contentGroups){
                afterLoad(r, contentGroups);
            });
        });
    }else{
        AGNOSTIC.Ajax.get('contentGroup',undefined, function(contentGroups){
            afterLoad(null, contentGroups);
        });
    }

    function save(){
        AGNOSTIC.Ajax.post('resource', {
            id: AGNOSTIC.Util.getParam('id') ? AGNOSTIC.Util.getParam('id') : 0,
            name: $('#name').val(),
            type: $('#type').val(),
            contentGroup: $('#contentGroup').val(),
            content: content,
            priority: currentResource.priority,
            objectName: 'resource'
        },function(){
            debugger;
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