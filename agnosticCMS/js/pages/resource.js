$(function(){
    $('title, h1').html('Resource');
    if(AGNOSTIC.Util.getParam('id')){
        $('html, body').scrollTo(1000);
    }

    var content,
        currentResource = {};

    function afterLoad(r){
        if(r){
            currentResource = r;
            $('#name').val(r.name);
            $('#type').val(r.type);
            //if(r && (r.type == 'JavaScript' || r.type == 'CSS')){
                $('#content').val(r.content);
            //}else{
                //$('#content').val('Not Editable (Only JavaScript and CSS resource types are supported)');
                //$('#content').attr('disabled','disabled');
            //}
        }
        AGNOSTIC.CodeEditor.makeEditable('content',r ? r.type.toLowerCase() : 'javascript', function(editor){
            content = editor.getValue();
        },true);
        $('#type').on('change',function(e){
            AGNOSTIC.CodeEditor.changeLanguage($(e.target).val() == 'JavaScript' ? 'javascript' : 'css');
        });
    }

    if(AGNOSTIC.Util.getParam('id')){
        AGNOSTIC.Ajax.get('resource',{id: AGNOSTIC.Util.getParam('id')}, function(r){
            afterLoad(r);
        });
    }else{
        afterLoad(null);
    }

    function save(){
        var resource = {
            name: $('#name').val(),
            type: $('#type').val(),
            content: content,
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