$(document).ready(function(){
    $("titleOverlay").fadeIn();

    $("#navigationMap").hide();
    //Vars
        var rssList = {
            "#usa":         ["http://fulltextrssfeed.com/www.nytimes.com/services/xml/rss/nyt/US.xml",
                             "http://fulltextrssfeed.com/pheedo.msnbc.msn.com/id/3032091/device/rss"],
            "#world":       ["http://fulltextrssfeed.com/www.nytimes.com/services/xml/rss/nyt/World.xml",
                             "http://rss.msnbc.msn.com/id/3032506/device/rss/rss.xml"],
            "#sports":      ["http://fulltextrssfeed.com/www.nytimes.com/services/xml/rss/nyt/Sports.xml",
                             "http://fulltextrssfeed.com/rss.nbcsports.msnbc.com/id/3032112/device/rss/rss.xml#__utma=238145375.1711211286.1349570710.1349570710.1349570710.1&__utmb=238145375.4.10.1349570710&__utmc=238145375&__utmx=-&__utmz=238145375.1349570710.1.1.utmcsr=nbcnews.com|utmccn=(referral)|utmcmd=referral|utmcct=/&__utmv=238145375.|8=Earned%20By=msnbc%7C=1^12=Landing%20Content=Mixed=1^13=Landing%20Hostname=www.msnbc.msn.com=1^30=Visit%20Type%20to%20Content=Internal%20to%20Mixed=1&__utmk=170102499"],
            "#business":    ["http://fulltextrssfeed.com/feeds.nytimes.com/nyt/rss/Business",
                             "http://fulltextrssfeed.com/rss.msnbc.msn.com/id/3032071/device/rss/rss.xml"],
            "#technology":  ["http://fulltextrssfeed.com/feeds.nytimes.com/nyt/rss/Technology",
                             "http://fulltextrssfeed.com/pheedo.msnbc.msn.com/id/3033117/device/rss/"]
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
        if (img != [] && img != null){
            return img[0]
        }
        else {return "";}
    }

    //Given some feed data and an isotope page, populate the page with the feed data.
    function processFeed(feed, isotope_page, callback){
        feed = feed.responseData.feed;
        var entries = feed.entries;
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
                    if(article.title.toLowerCase().indexOf("sponsored") === -1)
                        $(isotope_page).append($(newArticle));
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
            animationEngine : 'jQuery', 
            animationOptions: {
                duration: 750,
                easing: 'swing',
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

        //Looks like the data's all ready
        if(renderTime()){
            //Add article expanders
            $(".article").find("img").filter(function(){
                if($(this).height() < 150) 
                    return true;
                else 
                    return false;
            }).hide();

            $(".article").click(function(){
                $(".article").each(function(i,e){
                    $(e).find(".summary").slideDown(200); 
                    $(e).find(".content").slideUp(200);
                });

                $(this).find(".summary").slideUp(250); 
                $(this).find(".content").slideDown(300, reLayout);
    

                
            });

            pages.forEach(function(page){
                initIsotope(page);
                $(page).isotope('shuffle');
                setTimeout(function(){
                    $("#splashScreen, #splashCanvas").slideUp();
                    $("#titleOverlay").animate({"top": "-200px"}, "slow")
                    setTimeout(function(){
                        $("#navigationMap").slideDown();
                    },500)
                }, 2000);
            });
            clearTimeout(checkIfLoaded);
        }
    }, 100);


    function reLayout(){
        pages.forEach(function(page){
            $(page).isotope('reLayout');
        })
    }

    //Show Body
    $("body").css("display","block");

});