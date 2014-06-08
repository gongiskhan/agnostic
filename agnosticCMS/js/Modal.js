//bug fix for bootstrap's maximum call size on modals.
$.fn.modal.Constructor.prototype.enforceFocus = function(){
    var that = this;
    $(document).off('focusin.modal');
    $(document).on('focusin.modal', function (e) {
        e.stopPropagation();
        if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus();
        }
    })
};

(function(AGNOSTIC, undefined){
    (function(Modal){

        //target, legend, info, text, formFields, callback, multiSelectArgs

        /**
         * Creates a new instance of a Modal. Should only be created once per target.
         * @param options
         * @... options.target A CSS selector for an existing container where the Modal will be created.
         * @... options.legend The title for the Modal.
         * @... options.text Optional introductory text.
         * @... options.formFields An Array of form field configuration for presenting in the modal if required. Each object should have these properties: label, name, type, [options(if type options is select)], [availableItems(if type childItems select)]
         * @... options.callback A Function to be called with the result of populating the form fields if any.
         */
        Modal.create = function (options) {
            return new init(options);
        }

        var init = function(options){

                var self = this;

                this.opts = {
                    target: options.target || 'body',
                    legend: options.legend || 'Modal',
                    text: options.text,
                    formFields: options.formFields || [],
                    callback: options.callback
                }

                this.multiSelects = {};
                this.tables = {};
                this.data;
                /**
                 * Gets a populated object result of submitting modal data.
                 * @returns {Object}
                 */
                this.getData = function(){
                    return self.data;
                }

                this.open = function(){
                    $(self.opts.target).find(self.opts.target+"_modal").modal('show');
                }

                $(this.opts.target).html('');
                $(this.opts.target).html(buildHTML.call(this));
                createMultiSelects.call(this);
                createTables.call(this);
                attachListeners.call(this);

                $(self.opts.target).find(this.opts.target+"_modal").modal('show');

                return this;
            },

            buildHTML = function(){
                var html = "";
                html += "<div id=\""+(this.opts.target.replace('#','')+"_modal")+"\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modalLabel\" aria-hidden=\"false\">";
                html += "    <div class=\"modal-header\">";
                html += "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;<\/button>";
                html += "        <h3 id=\"modalLabel\">"+this.opts.legend+"<span class=\"badge info\" title=\""+this.opts.info+"\">i</span><\/h3>";
                html += "    <\/div>";
                html += "    <div class=\"modal-body\">";
                if(this.opts.text)
                    html += "    <p>"+this.opts.text+"</p>";
                if(this.opts.formFields && this.opts.formFields.length > 0){
                    html += "    <div class=\"well\">";
                    for(var i = 0; i < this.opts.formFields.length; i++){
                        var formField = this.opts.formFields[i];
                        if(formField.type == 'text'){
                            html += "        <label>"+formField.label+"<\/label>";
                            html += "        <input type=\"text\" class=\"input-xlarge\" value=\""+(formField.value || "")+"\" id=\""+formField.name+"\"\/>";
                        }else if(formField.type == 'select'){
                            html += "        <label>"+formField.label+"<\/label>";
                            html += "        <select class=\"select\" id=\""+formField.name+"\" value=\""+(formField.value || "")+"\">";
                            for(var it = 0; it < formField.options.length; it++){
                                html += "<option";
                                if(formField.options[it] == formField.value)
                                    html += " selected=\"selected\">";
                                else
                                    html += ">";
                                html += formField.options[it];
                                html += "<\/option>";
                            }
                            html += "        <\/select>";
                        }else if(formField.type == 'list'){
                            html += "        <div class=\"listContainer\">";
                            html += "            <label>"+formField.label+"<\/label>";
                            html += "            <ul class=\"inline\" id=\""+formField.name+"\"><\/ul>";
                            html += "            <input type=\"text\" class=\"input-small\" id=\""+formField.name.substring(0,formField.name.length-1)+"\" \/>";
                            html += "            <button class=\"btn btn-small listButton\">Add<\/button>";
                            html += "        <\/div>";
                        }else if(formField.type == 'table'){
                            html += "        <div class=\"tableContainer\">";
                            html += "            <h3>"+formField.label+"<\/h3>";
                            html += "            <sup>Click cells to edit.<\/sup>";
                            html += "            <table class=\"table\" id=\""+formField.name+"\"\">";
                            html += "            <tr>";
                            for(var it = 0; it < formField.columns.length; it++){
                                html += ("<td style=\"font-weight:bold;\">"+formField.columns[it]+"<\/td>");
                            }
                            html += "            <\/tr>";
                            if(formField.value && formField.value.length > 0){
                                var firstColumnName = formField.value[0].columnName,
                                    lastColumnName = formField.value[formField.value.length-1].columnName;
                                for(var it = 0; it < formField.value.length; it++){
                                    if(formField.value[it].columnName == firstColumnName){
                                        html += "<tr class=\"editable\">";
                                    }
                                    html += ("<td style=\"border-right:1px dashed gray;\" data-column=\""+formField.value[it].columnName+"\" contenteditable>"+formField.value[it].value+"<\/td>");
                                    if(formField.value[it].columnName  == lastColumnName){
                                        html += "<\/tr>";
                                    }
                                }
                            }
                            html += "            <tr class=\"editable\">";
                            for(var it = 0; it < formField.columns.length; it++){
                                html += ("<td style=\"border-right:1px dashed gray;\" data-column=\""+formField.columns[it]+"\" contenteditable><\/td>");
                            }
                            html += "            <\/tr>";
                            html += "            <\/table>";
                            html += "            <br\/>";
                            html += "            <button class=\"btn btn-small tableButton\">Add Row<\/button>";
                            html += "            <br\/><br\/>";
                            html += "        <\/div>";
                        }
                        else if(formField.type == 'multiSelect'){
                            html += "<div id=\""+formField.name+"\"><fieldset class=\"dragDropArea\"></fieldset><\/div>";
                        }
                        else if(formField.type == 'childItems'){
                            html += "    <fieldset class=\"fieldset\" id=\"childItemsContainer_"+i+"\">";
                            html += "        <legend class=\"legend\">"+formField.label+"<\/legend>";
                            html += "        <a href=\"#\" class=\"btn btn-block btn-primary addChildItemButton\"><i class=\"icon-plus-sign\"><\/i> Add / Change Order<\/a>";
                            html += "        <br\/>";
                            html += "        <div class=\"well\" id=\"childItems_"+i+"\"><\/div>";
                            html += "    <\/fieldset>";
                            html += "    <div id=\"childConfigModalContainer_"+i+"\"></div>";
                            html += "    <br\/><br\/>";
                        }
                    }
                    html += "    <\/div>";
                }
                html += "    <\/div>";
                html += "    <div class=\"modal-footer\">";
                html += "        <button class=\"btn closeButton\" aria-hidden=\"true\">Close<\/button>";
                html += "        <button class=\"btn btn-primary okButton\">OK<\/button>";
                html += "    <\/div>";
                html += "<\/div>";
                return html;
            },
            adjustDimensionsToTable = function(){

                var self = this;
                //adjust to cope with tables in modals.
                if($(self.opts.target).find('[id$=Table]').width() > 300){

                    $(self.opts.target).find(self.opts.target+"_modal").css({
                        width: '99.3%',
                        height: '98%',
                        left: '17%',
                        top: '29%'
                    });
                    $(self.opts.target).find(self.opts.target+"_modal").offset({left:5});
                    $(self.opts.target).find(self.opts.target+"_modal .modal-body").css({
                        maxHeight: '100%'
                    });
                    $(self.opts.target).find(self.opts.target+"_modal .dwell").css({
                        width: ($(self.opts.target).find('[id$=Table]').width()+10)+'px',
                        'max-width': '90%'
                    });
                }
            },
            attachListeners = function(){

                var self = this;

                $(this.opts.target).find('.listButton').off('click');
                $(this.opts.target).find('.listButton').on('click',function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $(e.target).parent().find('ul').append('<li>'+$(e.target).parent().find('input[type="text"]').val()+'</li>');
                });
                $(this.opts.target).find('.tableButton').off('click');
                $(this.opts.target).find('.tableButton').on('click',function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $(e.target).parent().find('table').append($(e.target).parent().find('table tr:last-child').clone());
                });
                $(this.opts.target).find('.okButton').off('click');
                $(this.opts.target).find('.okButton').one('click',function(e){
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    populateData.call(self);
                    $(self.opts.target).find(self.opts.target+"_modal").modal('hide');
                    if(self.opts.callback)
                        self.opts.callback(self.data);
                    return false;
                });
                $(this.opts.target).find('.closeButton').off('click');
                $(this.opts.target).find('.closeButton').on('click',function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $(self.opts.target).find(self.opts.target+"_modal").modal('hide');
                });
                $(self.opts.target).find(self.opts.target+"_modal").one('show',function(e){
                    adjustDimensionsToTable.call(self);
                });
                $(this.opts.target).find('.addChildItemButton').off('click');
                $(this.opts.target).find('.addChildItemButton').on('click',function(e){
                    e.preventDefault();
                    var formFieldPosition = $(e.target).parent().attr('id').replace('childItemsContainer_',''),
                        formField = self.opts.formFields[formFieldPosition];
                    Modal.create({target:'#childConfigModalContainer_'+formFieldPosition, legend:'Add Items', formFields: [{
                        label:formField.label,
                        name:formField.name,
                        type:'multiSelect',
                        availableList: formField.availableItems,
                        selectedList: formField.selectedItems
                    }],
                    callback: function(object){
                        var c,sc;
                        //Populate selected items with populated items from available list.
                        for(sc in object[formField.name]){
                            for(c in formField.availableItems){
                                if(object[formField.name][sc].id == formField.availableItems[c].id){
                                    object[formField.name][sc] = formField.availableItems[c];
                                    break;
                                }
                            }
                        }

                        //Update the positions of the child item config objects.
                        var tableChildConfigData = self.tables[formField.name].getConfigData(),
                            newChildConfigData = [];
                        for(var i = 0; i < object[formField.name].length; i++){
                            var newObject = object[formField.name][i];
                            var oldObjectSamePosition = self.tables[formField.name].getData()[i];
                            if(oldObjectSamePosition && (newObject.id == oldObjectSamePosition.id)){
                                for(var it = 0; it < tableChildConfigData.length; it++){
                                    var childConfigItem = tableChildConfigData[it];
                                    if(childConfigItem.configurableItemPosition == i){
                                        newChildConfigData.push(childConfigItem);
                                    }
                                }
                            }else if(oldObjectSamePosition && (newObject.id != oldObjectSamePosition.id)){
                                for(var it = 0; it < tableChildConfigData.length; it++){
                                    var childConfigItem = tableChildConfigData[it];
                                    if(childConfigItem.configurableItemId == oldObjectSamePosition.id && childConfigItem.configurableItemPosition == i){
                                        for(var iter = 0; iter < object[formField.name].length; iter++){
                                            var newObjectAgain = object[formField.name][iter];
                                            if(newObjectAgain.id == oldObjectSamePosition.id){
                                                childConfigItem.configurableItemPosition = iter;
                                                newChildConfigData.push(childConfigItem);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        self.tables[formField.name].updateConfigData(newChildConfigData);
                        self.tables[formField.name].update(object[formField.name]);
                        adjustDimensionsToTable.call(self);
                    }});

                });
            },
            populateData = function(){
                var newObject = {id: 0},
                    self = this;
                if(self.opts.formFields)
                    for(var i = 0; i < self.opts.formFields.length; i++){
                        var formField = self.opts.formFields[i];
                        if(formField.type == 'list'){
                            newObject[formField.name] = [];
                            $('#'+formField.name+' li').each(function(it,el){
                                newObject[formField.name].push($(el).html());
                            });
                        }else if(formField.type == 'table'){
                            newObject[formField.name] = [];
                            $('#'+formField.name+' tr.editable').each(function(it,el){
                                var row = {},
                                    allEmpty = true;
                                $(this).find('td').each(function(iter, elem){
                                    row[$(elem).attr('data-column')] = $(elem).text();
                                    if($.trim($(elem).text()) !== "")
                                        allEmpty = false;
                                });
                                if(!allEmpty)
                                    newObject[formField.name].push(row);
                            });
                        }else if(formField.type == 'multiSelect'){
                            newObject[formField.name] = self.multiSelects[formField.name].getSelected();
                        }else if(formField.type == 'childItems'){
                            newObject.childItems = self.tables[formField.name].getData();
                            newObject.childItemsConfig = self.tables[formField.name].getConfigData();
                        }else{
                            newObject[formField.name] = $(self.opts.target).find('#'+formField.name).val();
                        }
                    }
                self.data = newObject;
            },
            createMultiSelects = function(){
                var prop,
                    self = this;
                for(prop in self.opts.formFields){
                    if(self.opts.formFields[prop].type == 'multiSelect')
                    self.multiSelects[self.opts.formFields[prop].name] = AGNOSTIC.MultiSelect.create({
                        target: $(self.opts.target).find('#'+self.opts.formFields[prop].name+' .dragDropArea'),
                        legend: self.opts.formFields[prop].label,
                        data:{
                            availableList: self.opts.formFields[prop].availableList,
                            selectedList: self.opts.formFields[prop].selectedList,
                            currentItem: self.opts.formFields[prop].currentItem
                        },
                        unique: self.opts.formFields[prop].unique
                    });
                }
            },
            createTables = function(){
                var prop,
                    self = this;
                for(var i = 0; i < self.opts.formFields.length; i++){
                    var formField = self.opts.formFields[i];
                    if(formField.type == 'childItems')
                        self.tables[formField.name] = AGNOSTIC.Table.create({
                            entityName: 'component',
                            target:'#childItems_'+i,
                            data: formField.selectedItems,
                            configurable: true,
                            configData: formField.configData,
                            isChild: true
                        });
                }
            }
    })(AGNOSTIC.Modal = AGNOSTIC.Modal || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});
