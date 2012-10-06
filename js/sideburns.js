/*****************************************
 *     Handlebars object wrapper
 *     v 0.0.4
 *     Salem Hilal
 *****************************************/

    //TODO: Multiple templates in one file.

    //Ye olde constructor. 
    //  @path :     The path to your template. Should be a string, but you know. It's javascript. Go nuts. 
    //  @context:   If defined, gives template some context.
    //  @selector:  If defined, gives template a selector. If present with @path and @context, do an asynch render.
    //  @append:    If true, appends the template to the selector rather than replacing its content.
    //  @callback:  Optional call back function. Useful if you make an asynch render. 

    function Template(path, context, selector, append, callback){
        var current = this;
        if(context != null) this.context = context;
        if(selector != null) this.selector = selector;
        if(typeof path === "string"){
            if(context != null && selector != null){
                current.context = context;
                current.selector = selector;
                current.initAsync(path, function(temp){
                    if(append) 
                        temp.append(context, selector);
                    else    
                        temp.render(context, selector);
                    if(typeof callback === "function") 
                        callback(this);
                });
            }
            else{
                current.init(path);
                if(typeof callback === "function")
                    callback(this);
            }
        }
    };

        Template.prototype.source   = "";
        Template.prototype.template = null;
        Template.prototype.context  = {};
        Template.prototype.selector = null;

        //Initializes the template from a path
        Template.prototype.init = function(path){
            var current = this;
            $.ajax({
                url: path,
                cache: false,
                async: false,
                success: function(data){
                    current.source = data;
                    current.template = Handlebars.compile(current.source);
                }
            });
        }

        //Initializes the template from a path asynchronously. 
        //Passes the initialized Template object to the callback function.
        Template.prototype.initAsync = function(path, callback){
            var current = this;
            $.ajax({
                url: path,
                cache: false,
                async: true,
                success: function(data){
                    current.source = data;
                    current.template = Handlebars.compile(current.source);
                    callback(current);
                }
            });
        }

        //Returns a dom element. 
        Template.prototype.build = function(context){
            if(this.template == null)
                console.error("Can't render: Template is null.");
            else{
                if(context == null) context = this.context;
                else this.context = context;
                return this.template(context);
            }
        }

        //Renders the template in the first item selected by @selector
        Template.prototype.render = function(context, selector){
            if(this.template == null)
                console.error("Can't render: Template is null.");
            else{
                if(context == null) context = this.context;
                if(selector == null) selector = this.selector;

                $($(selector).first()).html(this.template(context));
                this.context = context;
                this.selector = selector;
            }
        }

        //Renders the template in all items that match @selector
        Template.prototype.renderAll = function(context, selector){
            if(this.template == null)
                console.error("Can't render: Template is null.")
            else{
                $(selector).html(this.template(context))
            }
        }

        //Appends the template in the first item selected by @selector
        Template.prototype.append = function(context, selector){
            if(this.template == null)
                console.error("Can't render: Template is null.")
            else{
                $($(selector)[0]).append(this.template(context))
            }
        }

        //Appends the template in all items that match @selector
        Template.prototype.appendAll = function(context, selector){
            if(this.template == null)
                console.error("Can't render: Template is null.")
            else{
                $(selector).append(this.template(context))
            }
        }

        //Takes a path, context, and selector, and does everything once. 
        //If append is true, appends instead of replaces.
        Template.prototype.oneOff = function(path, context, selector, append){
            var current = this;
            current.initAsync(path, function(temp){
                if(append) 
                    temp.append(context, selector);
                else    
                    temp.render(context, selector);
            });
        }