$(function(){
    $('title, h1').html('Template');
    var resourcesMultiSelect,
        content;

    AGNOSTIC.Ajax.get('template?id=1', undefined, function(r){
        if(typeof r == 'undefined' || r == 500){
            AGNOSTIC.Ajax.post('template',{id:1,content:''});
            window.location.reload();
        }else {
            var template = r;
            $('#content').val(template.content);
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
        }
    });

    function save(){
        console.log('Saving Template.');
        AGNOSTIC.Ajax.put('template', {
            id: 1,
            content: content,
            resources: resourcesMultiSelect ? resourcesMultiSelect.getSelected() : []
        },function(){
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