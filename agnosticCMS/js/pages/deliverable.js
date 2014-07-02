$(function(){
    $('title, h1').html('Deliverable');

    function afterLoad(deliverable, templates){
        $('#deliverable').html('');

        for(var i = 0; i < templates.length; i++){
            $('#'+templates[i].type+'Template').append('<option>'+templates[i].name+'</option>');
        }

        if(deliverable){
            $('#name').val(deliverable.name);
        }
    }

    if(AGNOSTIC.Util.getParam('id')){
        AGNOSTIC.Ajax.get('deliverable?id='+AGNOSTIC.Util.getParam('id'), undefined, function(r){
            var deliverable = r;
            AGNOSTIC.Ajax.get('template',undefined, function(templates){
                afterLoad(deliverable, templates);
            });
        });
    }else{
        AGNOSTIC.Ajax.get('template',undefined, function(templates){
            afterLoad(null, templates);
        });
    }

    $('.downloadResourcesButton').on('click',function(e){
        e.preventDefault();
        AGNOSTIC.Ajax.get('resource',null,function(r){
            var zip = new JSZip();
            for(var i = 0; i < r.length; i++){
                var resource = r[i];
                if(resource.deliverable = $('#name').val()){
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
            var content = zip.generate({type:"blob"});
            saveAs(content, $('#name').val()+".zip");
        });
    });

    function save(){
        console.log('Saving Deliverable.');
        var deliverable = {
            name: $('#name').val(),
            layoutTemplate: $('#layoutTemplate').val(),
            menuTemplate: $('#menuTemplate').val(),
            componentTemplate: $('#componentTemplate').val(),
            scriptResourceTemplate: $('#scriptResourceTemplate').val(),
            styleResourceTemplate: $('#styleResourceTemplate').val(),
            objectName: 'deliverable',
            id: AGNOSTIC.Util.getParam('id') ? AGNOSTIC.Util.getParam('id') : 0
        };
        AGNOSTIC.Ajax[AGNOSTIC.Util.getParam('id') ? 'put': 'post']('deliverable', deliverable, function(r){
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