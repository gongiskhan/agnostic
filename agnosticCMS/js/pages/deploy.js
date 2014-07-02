$(function(){
    $('title, h1').html('Download/Deploy');
    AGNOSTIC.Ajax.get('deliverable',null, function(deliverables){
        for(var i = 0; i < deliverables.length; i++){
            $('#deliverable').append('<option value="'+deliverables[i].id+'">'+deliverables[i].name+'</option>');
        }
    });
    $('.downloadResourcesButton').on('click',function(e){
        e.preventDefault();
        AGNOSTIC.Util.spin();
        var zip = new JSZip();
        AGNOSTIC.Ajax.get('resource',null,function(r){
            for(var i = 0; i < r.length; i++){
                var resource = r[i];
                if(resource.deliverable == $('#deliverable').find('option:selected').html()){
                    var fileContent = resource.content,
                        b64Position = fileContent.indexOf('base64');
                    if(b64Position != -1){
                        fileContent = fileContent.split(',')[1];
                        fileContent = b64Decode(fileContent);
                        console.debug(fileContent);
                    }
                    zip.file(resource.name, fileContent);
                }
            }
            AGNOSTIC.Ajax.get('viewGroup',null,function(r){
                var viewGroups = [];
                for(var i = 0; i < r.length; i++){
                    var viewGroup = r[i];
                    if(viewGroup.deliverable == $('#deliverable').find('option:selected').html()){
                        viewGroups.push(viewGroup);
                    }
                }
                AGNOSTIC.Ajax.get('deliverable?id='+$('#deliverable').val(),null,function(deliverable){
                    AGNOSTIC.Ajax.get('template',null,function(r){
                        var deliverableTemplates = {};
                        for(var i = 0; i < r.length; i++) {
                            var template = r[i];
                            if(template.name == deliverable[template.type+'Template'])
                                deliverableTemplates[template.type] = template;
                        }
                        AGNOSTIC.Ajax.get('view',null,function(r){
                            for(var i = 0; i < r.length; i++) {
                                var view = r[i];
                                if(view.deliverable == $('#deliverable').find('option:selected').html()){
                                    var page = deliverableTemplates.layout.content;
                                    page = page.replaceAll('$TITLE',view.title);
                                    page = page.replaceAll('$VIEW',view.name);
                                    //TODO: pensar em sistema de colocar placeholders que são substituidos aqui (o melhor seria chamar um script que devolve um objecto para pode ir buscar informacao a webservices por exemplo)
                                    //page = page.replaceAll('[PLACEHOLDER_SERVICE]',view.service);

                                    var componentScriptResources = [];
                                    for(var i = 0; i < view.components.length; i++)
                                        mergeProperty(view.components[i],'scriptResources','subComponents',componentScriptResources);
                                    var componentStyleResources = [];
                                    for(var i = 0; i < view.components.length; i++)
                                        mergeProperty(view.components[i],'styleResources','subComponents',componentStyleResources);

                                    page = page.replaceAll('%%_TEMPLATE_RESOURCES',template.resources);
                                    page = page.replaceAll('%%_SCRIPT_COMPONENT_RESOURCES',componentScriptResources);
                                    page = page.replaceAll('%%_STYLE_COMPONENT_RESOURCES',componentStyleResources);
                                    var menuHTML = '';
                                    formatMenu(viewGroups,menuHTML);
                                    page = page.replaceAll('%%_MENU',menuHTML);
                                }
                            }
                        });
                    });
                });
            });
            var content = zip.generate({type:"blob"});
            saveAs(content, $('#deliverable').val()+".zip");
            AGNOSTIC.Util.stopSpinning();
        });
    });
    function mergeProperty(object,property,childObject,result){
        if(!result)
            result = [];
        for(var i = 0; i < object[property].length; i++){
            if(!AGNOSTIC.Util.arrayContains(result, 'id', object[property][i].id)){
                result.push(object[property][i]);
            }
        }
        if(object[childObject])
            for(var i = 0; i < object[childObject].length; i++){
                mergeProperty(object[childObject][i],property,childObject,result);
            }
        return result;
    }
});