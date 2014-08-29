(function(AGNOSTIC, undefined){
    (function(CodeEditor){

        var editor = null;

        CodeEditor.makeEditable = function(textAreaId, language, onChangeCallback, bigger){

            $('#'+textAreaId).css({
                height: bigger ? '40em' : '25em',
                width: '100%'
            });
            ace.require("ace/ext/language_tools");
            editor = ace.edit(textAreaId);
            editor.setOptions({enableBasicAutocompletion: true, enableSnippets: true});
            editor.setTheme("ace/theme/chrome");
            editor.getSession().setMode("ace/mode/"+language);
            editor.getSession().setTabSize(4);
            editor.getSession().on('change', function(e) {
                onChangeCallback(editor);
            });
            editor.setValue($('#'+textAreaId).val());
            onChangeCallback(editor);
            editor.getSelection().clearSelection();
            editor.focus();
            if(localStorage && localStorage.getItem('pmuiCurrentCursorPosition')){
                var pos = JSON.parse(localStorage.getItem('pmuiCurrentCursorPosition'));
                editor.getSelection().moveCursorTo(pos.row, pos.column, true);
                editor.getSession().setScrollTop(pos.row * 11);
                localStorage.setItem('pmuiCurrentCursorPosition',"");
            }
        }

        CodeEditor.changeLanguage = function(language){
            editor.getSession().setMode("ace/mode/"+language);
        }

        CodeEditor.saveCursorPosition = function(){
            if(editor && localStorage)
                localStorage.setItem('pmuiCurrentCursorPosition',JSON.stringify(editor.getSelection().getCursor()));
        }

    })(AGNOSTIC.CodeEditor = AGNOSTIC.CodeEditor || {});
})(window.AGNOSTIC = window.AGNOSTIC || {});
