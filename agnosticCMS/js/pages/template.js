$(function(){
    $('title, h1').html('Template');

    function updateEngineInfo(engine){
        $('#engineInfo span').hide();
        $('#engineInfo span#'+engine+'Info').show();
    }

    $('#engine').on('change',function(){
        updateEngineInfo($(this).val());
    });

    updateEngineInfo('AgnosticPlaceholders');

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
        if(template) {
            $('#name').val(template.name);
            $('#engine').val(template.engine);
        }
        if(template && template.engine){
            $('#engine option').each(function(it,el){
               if($(this).html() == template.engine){
                   $(this).attr('selected','selected');
               }
            });
        }else{
            $('#engine option:first-child').attr('selected', 'selected');
        }
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
        var template = {
            name: $('#name').val(),
            type: $('#type').val(),
            engine: $('#engine').val(),
            content: content,
            resources: resourcesMultiSelect ? resourcesMultiSelect.getSelected() : [],
            objectName: 'template',
            id: AGNOSTIC.Util.getParam('id') ? AGNOSTIC.Util.getParam('id') : 0
        };
        AGNOSTIC.Ajax[AGNOSTIC.Util.getParam('id') ? 'put': 'post']('template', template, function(r){
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