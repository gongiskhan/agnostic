$(function () {
    $('title, h1').html('Component');
    if(AGNOSTIC.Util.getParam('id')){
        $('html, body').scrollTo(1000);
    }

    var content,
        currentComponent = {},
        scriptResourcesMultiSelect,
        styleResourcesMultiSelect,
        componentFragmentsTable,
        subComponentsUsedTable,
        configElementsTable,
        configElementModal,
        componentFragmentsModal,
        subComponentsUsedModal;

    function afterLoad(component, resources) {

        componentFragments = component ? component.componentFragments : [];
        subComponentsUsed = component ? component.subComponentsUsed : [];

        componentFragmentsTable = AGNOSTIC.Table.create({
            target: '#componentFragments',
            entityName: 'componentFragment',
            data: component ? component.componentFragments : [],
            configurable: false,
            isChild: true
        });

        subComponentsUsedTable = AGNOSTIC.Table.create({
            target: '#subComponentsUsed',
            entityName: 'component',
            data: component ? component.subComponentsUsed : [],
            configurable: false,
            isChild: true
        });

        configElementsTable = AGNOSTIC.Table.create({
            target: '#configElements',
            entityName: 'configElement',
            data: component ? component.configElements : []
        });

        var scriptResources = [],
            styleResources = [];
        for (var i = 0; i < resources.length; i++) {
            var resource = resources[i];
            if (resource.type == 'JavaScript') {
                scriptResources.push(resource);
            } else if (resource.type == 'CSS') {
                styleResources.push(resource);
            }
        }

        scriptResourcesMultiSelect = AGNOSTIC.MultiSelect.create({
            target: '#scriptResourcesMultiSelect',
            legend: 'Script Resources',
            unique: true,
            data: {
                availableList: scriptResources,
                selectedList: component && component.scriptResources ? component.scriptResources : null
            }
        });
        styleResourcesMultiSelect = AGNOSTIC.MultiSelect.create({
            target: '#styleResourcesMultiSelect',
            legend: 'Style Resources',
            unique: true,
            data: {
                availableList: styleResources,
                selectedList: component && component.styleResources ? component.styleResources : null
            }
        });

        AGNOSTIC.CodeEditor.makeEditable('content', 'html', function (editor) {
            content = editor.getValue();
        },true);
    }

    if (AGNOSTIC.Util.getParam('id')) {
        AGNOSTIC.Ajax.get('component', {id: AGNOSTIC.Util.getParam('id')}, function (r) {
            currentComponent = r;
            $('#name').val(r.name);
            $('#content').val(r.template);
            AGNOSTIC.Ajax.get('resource', undefined, function (resources) {
                afterLoad(r, resources);
            });
        });
    } else {
        AGNOSTIC.Ajax.get('resource', undefined, function (resources) {
            afterLoad(null, resources);
        });
    }

    $('.addConfigElementButton').on('click', function (e) {
        e.preventDefault();

        configElementModal = AGNOSTIC.Modal.create({target: '#modalContainer', legend: 'Config Element', formFields: [
            {
                label: 'Name',
                name: 'name',
                type: 'text'
            },
            {
                label: 'Type',
                name: 'type',
                type: 'select',
                options: ['Text Field', 'DropDown', 'Table']
            },
            {
                label: 'Options',
                name: 'options',
                type: 'list'
            },
            {
                label: 'Columns',
                name: 'columns',
                type: 'list'
            },
            {
                label: 'Placeholder',
                name: 'placeHolder',
                type: 'text'
            }
        ],
            callback: function (configElement) {
                AGNOSTIC.Ajax.post('configElement', configElement, function (r) {
                    configElementsTable.getData().push(r);
                    configElementsTable.update();
                });
            }});

        function typeChanged(type) {
            $('#modalContainer .listContainer').hide();
            if (type == 'Table')
                $('#modalContainer #columns').closest('.listContainer').show('fast');
            else if (type == 'DropDown')
                $('#modalContainer #options').closest('.listContainer').show('fast');
        }

        $('#modalContainer #type').change(function (e) {
            typeChanged($(e.target).val());
        });

        typeChanged('Text Field');

    });

    $('.addComponentFragmentButton').on('click', function (e) {
        e.preventDefault();

        AGNOSTIC.Ajax.get('componentFragment', undefined, function (componentFragments) {
            componentFragmentsModal = AGNOSTIC.Modal.create({target: '#modalContainer', legend: 'Component Fragments', formFields: [
                {
                    label: 'Component Fragments',
                    name: 'componentFragments',
                    type: 'multiSelect',
                    availableList: componentFragments,
                    selectedList: componentFragmentsTable.getData()
                }
            ],
                callback: function (object) {
                    var c, sc;
                    for (sc in object.componentFragments) {
                        for (c in componentFragments) {
                            if (object.componentFragments[sc].id == componentFragments[c].id) {
                                object.componentFragments[sc] = componentFragments[c];
                                break;
                            }
                        }
                    }
                    componentFragmentsTable.update(object.componentFragments);
                }});
        });
    });

    $('.addSubComponentUsedButton').on('click', function (e) {
        e.preventDefault();

        AGNOSTIC.Ajax.get('component', undefined, function (components) {
            subComponentsUsedModal = AGNOSTIC.Modal.create({target: '#modalContainer', legend: 'Sub Components', formFields: [
                {
                    label: 'Sub Components Used',
                    text: 'Add sub-components that this component will know how to use. Actually adding components will be done on the View page.',
                    name: 'subComponentsUsed',
                    type: 'multiSelect',
                    unique: true,
                    availableList: components,
                    selectedList: subComponentsUsedTable.getData(),
                    currentItem: currentComponent
                }
            ],
                callback: function (object) {
                    var c, sc;
                    for (sc in object.subComponentsUsed) {
                        for (c in components) {
                            if (object.subComponentsUsed[sc].id == components[c].id) {
                                object.subComponentsUsed[sc] = components[c];
                                break;
                            }
                        }
                    }
                    subComponentsUsedTable.update(object.subComponentsUsed);
                }});
        });
    });

    function save(){
        console.log('Saving Component.');
        AGNOSTIC.Ajax[AGNOSTIC.Util.getParam('id') ? 'put' : 'post']('component', {
            name: $('#name').val(),
            template: content,
            subComponents:[],
            subComponentsUsed: subComponentsUsedTable.getData(),
            componentFragments: componentFragmentsTable.getData(),
            componentFragmentConfigValues: componentFragmentsTable.getConfigData(),
            configElements: configElementsTable.getData(),
            scriptResources: scriptResourcesMultiSelect.getSelected(),
            styleResources: styleResourcesMultiSelect.getSelected(),
            objectName: 'component',
            id: AGNOSTIC.Util.getParam('id') ? AGNOSTIC.Util.getParam('id') : 0
        });
    }

    $('.saveButton').on('click', function (e) {
        e.preventDefault();
        save();
    });

    $(window).keydown(function(event) {
        if (!(String.fromCharCode(event.which).toLowerCase() == 's' && event.ctrlKey) && !(event.which == 19)) return true;
        save();
        return false;
    });

});
