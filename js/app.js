$(document).ready(function(){

    //Vars
        var rssList = {
            "#usa":["http://fulltextrssfeed.com/www.nytimes.com/services/xml/rss/nyt/US.xml"],
            "#world":["http://fulltextrssfeed.com/www.nytimes.com/services/xml/rss/nyt/World.xml"],
            "#sports":["http://fulltextrssfeed.com/www.nytimes.com/services/xml/rss/nyt/Sports.xml"],
            "#business":["http://fulltextrssfeed.com/feeds.nytimes.com/nyt/rss/Business"],
            "#technology":["http://fulltextrssfeed.com/feeds.nytimes.com/nyt/rss/Technology"]
        };
        var pages = ["#usa", "#world", "#sports", "#business", "#technology"];
        var goodToGo = {
            "#usa":         false,
            "#world":       false,
            "#sports":      false,
            "#business":    false,
            "#technology":  false
        };
        
        //For filter 
        var typingTimer; 
        var doneTypingInterval = 500;    
        var currentPage = 0;
        var sideburnTemplate = null;




    //Initialize ascensor
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

    //Extracts images from the html.
    function extractImages(html){
        var regex = /<img[^>]*>/g; 
        var img = html.match(regex);
        if (img != []){
            return img[0]
        }
        else {return "";}
    }

    //Given some feed data and an isotope page, populate the page with the feed data.
    function processFeed(feed, isotope_page, callback){
        feed = feed.responseData.feed;
        var entries = feed.entries;
        console.log("feed");
        console.log(feed);
        var articles = new Array();
        if(sideburnTemplate === null){
            sideburnTemplate = new Template("/templates/article", null, null, null, function(template){
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
                    $(isotope_page).append($(newArticle))/*.isotope("insert", $(newArticle), callback())*/;
                }
                callback();

            }); 
        } else{
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
                    var newArticle = sideburnTemplate.build(article);
                    $(isotope_page).append($(newArticle))/*.isotope("insert", $(newArticle), callback())*/;
            }
            callback();

        }
    }

    function initIsotope(page){
        $(page).isotope({
            itemSelector :'.article',
            layoutMode : 'masonry',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        }, function( $items ) {
          var id = this.attr('id'),
              len = $items.length;
          console.log( 'Isotope has filtered for ' + len + ' items in #' + id );
        });
    }


    //Given a page, a list of feeds, and an index, fill the page with data from the ith feed.
    function makeTheCalls(page, feeds, i){
        if(i === feeds.length) goodToGo[page] = true;
        else{
            $.ajax({
                url:        "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=" + encodeURIComponent(feeds[i]),
                dataType:   "json",
                success: function(data){
                    console.log("The data from " + feeds[i] + ":");
                    console.log(data);
                    //Populate isotope here
                    processFeed(data, page, function(){
                        makeTheCalls(page, feeds, (i+1));    
                    });
                }
            });
        }
    }

    //TODO: Replace this with URL parsing
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

    //Initialize each isotope
    pages.forEach(function(page){
        makeTheCalls(page, rssList[page], 0);
    });

    var checkIfLoaded = setInterval(function(){
        function renderTime(){
            for(page in goodToGo){
                if(goodToGo[page] === false) return false;
            }
            return true;
        }

        if(renderTime()){
            pages.forEach(function(page){
                initIsotope(page);
            });
        }
    }, 100);


    //Show Body
    $("body").css("display","block");

});