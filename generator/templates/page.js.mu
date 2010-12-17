// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso {{e_Version}}
//
// Project: {{appName}}
// Page: {{pageName}}
// ==========================================================================

{{appName}}.{{pageName}} = M.PageView.design({

	  /*
	   * uncomment the following lines, to use the onLoad function
	   * to trigger a function every time the page is rendered.
	   */
	   
	  /*
	  onLoad: {
      	target: ServerTest.MyController,
	 	action: 'init'
	  },
	  */

        childViews: 'header content',     

        header: M.ToolbarView.design({

            value: 'HEADER',

            anchorLocation: M.TOP

        }),

        content: M.ScrollView.design({

            childViews: 'label',

            label: M.LabelView.design({

                value: '{{pageName}}'

            })

        })

      /*
	   * uncomment this lines, to use a footer in this page.
	   * To see the footer add the footer to the child view
	   */

      /*
       ,footer: M.ToolbarView.design({
            value: 'FOOTER',
            anchorLocation: M.BOTTOM
       })
       */
})

