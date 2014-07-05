String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};
(function(AGNOSTIC, undefined){
    (function(PageLoader){

        window.addEventListener('load',function(){
            if(AGNOSTIC.Util.getParam('loadPage')){
                PageLoader.render(AGNOSTIC.Util.getParam('loadPage')+'.html');
            }else{
                PageLoader.render('views.html');
            }
            function handleNewPage(e){
                e.preventDefault();
                e.stopPropagation();
                var target = $(e.target).prop('tagName') == 'A' ? e.target : e.target.parentNode;
                PageLoader.render($(target).attr('href'));
                return false;
            }
            setTimeout(function(){
                $('.sidebar-nav').on('click','a:not(".submenued")',handleNewPage);
                $('#pageContent').on('click','a.newEntityButton',handleNewPage);
                $('#pageContent').on('click','table.table a.editButton',handleNewPage);
            },1000);
        },false);

        PageLoader.topHtml = '';
        PageLoader.bottomHtml = '';

        PageLoader.loadXMLDoc = function(url, callback){

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.onload = function () {
                callback(window.cmsPageContent);
                document.getElementsByTagName("head")[0].removeChild(script);
            };
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        }

        PageLoader.render = function(path){
            $('.alert').fadeOut();
            if(path.indexOf('?') != -1){
                window.history.replaceState({}, document.title, (window.location.pathname+path.substring(path.indexOf('?'),path.length)));
                path = (path.substring(0,path.lastIndexOf('?')));
            }else{
                window.history.replaceState({}, document.title, (window.location.pathname));
            }
            PageLoader.loadXMLDoc(path,function(r){
                $('#pageContent').html(r);

                var currentScript = document.getElementById('pageScript');
                if(currentScript){
                    document.getElementsByTagName("body")[0].removeChild(currentScript);
                }

                var pageScript = document.createElement('script');
                pageScript.setAttribute('id','pageScript');
                pageScript.setAttribute('type','text/javascript');
                pageScript.setAttribute('src','js/pages/'+path.replace('html','js'));
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
            });
        }

    })(AGNOSTIC.PageLoader = AGNOSTIC.PageLoader || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});