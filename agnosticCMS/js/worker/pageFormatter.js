(function(){
    String.prototype.replaceAll = function(target, replacement) {
        return this.split(target).join(replacement);
    };
    self.addEventListener('message', function(e) {
        var data = e.data;
        switch (data.cmd) {
            case 'ping':
                self.postMessage({cmd:'pong'});
                break;
            case 'format':
                formatPage(data.template, data.view);
                break;
            case 'stop':
                self.close();
                break;
            default:
                self.postMessage('Unknown command: ' + JSON.stringify(e.data));
        };
    }, false);
    function formatPage(template, view){
        var page = template.content;
        page = page.replaceAll('$VIEW',view.name);

        self.postMessage({cmd:'formatted', page: page});
    }
})();
