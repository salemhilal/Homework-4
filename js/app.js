$(document).ready(function(){

    $.getJSON("http://api.feedzilla.com/v1/categories/26/articles.json", function(data){
        var articleTemplate = new Template("/templates/article");

        data.articles.forEach(function(c){
            articleTemplate.append(c, "#articles");
        })
    });

});
