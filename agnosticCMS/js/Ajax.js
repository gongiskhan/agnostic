(function(AGNOSTIC, undefined){
    (function(Ajax){

        var spinner = new Spinner({
            lines: 13, // The number of lines to draw
            length: 20, // The length of each line
            width: 10, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        }),
        spinnerEl = $('body').prepend('<div id="spinner"></div>').find('#spinner').get(0),
        spin = function(){
            $(spinnerEl).css({
                position: 'absolute',
                top: ($(window).height() / 2 + $('body').scrollTop())+'px',
                left: ($(window).width() / 2 + $('body').scrollLeft())+'px',
                display: 'block'
            });
            spinner.spin(spinnerEl);
        },
        stopSpinning = function(){
            spinner.stop();
            $(spinnerEl).hide();
        };

        Ajax.get = function(url, data, callback){
            spin();
            $.ajax({
                type: 'GET',
                url: window.contextPath + url,
                data: data,
                statusCode: {
                    0: function(){
                        $('#error').html('Unable to access webservice.').show();
                    }
                },
                complete:function(res){
                    if(res.status == 200 && res.responseText){
                        callback(JSON.parse(res.responseText));
                        var message = localStorage.getItem("AGNOSTIC_Message");
                        if(message){
                            $('#info').text(message).show();
                            localStorage.removeItem("AGNOSTIC_Message");
                        }
                    }else if(res.status == 200 || res.status == 204){
                        callback(res.responseText);
                    }else{
                        try{
                            $('#error').html(JSON.parse(res.responseText).error).show();
                        }catch(err){
                            var $dummy = $(document.createElement('div'));
                            $dummy.html(res.responseText);
                            $('#error').html($dummy.find('#pageContent').html()).show();
                            callback($dummy.find('#pageContent').html());
                        }
                        callback(res.statusCode);
                    }
                    stopSpinning();
                }
            });
        }

        Ajax.delete = function(url, id, callback){
            spin();
            $.ajax({
                type: 'DELETE',
                headers:{Authorization: 'Basic YWRtaW5AYWRtaW4uY29tOmFkbWlu'},
                url: window.contextPath + url + "?id="+id,
                complete:function(res){
                    if(res.status == 200){
                        if(callback)
                            callback(JSON.parse(res.responseText ||"{}"));
                        $('#info').html('Deleted: '+res.responseText).show();
                    }else{
                        try{
                            $('#error').html(JSON.parse(res.responseText).error).show();
                        }catch(err){
                            var $dummy = $(document.createElement('div'));
                            $dummy.html(res.responseText);
                            $('#error').html($dummy.find('#pageContent').html()).show();
                        }
                    }
                    stopSpinning();
                }
            });
        }

        Ajax.post = function(url, data, callback){
            spin();
            AGNOSTIC.CodeEditor.saveCursorPosition();
            $.ajax({
                type: 'POST',
                url: window.contextPath + url,
                headers:{Authorization: 'Basic YWRtaW5AYWRtaW4uY29tOmFkbWlu'},
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json',
                complete:function(res){
                    if(res.status == 200 || res.status == 201){
                        var r = res.responseText;
                        try {
                            r = JSON.parse(res.responseText);
                        }catch(err){}
                        if(callback){
                            callback(r);
                        }
                        else{
                            $('#info').html('Saved. '+res.responseText).show();
                        }
                    }
                    else{
                        try{
                            $('#error').html(JSON.parse(res.responseText).error).show();
                        }catch(err){
                            var $dummy = $(document.createElement('div'));
                            $dummy.html(res.responseText);
                            $('#error').html($dummy.find('#pageContent').html()).show();
                        }
                    }
                    stopSpinning();
                }
            });
        }

        Ajax.put = function(url, data, callback){
            spin();
            AGNOSTIC.CodeEditor.saveCursorPosition();
            $.ajax({
                type: 'PUT',
                url: window.contextPath + url,
                headers:{Authorization: 'Basic YWRtaW5AYWRtaW4uY29tOmFkbWlu'},
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json',
                complete:function(res){
                    if(res.status == 200 || res.status == 201){
                        var r = res.responseText;
                        try {
                            r = JSON.parse(res.responseText);
                        }catch(err){}
                        if(callback){
                            callback(r);
                        }
                        else{
                            $('#info').html('Saved. '+res.responseText).show();
                        }
                    }
                    else{
                        try{
                            $('#error').html(JSON.parse(res.responseText).error).show();
                        }catch(err){
                            var $dummy = $(document.createElement('div'));
                            $dummy.html(res.responseText);
                            $('#error').html($dummy.find('#pageContent').html()).show();
                        }
                    }
                    stopSpinning();
                }
            });
        }

    })(AGNOSTIC.Ajax = AGNOSTIC.Ajax || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});