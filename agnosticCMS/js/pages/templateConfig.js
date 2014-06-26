$(function(){
    $('title, h1').html('Template Config');

    AGNOSTIC.Ajax.get('template', undefined, function(r){
        for(var i = 0; i < r.length; i++){
            var template = r[i];
            $("#"+template.type).html('');
        }
        for(var i = 0; i < r.length; i++){
            var template = r[i];
            var o = new Option(template.name, template.id);
            $(o).html(template.name);
            $("#"+template.type).append(o);
        }
        AGNOSTIC.Ajax.get('templateConfig', undefined, function(r){
            if(typeof r == 'undefined' || r == 500){
                AGNOSTIC.Ajax.post('templateConfig',{id:1});
                window.location.reload();
            }else {
                var templateConfig = r;
                $('#layout').val(templateConfig.layout);
                $('#menu').val(templateConfig.menu);
                $('#component').val(templateConfig.component);
                $('#scriptResource').val(templateConfig.scriptResource);
                $('#styleResource').val(templateConfig.styleResource);
                $('#contentGroup').val(templateConfig.contentGroup);
            }
        });
    });

    AGNOSTIC.Ajax.get('templateConfig', undefined, function(r){
        if(typeof r == 'undefined' || r == 500){
            AGNOSTIC.Ajax.post('templateConfig',{id:1});
            window.location.reload();
        }else {
            var templateConfig = r;
            $('#layout').val(templateConfig.layout);
            $('#menu').val(templateConfig.menu);
            $('#component').val(templateConfig.component);
            $('#scriptResource').val(templateConfig.scriptResource);
            $('#styleResource').val(templateConfig.styleResource);
            $('#contentGroup').val(templateConfig.contentGroup);
        }
    });

    function save(){
        console.log('Saving Template Config.');
        AGNOSTIC.Ajax.put('templateConfig', {
            id: 1,
            layout: $('#layout').val(),
            menu: $('#menu').val(),
            component: $('#component').val(),
            contentGroup: $('#contentGroup').val(),
            scriptResource: $('#scriptResource').val(),
            styleResource: $('#styleResource').val(),
            objectName: 'templateConfig'
        },function(r){
            if(localStorage)
                localStorage.setItem('agnosticCMSTemplates',r);
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