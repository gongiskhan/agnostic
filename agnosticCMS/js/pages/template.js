$(function(){
    $('title, h1').html('Template');

    $('#engine').on('change',function(){
        $('#engineInfo span').hide();
        $('#engineInfo span#'+$(this).val()+'Info').show();
    });

    var resourcesMultiSelect,
        content;

    function afterLoad(template){
        AGNOSTIC.Ajax.get('resource',undefined, function(r){
            var pageResources = [];
            for(var i = 0; i < r.length; i++){
                if(r[i].type == 'CSS' || r[i].type == 'JavaScript' || r[i].name.indexOf('.css') != -1|| r[i].name.indexOf('.js') != -1){
                    pageResources.push(r[i]);
                }
            }
            resourcesMultiSelect = AGNOSTIC.MultiSelect.create({
                target: '#resourcesMultiSelect',
                legend: 'Resources',
                unique: true,
                data:{
                    availableList: pageResources,
                    selectedList: template && template.resources ? template.resources : null
                }
            });
        });
        AGNOSTIC.CodeEditor.makeEditable('content','html', function(editor){
            content = editor.getValue();
        },true);
        $('#engine').val(template.engine);
        $('#contentGroup').val(template.contentGroup);
    }

    if(AGNOSTIC.Util.getParam('id')){
        AGNOSTIC.Ajax.get('template?id='+AGNOSTIC.Util.getParam('id'), undefined, function(r){
            var template = r;
            $('#content').val(template.content);
            afterLoad(template);
        });
    }else{
       afterLoad(null);
    }

    function save(){
        console.log('Saving Template.');
        AGNOSTIC.Ajax[AGNOSTIC.Util.getParam('id') ? 'put': 'post']('template', {
            id: AGNOSTIC.Util.getParam('id') ? AGNOSTIC.Util.getParam('id') : 0,
            type: $('#type').val(),
            engine: $('#engine').va(),
            contentGroup: $('#contentGroup').val(),
            content: content,
            resources: resourcesMultiSelect ? resourcesMultiSelect.getSelected() : [],
            objectName: 'template'
        },function(r){
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