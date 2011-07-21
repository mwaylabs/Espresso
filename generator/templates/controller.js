// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso {{e_Version}}
//
// Project: {{appName}}
// Controller: {{name}}
// ==========================================================================

{{appName}}.{{name}} = M.Controller.extend({

    /* sample controller property */
    myControllerProperty: '',

    /*
    * Sample function
    * To handle the first load of a page.
    */
    init: function(isFirstLoad) {
        if(isFirstLoad) {
            /* do something here, when page is loaded the first time. */
        }
        /* do something, for any other load. */
    },

    /*
    * Example function, which shows how to switch to another page
    * Function is triggered by setting target & action in a view.
    */
    switchToExamplePage: function() {
        /* switch to a page called 'examplePage' */
        this.switchToPage('examplePage');
    }

});
