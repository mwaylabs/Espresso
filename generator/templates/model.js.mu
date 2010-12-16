// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso {{e_Version}}
//
// Project: {{appName}}
// Model: {{modelName}}
// ==========================================================================

{{appName}}.{{modelName}} = M.Model.create({
    __name__: '{{modelName}}', // do not delete this property!

 // Sample model properties:

    firstName: M.Model.attr('String',{
        isRequired:YES
    }),

    lastName: M.Model.attr('String', {
        isRequired:YES
    }),

    zip: M.Model.attr('Integer', {
        isRequired:NO,
        validators: [M.NumberValidator]
    })

}, M.LocalStorageProvider);