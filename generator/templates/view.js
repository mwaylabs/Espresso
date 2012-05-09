// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso {{e_Version}}
//
// Project: {{appName}}
// View: {{name}}
// ==========================================================================

{{appName}}.{{name}} = M.PageView.design({

    /* Use the 'events' property to bind events like 'pageshow' */
    events: {
        pageshow: {
            target: {{appName}}.MyController,
            action: 'init'
        }
    },
    
    cssClass: '{{name}}',

    childViews: 'header content footer',

    header: M.ToolbarView.design({
        value: 'HEADER',
        anchorLocation: M.TOP
    }),

    content: M.ScrollView.design({
        childViews: 'label',
        label: M.LabelView.design({
            value: '{{name}}'
        })
    }),

    footer: M.ToolbarView.design({
        value: 'FOOTER',
        anchorLocation: M.BOTTOM
    })

});

