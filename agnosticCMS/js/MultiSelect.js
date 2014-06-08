(function(AGNOSTIC, undefined){
    (function(MultiSelect){

        /**
         * Creates a new instance of a MultiSelect. Should only be created once per target.
         * @param options
         * @... options.target A CSS selector for an existing container where the MultiSelect will be created.
         * @... options.legend The title for the MultiSelect area.
         * @... options.data.availableList An Array of items to select from.
         * @... options.data.selectedList An Array of items that were previously selected.
         * @... options.data.currentItem The item being edited if its the same as the items list.
         * @... options.unique A Boolean flag indicating if the available items can be selected more than once.
         * @... options.availableLabel The label for the available items list.
         * @... options.selectedLabel The label for the selected items list.
         */
        MultiSelect.create = function (options) {
            return new init(options);
        }

        var init = function(options){

                var self = this;

                this.opts = {
                    legend: options.legend || 'Choose',
                    data: {
                        availableList: options.data ? options.data.availableList || [] : [],
                        selectedList: options.data ? options.data.selectedList || [] : [],
                        currentItem: options.data ? options.data.currentItem : null
                    },
                    target: options.target || 'body',
                    availableLabel: options.availableLabel || 'Available',
                    selectedLabel: options.selectedLabel || 'Selected',
                    unique: options.unique || false
                }
                /**
                 * Updates the data on this instance of MultiSelect.
                 * @param data
                 * @... data.availableList An Array of items to select from.
                    * @... data.selectedList An Array of items that were previously selected.
                 */
                this.update = function(data){
                    self.opts.data = data || self.opts.data;
                    $(self.opts.target).html('');
                    $(self.opts.target).html(buildHTML.call(self));
                    attachListeners.call(self);

                    if($('.dropArea').height() < $('.dragArea').height()){
                        $('.dropArea').height($('.dragArea').height());
                    }else if($('.dropArea').height() > $('.dragArea').height()){
                        $('.dragArea').height($('.dropArea').height());
                    }

                }
                /**
                 * Gets the selected items
                 * @returns {Array} Array of objects with an id and a name.
                 */
                this.getSelected = function(){
                    var selected = [];
                    $(this.opts.target).find('.selected li').each(function(it, el){
                        selected.push({id: $(el).find('span.label').attr('id')});
                    });
                    return selected;
                }
                $(this.opts.target).addClass('dragDropArea');
                this.update(this.opts.data);
                return this;
            },

            buildHTML = function(){
                var html="";
                html += "<legend>"+this.opts.legend+"<\/legend>";
                html += "<fieldset class=\"fieldset\" style=\"border-right:0.1em dashed gray;padding-right:1em;vertical-align:top;\">";
                html += "    <legend class=\"legend\"><sup>"+this.opts.availableLabel+"<\/sup><\/legend>";
                html += "    <ul class=\"blocks-list dragArea available\">";
                if(this.opts.data.availableList)
                    for(var i = 0; i < this.opts.data.availableList.length; i++){
                        if( ( !this.opts.data.currentItem || this.opts.data.currentItem.name != this.opts.data.availableList[i].name )  && (!this.opts.unique || !AGNOSTIC.Util.arrayContains(this.opts.data.selectedList, 'id', this.opts.data.availableList[i].id)) )
                            html += buildAvailableItemHTML.call(this, this.opts.data.availableList[i]);
                    }
                html += "    <\/ul>";
                html += "<\/fieldset>";
                html += "<fieldset class=\"fieldset\">";
                html += "    <legend class=\"legend\"><sup>"+this.opts.selectedLabel+"<\/sup><\/legend>";
                html += "    <ul class=\"list dropArea selected\">";
                if(this.opts.data.selectedList)
                    for(var i = 0; i < this.opts.data.selectedList.length; i++){
                        html += buildSelectedItemHTML.call(this, this.opts.data.selectedList[i]);
                    }
                html += "    <\/ul>";
                html += "<\/fieldset>";
                return html;
            },
            buildAvailableItemHTML= function(item){
                return  "<li><span class=\"label label-success\" id=\""+item.id+"\">"+item.name+"<\/span><\/li>";
            },
            buildSelectedItemHTML = function(item){
                var html = '';
                html += "    <li>";
                html += "       <span class=\"label label-success\" id=\""+item.id+"\">"+item.name+"<\/span>";
                html += "       <a href=\"#\" class=\"button icon-trash with-tooltip confirm removeButton\" title=\"Remove\"><\/a>";
                html += "    <\/li>";
                return html;
            },
            attachListeners = function(){

                var self = this,
                    dropped = false,
                    draggable_sibling;

                $(this.opts.target).find('.available li').draggable({
                    revert: self.opts.unique ? 'invalid' : true
                });

                $(this.opts.target).find('.selected').parent().droppable({
                    accept: " .available li",
                    hoverClass: "greenBorder",
                    drop:function(e,ui){
                        dropped = true;
                        var item = {
                            id: ui.draggable.find('span').attr('id'),
                            name: ui.draggable.find('span').text()
                        }
                        $(self.opts.target).find('.selected').append(buildSelectedItemHTML.call(this, item)).fadeIn();
                        if(self.opts.unique)
                            ui.draggable.remove();
                        attachRemoveButtonsListener.call(self);
                    }
                });

                $(this.opts.target).find('.selected').sortable({
                    start: function(event, ui) {
                        draggable_sibling = $(ui.item).prev();
                    },
                    stop: function(event, ui) {
                        if (dropped) {
                            if (draggable_sibling.length == 0)
                                $(this.opts.target).find('.selected li').prepend(ui.item);

                            draggable_sibling.after(ui.item);
                            dropped = false;
                        }
                    }
                });

                attachRemoveButtonsListener.call(this);
            },
            attachRemoveButtonsListener = function(){
                var self = this;
                $(this.opts.target).find('.removeButton').off('click');
                $(this.opts.target).find('.removeButton').on('click',function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    removeSelectedItem.call(self, $(e.target).closest('li').get(0));
                    self.update();
                });
            },
            removeSelectedItem = function(itemElement){
                var index =  $(this.opts.target).find('ul.selected li').index(itemElement);
                $(this.opts.target).find('ul.selected').children().slice(index,index+1).detach();
                this.opts.data.selectedList.splice(index,1);
            }

    })(AGNOSTIC.MultiSelect = AGNOSTIC.MultiSelect || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});
