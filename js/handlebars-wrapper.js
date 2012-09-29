/*****************************************
 *     Handlebars object wrapper
 *     v 0.0.1
 *     Salem Hilal
 *****************************************/


    function Template(){};
        Template.prototype.source   = "";
        Template.prototype.template = null;

        //Initializes the template from a path
        Template.prototype.init = function(path){
            var current = this;
            $.ajax({
                url: path,
                cache: true,
                async: false,
                success: function(data){
                    current.source = data;
                    current.template = Handlebars.compile(current.source);
                }
            });
        }

        //Initializes the template from a path asynchronously. 
        //Passes the initialized Template object to the callback function.
        Template.prototype.init = function(path, callback){
            var current = this;
            $.ajax({
                url: path,
                cache: true,
                async: true,
                success: function(data){
                    current.source = data;
                    current.template = Handlebars.compile(current.source);
                    callback(current);
                }
            });
        }

        //Renders the template in the first item selected by @selector
        Template.prototype.render = function(context, selector){
            if(this.template == null)
                console.error("Can't render: Template is null.")
            else{
                $($(selector)[0]).html(this.template(context))
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