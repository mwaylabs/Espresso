// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso {{e_Version}}
//
// Project: {{appName}}
// Validator: {{validatorName}}
// ==========================================================================

M.{{validatorName}} = M.Validator.extend({

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.{{validatorName}}',

    validate: function(obj) {
        if (validation_condition) {

          // case not valid
          
           this.validationErrors.push({
                msg: ' is not a valid',
                modelId: obj.modelId,
                property: obj.property,
                viewId: obj.viewId,
                validator: 'ValidatorName',
                onSuccess: obj.onSuccess,
                onError: obj.onError
           });
            return NO;
        }else{

           // case valid

             return YES;

        }

    }

});