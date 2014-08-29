$(function(){
    $('title, h1').html('Download/Deploy');
    AGNOSTIC.Ajax.get('deliverable',null, function(deliverables){
        for(var i = 0; i < deliverables.length; i++){
            $('#deliverable').append('<option value="'+deliverables[i].id+'">'+deliverables[i].name+'</option>');
        }
    });
    $('.downloadResourcesButton').on('click',function(e) {
        e.preventDefault();
        AGNOSTIC.Util.spin();
        var zip = new JSZip(),
            deliverable = $('#deliverable').find('option:selected').html(),
            deliverableId = $('#deliverable').val();

        var queue = AGNOSTIC.Queue.create();

        queue.add(AGNOSTIC.Generator.getTemplates, [deliverableId, function(templates, scriptResources, styleResources, otherResources){
            console.debug('getTemplates completed.');
            var allResources = [];
            allResources = allResources.concat(scriptResources);
            allResources = allResources.concat(styleResources);
            allResources = allResources.concat(otherResources);
            for(var r in allResources){
                var resource = allResources[r];
                var fileContent = resource.content,
                    b64Position = fileContent.indexOf('base64');
                if (b64Position != -1) {
                    fileContent = fileContent.split(',')[1];
                    fileContent = atob(fileContent);
                    var array = [];
                    for(var i = 0; i < fileContent.length; i++) {
                        array.push(fileContent.charCodeAt(i));
                    }
                    fileContent = new Uint8Array(array);
                }
                zip.file(resource.name, fileContent);
            }
        }]);
        queue.add(AGNOSTIC.Generator.generateMenu, [deliverable,function(){
            console.debug('generateMenu completed.');
        }]);
        queue.add(AGNOSTIC.Generator.generateScriptResources, [function(formattedScriptResources, scriptResources){
            console.debug('generateScriptResources completed.');
            /*
            for(var r in scriptResources){
                var resource = scriptResources[r];
                var fileContent = resource.content,
                    b64Position = fileContent.indexOf('base64');
                if (b64Position != -1) {
                    fileContent = fileContent.split(',')[1];
                    fileContent = b64Decode(fileContent);
                }
                zip.file(resource.name, fileContent);
            }
            */
        }]);
        queue.add(AGNOSTIC.Generator.generateStyleResources, [function(formattedStyleResources, styleResources){
            console.debug('generateStyleResources completed.');
            /*
            for(var r in styleResources){
                var resource = styleResources[r];
                var fileContent = resource.content,
                    b64Position = fileContent.indexOf('base64');
                if (b64Position != -1) {
                    fileContent = fileContent.split(',')[1];
                    fileContent = b64Decode(fileContent);
                }
                zip.file(resource.name, fileContent);
            }
            */
        }]);
        queue.add(AGNOSTIC.Generator.generateViews, [deliverable, function(formattedViews){
            console.debug('generateViews completed.');
            for(var v in formattedViews){
                var formattedView = formattedViews[v];
                zip.file(formattedView.name + '.html', formattedView.content);
            }
        }]);
        queue.run(function(){
            console.debug('queue completed.');
            var content = zip.generate({type: "blob"});
            saveAs(content, deliverable + ".zip");
            AGNOSTIC.Util.stopSpinning();
        });
    });

});