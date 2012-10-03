
$(document).ready(function(){
    $.getJSON("http://api.feedzilla.com/v1/categories/26/articles.json", function(data){

        var articleTemplate = new Template("/templates/article");

        data.articles.forEach(function(c){
            articleTemplate.append(processArticle(c), "#articles");
        });

        //ISOTOPE UP IN THIS B*TCH
        $("#articles").isotope({
            itemSelector : '.article',
            layoutMode : 'masonry'
        });
    });


    // We take each article and parse the title to make it a suitable length
    // and retrieve the full-source of the article using cross server AJAX.
    // Then, we return a new article object containing data relavant to the display
    // of OUR site ^_^

    function processArticle(article){
        return {content:      article.summary, // ajax stuff, change this later
                title:        parseTitle(article.title),
                isotope_tags: extractKeywords(article.title),
                author:       article.author, 
                publish_date: Date.parse(article.publish_date),
                date_string: article.publish_date,
                summary:      article.summary,
                source:       article.source,
                source_url:   article.source_url }
    };
    // Given an article, we want to extract keywords
    function parseTitle(title) {
        var words = title.replace(/ *\([^)]*\) */g, "").split(" ")
        var result = new Array();
        for (var i = 0; i < words.length ; i++){
            result.push(words[i].replace(/[^a-z0-9]/gi,''))
        }
        return result.join(" ");
    }


    function extractKeywords(string) {
        var words = string.split(" ")
        var result = new Array();
        for (var i = 0; i < words.length; i++){
            result.push(words[i].replace(/[^a-z0-9]/gi,''))
        }
        return result.join(" ").toLowerCase();
    };

    var onlick = function filter() {
        
    };



});
