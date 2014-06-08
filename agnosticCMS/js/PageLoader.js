String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};
(function(AGNOSTIC, undefined){
    (function(Template){

        Template.loadXMLDoc = function(url, callback){
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.onload = function () {
                callback(content);
                document.getElementsByTagName("head")[0].removeChild(script);
            };
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
            /*
            var xmlhttp=new XMLHttpRequest();
            xmlhttp.onreadystatechange=function(){
                if (xmlhttp.readyState==4 && xmlhttp.status==200){
                    callback(xmlhttp.responseText);
                }
            }
            xmlhttp.open("GET",url,false);
            xmlhttp.send();
            */
        }

        Template.render = function(){

            var html ='',
                path = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
            Template.loadXMLDoc('template/top.html',function(r){
                html += r;
                Template.loadXMLDoc(path,function(r){
                    html += (r.replace('<script type="text/javascript" src="js/PageLoader.js"></script>',''));
                    Template.loadXMLDoc('template/bottom.html',function(r){
                        html += r;
                        window.addEventListener('load',function(){
                            document.open();
                            document.write(html);
                            document.close();
                            document.addEventListener('DOMContentLoaded',function(){
                                var pageScript = document.createElement('script');
                                pageScript.setAttribute('type','text/javascript');
                                pageScript.setAttribute('src','js/pages/'+path.replace('html','js'));
                                document.getElementsByTagName("body")[0].appendChild(pageScript);
                                $('body').fadeIn();
                            });
                        },false);
                    });
                });
            });
        }

        Template.render();

    })(AGNOSTIC.Template = AGNOSTIC.Template || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});