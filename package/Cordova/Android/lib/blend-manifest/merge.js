module.exports =
    function () {
        var override = true,
            dest = this,
            len = arguments.length,
            props, merge, i, from;

        if (typeof(arguments[arguments.length - 1]) === "boolean") {
            override = arguments[arguments.length - 1];
            len = arguments.length - 1;
        }

        for (i = 0; i < len; i++) {
            from = arguments[i];
            if (from != null) {
                Object.getOwnPropertyNames(from).forEach(function (name) {
                    var descriptor;

                    // nesting
                    if ((typeof(dest[name]) === "object" || typeof(dest[name]) === "undefined")
                        && typeof(from[name]) === "object") {

                        // ensure proper types (Array rsp Object)
                        if (typeof(dest[name]) === "undefined") {
                            dest[name] = Array.isArray(from[name]) ? [] : {};
                        }
                        if (override) {
                            if (!Array.isArray(dest[name]) && Array.isArray(from[name])) {
                                dest[name] = [];
                            }
                            else if (Array.isArray(dest[name]) && !Array.isArray(from[name])) {
                                dest[name] = {};
                            }
                        }
                        dest[name].merge(from[name], override);
                    }

                    // flat properties
                    else if ((name in dest && override) || !(name in dest)) {
                        descriptor = Object.getOwnPropertyDescriptor(from, name);
                        if (descriptor.configurable) {
                            Object.defineProperty(dest, name, descriptor);
                        }
                    }
                });
            }
        }
        return this;
    }
