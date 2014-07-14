$(function(){
    $('title, h1').html('Add Resources');
    var files = [],
        doneReading;

    $('.fileContent').change(function(e){

        var readers = [],
            fileCount = 0,
            filesNumber = 0;

        //We cannot use length as directories are also listed so we only count files.
        for(var i = 0; i < e.target.files.length; i++){
            if(e.target.files[i].name != '.')
                filesNumber++;
        }

        doneReading = false;
        files = [];

        for(var i = 0; i < e.target.files.length; i++){

            if(e.target.files[i].name != '.'){
                readers.push(new FileReader());
                readers[readers.length-1].onloadend = (function(it){
                    return function(e){
                        files[it].content = e.target.result;
                        fileCount++;
                        if( fileCount == filesNumber ){
                            doneReading = true;
                        }
                    }
                })(readers.length-1);

                var fileExt = e.target.files[i].name.substring(e.target.files[i].name.lastIndexOf('.')+1, e.target.files[i].name.length),
                    fileName = e.target.files[i].webkitRelativePath && e.target.files[i].webkitRelativePath != '' ? e.target.files[i].webkitRelativePath : e.target.files[i].name;

                //Leave only the last folder in the path so that resources can be picked up appropriately by the reader (and ensure that references from e.g. CSS files such as img/image1.png still work).
                if(fileName.split('/').length > 2)
                    fileName = fileName.substring(fileName.lastIndexOf('/',fileName.lastIndexOf('/')-1)+1);
                else if(fileName.split('/').length > 1)
                    fileName = fileName.substring(fileName.lastIndexOf('/')+1);

                files.push({
                    id: 0,
                    name: fileName,
                    type: fileExt == 'js' ? 'JavaScript' : fileExt == 'css' ? 'CSS' : 'Unknown'
                });
                if(e.target.files[i].type.match('text*')){
                    readers[readers.length-1].readAsText(e.target.files[i]);
                }else{
                    readers[readers.length-1].readAsDataURL(e.target.files[i]);
                }
            }
        }
    });

    function save(){
        if(doneReading){
            for(var i = 0; i < files.length; i++){
                var fileContent = files[i].content;
                console.debug(fileContent);
                AGNOSTIC.Ajax.post('resource', {
                    name: files[i].name,
                    type: files[i].type,
                    content: fileContent,
                    objectName: 'resource',
                    id: files[i].id
                },i < (files.length-1) ? function(){} : function(){
                    AGNOSTIC.PageLoader.render('resources.html');
                });
            }
        }else{
            alert('File(s) not loaded yet. Try again.');
        }
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

    if(window.navigator.userAgent.indexOf('Chrome') < 0){
        $('#browseFolder').attr('disabled','disabled').after('<br/><span>The folder upload feature is only available on Chrome.</span>');
    }
});