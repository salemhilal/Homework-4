$(document).ready(function(){


    $.getJSON("http://api.feedzilla.com/v1/categories/26/articles.json", function(data){
        var articleTemplate = new Template("/templates/article");


        data.articles.forEach(function(c){
            articleTemplate.append(c, "#articles");
        });

        //ISOTOPE UP IN THIS B*TCH
        $("#articles").isotope({
            itemSelector : '.article',
            layoutMode : 'fitRows'
        });

        //
        showThatStuff();
    });


    function showThatStuff(){
        //DO NOTHING. For now.
    }

});
