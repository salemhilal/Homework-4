

$(document).ready(function(){

    // Base RSS feeds for each category
    var rss_list = {
        "#usa":{"nyt":"http://fulltextrssfeed.com/www.nytimes.com/services/xml/rss/nyt/US.xml"},

        "#world":{"nyt":"http://fulltextrssfeed.com/www.nytimes.com/services/xml/rss/nyt/World.xml"},

        "#sports":{"nyt":"http://fulltextrssfeed.com/www.nytimes.com/services/xml/rss/nyt/Sports.xml"},

        "#business":{"nyt":"http://fulltextrssfeed.com/feeds.nytimes.com/nyt/rss/Business"},

        "#technology":{"nyt":"http://fulltextrssfeed.com/feeds.nytimes.com/nyt/rss/Technology"}
    }


    var pages = ["#usa", "#world", "#sports", "#business", "#technology"];
    var currentPage = 0;

    // Returns an array of articles from a feed
    function processFeed(feed, isotope_page){
        var entries = feed.entries;
        var articles = new Array();
        var sideburnTemplate = new Template("/templates/article", null, null, null, function(template){
            for (var i = 0; i < feed.entries.length; i++){

                //Article Data
                var article = {
                    content:        feed.entries[i].content.replace(/(<([^>]+)>)/ig,""),
                    title:          parseTitle(feed.entries[i].title),
                    images:         extractImages(feed.entries[i].content),
                    isotope_tags:   extractKeywords(feed.entries[i].title),
                    author:         feed.entries.author, 
                    publish_date:   Date.parse(feed.entries[i].publishedDate),
                    date_string:    feed.entries[i].publishedDate,
                    summary:        feed.entries[i].contentSnippet.replace(/(<([^>]+)>)/ig,"")
                }
                var newArticle = template.build(article);
                console.log("Newly generated article to be added to " + isotope_page);
                console.log(newArticle);
                $(isotope_page).append($(newArticle)).isotope("insert", $(newArticle));
            }
        }); 
    }

    function initIsotope() {
        console.log('initializing isotope');
        console.log(pages);
        for (var i = 0; i < pages.length; i++){
            var page = pages[i];
            $(page).isotope({
                itemSelector :'.article',
                layoutMode : 'masonry'
            }, function(){
                console.log("Isotope callback");
                var feed_list = rss_list[page];
                


                //THIS IS PROBABLY WHERE IT NEEDS TO RECURSE, NOT LOOP. 
                //THIS IS PROBABLY WHERE IT NEEDS TO RECURSE, NOT LOOP. 
                //THIS IS PROBABLY WHERE IT NEEDS TO RECURSE, NOT LOOP. 
                //THIS IS PROBABLY WHERE IT NEEDS TO RECURSE, NOT LOOP. 
                //THIS IS PROBABLY WHERE IT NEEDS TO RECURSE, NOT LOOP. 
                //THIS IS PROBABLY WHERE IT NEEDS TO RECURSE, NOT LOOP. 
                //THIS IS PROBABLY WHERE IT NEEDS TO RECURSE, NOT LOOP. 
                //THIS IS PROBABLY WHERE IT NEEDS TO RECURSE, NOT LOOP. 
                //THIS IS PROBABLY WHERE IT NEEDS TO RECURSE, NOT LOOP. 


                for (var feed_name in feed_list) {
                    var rss_url = rss_list[page][feed_name];
                    console.log("rss_url");
                    console.log(rss_url);
                    addRSS(rss_url, processFeed, page);
                }
            }); 
        }
    }

    // Parses RSS given a url using a callback
    function addRSS(url, callback, isotope_page) {
        console.log(url);
      $.ajax({
        url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url),
        dataType: 'json',
        success: function(data) {
            console.log("The data:");
            console.log(data);
            callback(data.responseData.feed, isotope_page);
        }
      });
    }


    function populatePages(rss_list){
        
        for (var page in rss_list) {
            var feed_list = rss_list[page]
            for (var feed_name in feed_list) {
                var rss_url = rss_list[page][feed_name];
                addRSS(rss_url, processFeed, page);
            }
        }
    }

    // Removes special characters from title
    function parseTitle(title) {
        var words = title.replace(/ *\([^)]*\) */g, "").split(" ")
        var result = new Array();
        for (var i = 0; i < words.length ; i++){
            result.push(words[i].replace(/[^a-z0-9]/gi,''))
        }
        return result.join(" ");
    }

    // Returns a capitalized string of keywords, seperated by spaces
    function extractKeywords(string) {
        var words = string.split(" ")
        var result = new Array();
        for (var i = 0; i < words.length; i++){
            if (words[i].length > 3) {
                result.push(words[i].replace(/[^a-z0-9]/gi,''));
            }       
        }
        return result.join(" ").toUpperCase();
    };





    function extractImages(html){
        var regex = /<img[^>]*>/g; 
        var img = html.match(regex);
        if (img != []){
            return img[0]
        }
        else {return "";}
    }
    //populatePages(rss_list);
    

    // Simple pagetracker, for now, to make sure we're on the right page
    $(document).keydown(function(e){
        switch(e.which) {
            case 37: // left
                currentPage -= 1;
                $("#filtertext").val("");
            break;
            case 39: // right
                currentPage += 1;
                $("#filtertext").val("");
            break;
            default: return; // exit this handler for other keys
        }
        // e.preventDefault();
    });    

    var typingTimer; //timer identifier
    var doneTypingInterval = 500;

    $('#filtertext').keyup(function(){ typingTimer = setTimeout(doneTyping, doneTypingInterval);}); 
    $('#filtertext').keydown(function(){clearTimeout(typingTimer);});
        //user is done typing, filter the articles 
    function doneTyping () {
        var searchString = $("#filtertext").val().toUpperCase();
        if ($.trim(searchString) == ''){
            selector = "*";
        }
        else {
            var terms = searchString.split(" ");
            var selector = "." + terms[0];
            for (var i = 1; i < terms.length; i++){
                selector = selector + ", ." + terms[i].toUpperCase();      
            }
        }
        $(pages[currentPage]).isotope({filter: selector });
    }


    // Load up ascensor
    $('#ascensorBuilding').ascensor({
        AscensorName:'ascensor',
        ChildType:'section',
        AscensorFloorName:'Top Stories | World News | Sports | Business | Technology',
        Time:1000,
        WindowsOn:1,
        Direction:'x',
        Easing:'easeInOutCubic',
        KeyNavigation:true
    });
    initIsotope();
    $("body").css("display","block");

    
});




