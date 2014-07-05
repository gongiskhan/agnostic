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
        codeEditor,
        content='';

    function updateContent(){
        var defaultContent = {
            JavaScript:{
                scriptResource: 'function render(resource){\n\n}',
                styleResource: 'function render(resource){\n\n}',
                menu: 'function render(viewGroups){\n\n}',
                component: 'function render(components){\n\n}',
                layout: 'function render(formattedComponents, formattedMenu, formattedScriptResources, formattedStyleResources, view, viewGroups, scriptResources, styleResources){\n\n}'
            },
            Knockout:{
                menu: '\/\/Objects available are: viewGroups',
                component: '\/\/Objects available are: components',
                layout: '\/\/Objects available are: formattedComponents, formattedMenu, formattedScriptResources, formattedStyleResources, view, viewGroups, scriptResources, styleResources',
                scriptResource: '\/\/Objects available are: resource',
                styleResource: '\/\/Objects available are: resource'
            },
            Underscore:{
                menu: '\/\/Objects available are: viewGroups',
                component: '\/\/Objects available are: components',
                layout: '\/\/Objects available are: formattedComponents, formattedMenu, formattedScriptResources, formattedStyleResources, view, viewGroups, scriptResources, styleResources',
                scriptResource: '\/\/Objects available are: resource',
                styleResource: '\/\/Objects available are: resource'
            }
        };
        var currentIsDefault = (function(){
            for(var e in defaultContent){
                if(defaultContent.hasOwnProperty(e)){
                    var engine = defaultContent[e];
                    for(var t in engine){
                        if(engine.hasOwnProperty(t)){
                            if(content == engine[t])
                                return true;
                        }
                    }
                }
            }
        })();
        if(!content || currentIsDefault){
            codeEditor.setValue(defaultContent[$('#engine').val()][$('#type').val()]);
        }
    }

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
        if(template) {
            $('#name').val(template.name);
            $('#engine').val(template.engine);
            $('#type').val(template.type);
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
        AGNOSTIC.CodeEditor.makeEditable('content',$('#engine').val() == 'JavaScript' ? 'javascript' : 'html', function(editor){
            codeEditor = editor;
            content = editor.getValue();
        },true);
        $('#engine').on('change',function(e){
            updateContent();
            AGNOSTIC.CodeEditor.changeLanguage($(e.target).val() == 'JavaScript' ? 'javascript' : 'html');
        });
        $('#type').on('change',function(e) {
            updateContent();
        });
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
        console.debug(template);
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