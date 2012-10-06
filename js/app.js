$(document).ready(function(){

    //Vars
        var rss_list = {
            "#usa":{"nyt":"http://fulltextrssfeed.com/www.nytimes.com/services/xml/rss/nyt/US.xml"},

            "#world":{"nyt":"http://fulltextrssfeed.com/www.nytimes.com/services/xml/rss/nyt/World.xml"},

            "#sports":{"nyt":"http://fulltextrssfeed.com/www.nytimes.com/services/xml/rss/nyt/Sports.xml"},

            "#business":{"nyt":"http://fulltextrssfeed.com/feeds.nytimes.com/nyt/rss/Business"},

            "#technology":{"nyt":"http://fulltextrssfeed.com/feeds.nytimes.com/nyt/rss/Technology"}
        };
        var pages = ["#usa", "#world", "#sports", "#business", "#technology"];



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

    //Initialize each isotope
        //Make the appropriate rss call
            //Populate isotope

    //Show Body
    $("body").css("display","block");

});