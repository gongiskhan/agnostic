(function(AGNOSTIC, undefined){
    (function(Table){

        /**
         * Creates a new instance of a Table. Should only be created once per target.
         * @param options
         * @... options.target A CSS selector for an existing container where the Table will be created.
         * @... options.entityName The name of the Entity being managed by the Table.
         * @... options.data An Array containing the data to be managed by the Table.
         * @... options.editable A Boolean flag indicating if the data items can be edited.
         * @... options.configurable A Boolean flag indicating if the data items can be configured.
         * @... options.configData An Array of ConfigElementValue objects that configure the items in this table.
         * @... options.childConfigData An Array of ChildConfigElementValueList objects that configure the configData items in this table.
         * @... options.isChild A Boolean flag indicating if the data items are composing a parent element (hence not deletable directly).
         */
        Table.create = function (options) {
            return new init(options);
        }

        var init = function(options){

                var self = this;

                this.opts = {
                    entityName: options.entityName,
                    data: options.data || [],
                    target: options.target || 'body',
                    editable: options.editable,
                    configurable: options.configurable,
                    configData: options.configData,
                    childConfigData: options.childConfigData,
                    isChild: options.isChild
                }
                /**
                 * Updates the data on this instance of Table.
                 * @param data An Array containing the new data.
                 */
                this.update = function(data){
                    self.opts.data = data || self.opts.data;
                    $(self.opts.target).html('');
                    $(self.opts.target).html(buildHTML.call(self));
                    //$('input[type="checkbox"]').checkbox();
                    attachListeners.call(self);
                }
                this.updateConfigData = function(newConfigData){
                    self.configData = newConfigData || self.configData;
                }
                /**
                 * Gets the data from the Table.
                 * @returns {Array} Array of data items.
                 */
                this.getData = function(){
                    return self.opts.data;
                }
                /**
                 * Gets the configuration data for the items in the Table.
                 * @returns {Array} Array of data items.
                 */
                this.getConfigData = function(){
                    return self.opts.configData;
                }
                /**
                 * Gets the configuration data for configuration items of the items in the Table.
                 * @returns {Array} Array of data items.
                 */
                this.getChildConfigData = function(){
                    return self.opts.childConfigData;
                }
                this.update(this.opts.data);
                return this;
            },

            buildHTML = function(){
                var html="";
                if(this.opts.data && this.opts.data.length > 0){
                    var h, o, r, c;
                    html += '<button type="button" class="btn btn-primary btn-xs pull-right selectAll">Select All</button>';
                    html += '<button type="button" class="btn btn-primary btn-xs pull-right removeSelected">Remove Selected</button>';
                    html += "    <table class=\"table\" id=\""+this.opts.target+"Table\">";
                    html += "        <thead>";
                    html += "        <tr>";
                    if(this.opts.configurable)
                        html += "        <th><span class=\"row-details row-details-closed toggleConfigAll\"></span></th>";
                    for(h in this.opts.data[0]){
                        if(h != 'code' && h != 'template' && h != 'content')
                            html += "        <th>"+AGNOSTIC.String.prettyPrintCamelCase(h)+"<\/th>";
                    }
                    html += "            <th style=\"width: 50px;\"><\/th>";
                    html += "        <\/tr>";
                    html += "        <\/thead>";
                    html += "        <tbody>";
                    var count = 0;
                    for(r in this.opts.data){

                        html += "<tr class=\"dataRow\" id=\"dataRow_"+this.opts.data[r].id+"\">";
                        if(this.opts.configurable)
                            html += "<td class=\"configTogglerCell\"><span class=\"row-details row-details-closed toggleConfig\"></span></td>";
                        for(o in this.opts.data[r]){
                            if(AGNOSTIC.Util.isArray(this.opts.data[r][o])){
                                if(typeof this.opts.data[r][o][0] == 'object'){
                                    var propName = typeof this.opts.data[r][o][0].name != 'undefined' ? 'name' : typeof this.opts.data[r][o][0].value != 'undefined' ? 'value' : 'columnName';
                                    html += "<td>"+AGNOSTIC.Util.joinByProp(this.opts.data[r][o],propName)+"<\/td>";
                                }else
                                    html += "<td>"+this.opts.data[r][o].join(', ')+"<\/td>";
                            }else if(AGNOSTIC.Util.isObject(this.opts.data[r][o])){
                                html += "<td>"+this.opts.data[r][o].name+"<\/td>";
                            }else if(o != 'code' && o != 'template' && o != 'content'){
                                html += "<td>"+this.opts.data[r][o]+"<\/td>";
                            }
                        }
                        html += '    <td style="padding:0.5em 0 0 0;">';
                        if(this.opts.editable)
                            html += "    <a href=\""+this.opts.entityName+".html?id="+this.opts.data[r].id+"\" class=\"editButton\"><i class=\"fa fa-pencil\"><\/i><\/a>&nbsp;&nbsp;&nbsp;";
                        if(this.opts.configurable)
                            html += "    <a href=\""+count+"\" class=\"configureButton\" id=\"configure_"+this.opts.data[r].id+"\"><i class=\"fa fa-cogs\"><\/i><\/a>&nbsp;&nbsp;&nbsp;";
                        html += "        <a role=\"button\" data-toggle=\"modal\" class=\"removeButton\" id=\"delete_"+this.opts.data[r].id+"\"><i class=\"fa fa-times\"><\/i><\/a>";
                        html += "        <input type=\"checkbox\" style=\"vertical-align:top;margin-left:4px;\"\/>";
                        html += "    <\/td>";
                        html += "<\/tr>";
                        if(this.opts.configurable){
                            html += "<tr class=\"itemConfigRow\"><td><\/td><td class=\"details\" colspan=\""+(AGNOSTIC.Util.objectKeys(this.opts.data[r]).length-1)+"\">";
                            html += "<b>Item Configuration<\/b><br\/><br\/>";
                            for(c in this.opts.configData){
                                if(this.opts.configData[c].configurableItemPosition == count){
                                    html += "<div>";
                                    html += "    <span class=\"label\">"+this.opts.configData[c].configElement.name+"</span>";
                                    if(this.opts.configData[c].value)
                                        html += "<span>"+this.opts.configData[c].value+"</span>";
                                    else if(this.opts.configData[c].columnValues)
                                        html += "<span>"+AGNOSTIC.Util.joinByProp(this.opts.configData[c].columnValues,'value')+"</span>";
                                    html += "<\/div>";
                                }
                            }
                            html += "<\/td><\/tr>";
                        }
                        count++;
                    }
                    html += "       <\/tbody>";
                    html += "    <\/table>";
                    if(this.opts.configurable)
                        html += "<div id=\""+this.opts.target.replace('#','')+"_configModal\"><\/div>";
                }else{
                    html += '<p>None</p>';
                }
                return html;
            },
            attachListeners = function(){

                var self = this;

                $(this.opts.target).find('.removeButton').off('click');
                $(this.opts.target).find('.removeButton').on('click',function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    removeSelectedItem.call(self, $(e.target).closest('tr').get(0));
                    self.update();
                });
                $(this.opts.target).find('.removeSelected').off('click');
                $(this.opts.target).find('.removeSelected').on('click',function(e){
                    e.preventDefault();
                    var selectedIds = [];
                    $(self.opts.target).find('input:checked').each(function(it,el){
                        selectedIds.push($(el).parent().find('.removeButton').attr('id').replace('delete_',''));
                    });
                    removeSelectedItems.call(self, selectedIds);
                });
                $(this.opts.target).find('.selectAll').off('click');
                $(this.opts.target).find('.selectAll').on('click',function(e){
                    e.preventDefault();
                    $(self.opts.target).find('input[type="checkbox"]').attr('checked',true);
                });

                $(this.opts.target).find('.configureButton').off('click');
                $(this.opts.target).find('.configureButton').on('click',function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    configureItem.call(self, e.target);
                });
                $(this.opts.target).find('.toggleConfig').off('click');
                $(this.opts.target).find('.toggleConfig').on('click',function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $(e.target).parent().parent().next('.itemConfigRow').toggle();
                    $(e.target).toggleClass('row-details-closed').toggleClass('row-details-open');
                });
                $(this.opts.target).find('.toggleConfigAll').off('click');
                $(this.opts.target).find('.toggleConfigAll').on('click',function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $(e.target).toggleClass('row-details-closed').toggleClass('row-details-open');
                    $(self.opts.target).find('.toggleConfig').each(function(it,el){
                       if($(e.target).hasClass('row-details-open')){
                           $(el).parent().parent().next('.itemConfigRow').show();
                           $(el).removeClass('row-details-closed').removeClass('row-details-open').addClass('row-details-open');
                       }else{
                           $(el).parent().parent().next('.itemConfigRow').hide();
                           $(el).removeClass('row-details-closed').removeClass('row-details-open').addClass('row-details-closed');
                       }
                    });
                });

            },
            removeSelectedItem = function(itemElement){

                var self = this;

                AGNOSTIC.Modal.create({
                    target:'#modalContainer',
                    legend:'Confirm Delete',
                    text:'Are you sure you want to delete this item?',
                    callback:function(){
                        var index;
                        $(self.opts.target).find('.table tbody tr.dataRow').each(function(it,el){
                            if($(el).attr('id') == itemElement.getAttribute('id')){
                                index = it;
                            }
                        });
                        $(self.opts.target).find('.table tbody').children().slice(index,index+1).detach();
                        if(self.opts.configurable)
                            $(self.opts.target).find('.table tbody').children().slice(index,index+1).detach();
                        self.opts.data.splice(index,1);

                        if(self.opts.configData)
                        for(var i = 0; i < self.opts.configData.length; i++){
                            var configItem = self.opts.configData[i];
                            if(configItem.configurableItemPosition == (index+1)){
                                self.opts.configData.splice(i,1);
                            }
                        }
//                        if(self.opts.childConfigData)
//                            for(var i = 0; i < self.opts.childConfigData.length; i++){
//                                for(var it = 0; it < self.opts.childConfigData[i].configValues.length; it++){
//                                    var configItem = self.opts.childConfigData[i].configValues[it];
//                                    if(configItem.configurableItemPosition == index){
//                                        self.opts.childConfigData[i].configValues.splice(it,1);
//                                    }
//                                }
//                            }

                        if(self.opts.isChild){
                            self.update();
                        }else{
                            AGNOSTIC.Ajax.delete(self.opts.entityName, $(itemElement).find('a.removeButton').attr('id').replace('delete_',''), function(r){
                                $('#info').text('Deleted: '+JSON.stringify(r)).show();
                                self.update();
                            });
                        }
                    }
                });
            },
            removeSelectedItems = function(itemIds){

                var self = this;

                AGNOSTIC.Modal.create({
                    target:'#modalContainer',
                    legend:'Confirm Delete',
                    text:'Are you sure you want to delete '+itemIds.length+' items?',
                    callback:function(){
                        for(var i = 0; i < itemIds.length; i++){

                            var index =  $(self.opts.target).find('.table tbody tr').index($(self.opts.target).find('.table tbody #'+itemIds[i]));
                            $(self.opts.target).find('.table tbody').children().slice(index,index+1).detach();
                            self.opts.data.splice(index,1);

                            if(self.opts.isChild){
                                self.update();
                            }else{
                                AGNOSTIC.Ajax.delete(self.opts.entityName, itemIds[i], i < (itemIds.length-1) ? function(){} : function(){
                                    $('#info').text('Deleted: '+itemIds.length+' items.').show();
                                    localStorage.removeItem("AGNOSTIC_Message");
                                    self.update();
                                });
                            }
                        }
                    }
                });
            },
            configureItem = function(itemElement){

                var self = this;

                var id = $(itemElement).closest('a.configureButton').attr('id').replace('configure_',''),
                    configurableItem,
                    position = $(itemElement).closest('a.configureButton').attr('href');

                for(var i =0; i < self.opts.data.length; i++){
                    if(i == position){
                        configurableItem = this.opts.data[i];
                        break;
                    }
                }

                var modalArgs = {
                    target:this.opts.target+'_configModal',
                    legend: 'Configure',
                    formFields:[],
                    callback: function(config){

                        config.configurableItemId = id;
                        config.configurableItemPosition = position;

                        var configItem,
                            c;
                        for(var i = 0; i < self.opts.data.length; i++){
                            if(config.configurableItemId == self.opts.data[i].id){
                                configItem = self.opts.data[i];
                                break;
                            }
                        }

                        for(c in config){
                            if(c != 'id' && c != 'configurableItemId'  && c != 'configurableItemPosition' && c != 'configurableItemPosition' && c != 'childItems' && c != 'childItemsConfig'){

                                var configElementValue = {},
                                    configElementId = c.replace('configElement_',''),
                                    configElement;
                                for(var i = 0; i < configItem.configElements.length; i++){
                                    if(configElementId == configItem.configElements[i].id){
                                        configElement = configItem.configElements[i];
                                        break;
                                    }
                                }

                                configElementValue.configElement = configElement;
                                configElementValue.configurableItemId = config.configurableItemId;
                                configElementValue.configurableItemPosition = config.configurableItemPosition;

                                if(AGNOSTIC.Util.isArray(config[c])){
                                    configElementValue.columnValues = [];
                                    for(var i = 0; i < config[c].length; i++){
                                        var cv;
                                        for(cv in config[c][i]){
                                            configElementValue.columnValues.push({
                                                columnName: cv,
                                                value: config[c][i][cv]
                                            });
                                        }
                                    }
                                }else{
                                    configElementValue.value = config[c];
                                }

                                var added =false;
                                for(var itr = 0; itr < self.opts.configData.length; itr++){
                                    if(self.opts.configData[itr].configurableItemPosition == configElementValue.configurableItemPosition && self.opts.configData[itr].configElement.name == configElementValue.configElement.name){
                                        self.opts.configData.splice(itr,1,configElementValue);
                                        added = true;
                                        break;
                                    }
                                }
                                if(!added){
                                    self.opts.configData.push(configElementValue);
                                }
                            }else if(c == 'childItems'){
                                self.opts.data[config.configurableItemPosition].subComponents = config.childItems;

                                var existsInChildConfigData = false,
                                    childConfigDataPosition;
                                for(var itre = 0; itre < self.opts.childConfigData.length; itre++){
                                    if(self.opts.childConfigData[itre].configurableItemPosition == config.configurableItemPosition && self.opts.childConfigData[itre].configurableItemId == config.configurableItemId){
                                        self.opts.childConfigData[itre].configValues = config.childItemsConfig;
                                        existsInChildConfigData = true;
                                        childConfigDataPosition = itre;
                                        break;
                                    }
                                }
                                //Add or remove from the childConfigData
                                if(!existsInChildConfigData){
                                    self.opts.childConfigData.push({
                                        configurableItemId: config.configurableItemId,
                                        configurableItemPosition: config.configurableItemPosition,
                                        configValues: config.childItemsConfig
                                    });
                                    childConfigDataPosition = self.opts.childConfigData.length - 1;
                                }
                                //Clean childItemsConfig for deleted items.
                                for(var iternity = 0; iternity < self.opts.childConfigData[childConfigDataPosition].configValues.length; iternity++){
                                    var configItem = self.opts.childConfigData[childConfigDataPosition].configValues[iternity],
                                        existsInNewConfig = false;
                                    for(var iterio = 0; iterio < config.childItems.length; iterio++){
                                        if(configItem.configurableItemId == config.childItems[iterio].id){
                                            existsInNewConfig = true;
                                            break;
                                        }
                                    }
                                    if(!existsInNewConfig){
                                        self.opts.childConfigData[childConfigDataPosition].configValues.splice(iternity,1);
                                        iternity--;
                                    }
                                }
                            }
                        }
                        self.update();
                    }
                };
                if(configurableItem){

                    for(var i = 0; i < configurableItem.configElements.length; i++){
                        var configElement = configurableItem.configElements[i],
                            value = "";
                        for(var itr = 0; itr < self.opts.configData.length; itr++){
                            if(self.opts.configData[itr].configurableItemPosition == position && self.opts.configData[itr].configElement.name == configElement.name){
                                if(self.opts.configData[itr].columnValues && self.opts.configData[itr].columnValues.length > 0){
                                    value = self.opts.configData[itr].columnValues;
                                }else{
                                    value =  self.opts.configData[itr].value || "";
                                }
                                break;
                            }
                        }
                        if(configElement.type == 'Text Field'){
                            modalArgs.formFields.push({
                                type:'text',
                                label:configElement.name,
                                name:'configElement_' + configElement.id,
                                value: value
                            });
                        }else if(configElement.type == 'Table'){
                            modalArgs.formFields.push({
                                type: 'table',
                                label: configElement.name,
                                name: 'configElement_' + configElement.id,
                                columns: configElement.columns,
                                value: value
                            });
                        }else if(configElement.type == 'DropDown'){
                            modalArgs.formFields.push({
                                type: 'select',
                                label: configElement.name,
                                name: 'configElement_' + configElement.id,
                                options: configElement.options,
                                value: value
                            });
                        }
                    }
                    if(self.opts.childConfigData && (typeof configurableItem.subComponentsUsed != 'undefined' && configurableItem.subComponentsUsed.length >0)){
                        var childConfigDataProp,
                            childConfigDataItem;
                        for(childConfigDataProp in self.opts.childConfigData){
                            var childConfigItem = self.opts.childConfigData[childConfigDataProp];
                            if(childConfigItem.configurableItemId == configurableItem.id
                                && childConfigItem.configurableItemPosition == position){
                                childConfigDataItem = childConfigItem
                                break;
                            }
                        }
                        if(!childConfigDataItem){
                            childConfigDataItem = {
                                configurableItemId: configurableItem.id,
                                configurableItemPosition: position,
                                configValues: []
                            };
                        }
                        modalArgs.formFields.push({
                            type: 'childItems',
                            label: 'Sub Components',
                            name: 'childItem_' + position,
                            availableItems: configurableItem.subComponentsUsed,
                            selectedItems: configurableItem.subComponents,
                            configData: childConfigDataItem.configValues
                        });
                    }
                }

                AGNOSTIC.Modal.create(modalArgs);
            }
    })(AGNOSTIC.Table = AGNOSTIC.Table || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});
