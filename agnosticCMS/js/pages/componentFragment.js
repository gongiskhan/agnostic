$(function(){
    $('title, h1').html('Component Fragment');
    if(AGNOSTIC.Util.getParam('id')){
        $('html, body').scrollTo(1000);
    }

    var content,
        configElementsTable,
        configElementModal;

    function afterLoad(r){
        AGNOSTIC.CodeEditor.makeEditable('content',r ? r.type.toLowerCase() : 'javascript', function(editor){
            content = editor.getValue();
        },true);
        configElementsTable = AGNOSTIC.Table.create({
            entityName:'configElement',
            target:'#configElements',
            data: r ? r.configElements : []
        });
    }

    if(AGNOSTIC.Util.getParam('id')){
        AGNOSTIC.Ajax.get('componentFragment?id='+AGNOSTIC.Util.getParam('id'),null,function(r){
            $('#name').val(r.name);
            $('#type').val(r.type);
            $('#content').val(r.code);
            afterLoad(r);
        });
    }else{
        afterLoad();
    }

    $('.addConfigElementButton').on('click',function(e){
        e.preventDefault();

        configElementModal = AGNOSTIC.Modal.create({target:'#modalContainer', legend:'Config Element', formFields: [{
            label:'Name',
            name:'name',
            type:'text'
        },{
            label:'Type',
            name:'type',
            type:'select',
            options:['Text Field','DropDown','Table']
        },{
            label:'Options',
            name:'options',
            type:'list'
        },{
            label:'Columns',
            name:'columns',
            type:'list'
        },{
            label:'Placeholder',
            name:'placeHolder',
            type:'text'
        }],
            callback: function(configElement){
                AGNOSTIC.Ajax.post('configElement', configElement, function(r){
                    configElementsTable.getData().push(r);
                    configElementsTable.update();
                });
            }});

        function typeChanged(type){
            $('#modalContainer .listContainer').hide();
            if(type == 'Table')
                $('#modalContainer #columns').closest('.listContainer').show('fast');
            else if(type == 'DropDown')
                $('#modalContainer #options').closest('.listContainer').show('fast');
        }

        $('#modalContainer #type').change(function(e){
            typeChanged($(e.target).val());
        });

        typeChanged('Text Field');
    });

    function save(){
        console.log('Saving Component Fragment.');
        AGNOSTIC.Ajax.post('componentFragment', {
            id: AGNOSTIC.Util.getParam('id') ? AGNOSTIC.Util.getParam('id') : 0,
            name: $('#name').val(),
            type: $('#type').val(),
            code: content,
            configElements: configElementsTable.getData(),
            objectName: 'componentFragment'
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