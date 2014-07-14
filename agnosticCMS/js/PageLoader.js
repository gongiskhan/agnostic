String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};
(function(AGNOSTIC, undefined){
    (function(PageLoader){

        PageLoader.topHtml = '';
        PageLoader.bottomHtml = '';

        PageLoader.loadXMLDoc = function(url, callback){
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.onload = function () {
                document.getElementsByTagName("head")[0].removeChild(script);
                callback(window.cmsPageContent);
            };
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);

        }

        PageLoader.render = function(content){

            PageLoader.loadXMLDoc('template/top.html',function(r){
                PageLoader.topHtml = r;
                PageLoader.loadXMLDoc('template/bottom.html',function(r){
                    PageLoader.bottomHtml = r;
                    window.document.open();
                    window.document.write(PageLoader.topHtml + content + PageLoader.bottomHtml);
                    window.document.close();
                    setTimeout(function(){
                        var pageScript = document.createElement('script');
                        pageScript.setAttribute('id','pageScript');
                        pageScript.setAttribute('type','text/javascript');
                        var path =  window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1),
                            pageJSPath = path.replace('html','js');
                        pageScript.setAttribute('src','js/pages/'+pageJSPath);
                        $('#pageScript').remove();
                        document.getElementsByTagName("body")[0].appendChild(pageScript);
                        var currentPage = $('.sidebar-nav a[href="'+path+'"]');
                        if(currentPage.size() > 0 && !currentPage.hasClass('.nav-header')){
                            currentPage.parent().parent().removeClass('collapse');
                            currentPage.parent().parent().addClass('in');
                        }else{
                            $('.sidebar-nav a[href="index.html"]').parent().parent().removeClass('collapse');
                            $('.sidebar-nav a[href="index.html"]').parent().parent().addClass('in');
                        }
                    },500);
                });
            });
        };

    })(AGNOSTIC.PageLoader = AGNOSTIC.PageLoader || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});