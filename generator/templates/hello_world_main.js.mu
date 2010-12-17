// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso
//
// Project: {{appName}}
// ==========================================================================


{{appName}}.app = M.Application.design({

    page1: M.PageView.design({

        childViews: 'header content footer',

        header: M.ToolbarView.design({

            value: 'HEADER',

            anchorLocation: M.TOP

        }),

        content: M.ScrollView.design({

            childViews: 'label',

            label: M.LabelView.design({

                value: 'Welcome to The M-Project'

            })

        }),

        footer: M.ToolbarView.design({

            value: 'FOOTER',

            anchorLocation: M.BOTTOM

        })

    })

});