String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};
(function(AGNOSTIC, undefined){
    (function(PageLoader){

        window.addEventListener('load',function(){
            PageLoader.render('views.html');
            setTimeout(function(){
                $('.sidebar-nav a:not(".submenued")').on('click',function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    PageLoader.render($(e.target).attr('href'));
                    return false;
                });
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
            PageLoader.loadXMLDoc(path,function(r){
                $('#pageContent').html(r);
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