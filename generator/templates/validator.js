// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso {{e_Version}}
//
// Project: {{appName}}
// Validator: {{name}}
// ==========================================================================

M.{{name}} = M.Validator.extend({

    /* The validator's name! */
    type: 'M.{{name}}',

    validate: function(obj) {
        if(validation_condition) {
            /* If the validation went wrong, push an error message! */
            this.validationErrors.push({
                msg: ' is not a valid',
                modelId: obj.modelId,
                property: obj.property,
                viewId: obj.viewId,
                validator: 'M.{{name}}',
                onSuccess: obj.onSuccess,
                onError: obj.onError
            });
            
            return NO;
        } else {
            /* If the validation went well, return YES! */
            return YES;
        }
    }
});
