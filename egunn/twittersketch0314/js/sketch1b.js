//set some margins and record width and height of window
var margin = {t:25,r:10,b:25,l:10};

var userWidth = document.getElementById('user1').clientWidth - margin.r - margin.l,  
    userHeight = document.getElementById('user1').clientHeight - margin.t - margin.b;

var width1 = document.getElementById('plot1').clientWidth - margin.r - margin.l,  
    height1 = document.getElementById('plot1').clientHeight - margin.t - margin.b;

var width2 = document.getElementById('timeline1').clientWidth - margin.r - margin.l,  
    height2 = document.getElementById('timeline1').clientHeight - margin.t - margin.b;


var multiGravityOn = false;
var circleSize = 4;
var singleUser = false;
//var twitterData = null;
//var inputName = ['MichaelPollan', 'engunneer', 'thisissethsblog'];
var circle1 = null;
var circle2 = null;
var circle3 = null;


//select the HTML plot element by class
var userCanvas1 = d3.select("#user1");

//select the HTML plot element by class
var timelineCanvas1 = d3.select("#timeline1");

//select the HTML plot element by class
var plotCanvas1 = d3.select("#plot1");


//select the HTML plot element by class
var userCanvas2 = d3.select("#user2");

//select the HTML plot element by class
var timelineCanvas2 = d3.select("#timeline2");

//select the HTML plot element by class
var plotCanvas2 = d3.select("#plot2");


//select the HTML plot element by class
var userCanvas3 = d3.select("#user3");

//select the HTML plot element by class
var timelineCanvas3 = d3.select("#timeline3");

//select the HTML plot element by class
var plotCanvas3 = d3.select("#plot3");

//create force layout, give charge and gravity
var force = d3.layout.force()
    .size([width1,height1])
    .charge(0)
    .gravity(0.001);


userPlot1 = userCanvas1.append('svg')
    .attr('width',userWidth+margin.r+margin.l)
    .attr('height',userHeight + margin.t + margin.b)
    .append('g')
    .attr('class','userCanvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//note: currently using userWidth and Height - if divs change ratio, will need to update!
timelinePlot1 = timelineCanvas1.append('svg')
    .attr('width',width2+margin.r+margin.l)
    .attr('height',height2 + margin.t + margin.b)
    .append('g')
    .attr('class','timelineCanvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

plot1 = plotCanvas1.append('svg')
    .attr('width',width1+margin.r+margin.l)
    .attr('height',height1 + margin.t + margin.b)
    .append('g')
    .attr('class','canvas1')
    .attr('transform','translate('+margin.l+','+margin.t+')');



userPlot2 = userCanvas2.append('svg')
    .attr('width',userWidth+margin.r+margin.l)
    .attr('height',userHeight + margin.t + margin.b)
    .append('g')
    .attr('class','userCanvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//note: currently using userWidth and Height - if divs change ratio, will need to update!
timelinePlot2 = timelineCanvas2.append('svg')
    .attr('width',width2+margin.r+margin.l)
    .attr('height',height2 + margin.t + margin.b)
    .append('g')
    .attr('class','timelineCanvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

plot2 = plotCanvas2.append('svg')
    .attr('width',width1+margin.r+margin.l)
    .attr('height',height1 + margin.t + margin.b)
    .append('g')
    .attr('class','canvas1')
    .attr('transform','translate('+margin.l+','+margin.t+')');




userPlot3 = userCanvas3.append('svg')
    .attr('width',userWidth+margin.r+margin.l)
    .attr('height',userHeight + margin.t + margin.b)
    .append('g')
    .attr('class','userCanvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//note: currently using userWidth and Height - if divs change ratio, will need to update!
timelinePlot3 = timelineCanvas3.append('svg')
    .attr('width',width2+margin.r+margin.l)
    .attr('height',height2 + margin.t + margin.b)
    .append('g')
    .attr('class','timelineCanvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

plot3 = plotCanvas3.append('svg')
    .attr('width',width1+margin.r+margin.l)
    .attr('height',height1 + margin.t + margin.b)
    .append('g')
    .attr('class','canvas1')
    .attr('transform','translate('+margin.l+','+margin.t+')');

var userInput = null;
//load http://ericagunn.com/Twitter/getUsersToCompare.json (via a php script!) to get the array of names

d3.json("http://ericagunn.com/Twitter/getFromPHP.php", function(error, fromPHP) {

    //ask the server for names input from user
    userInput = fromPHP;


//var userInput = ['@jonathanfields', '@engunneer', '@michaelpollan'];

//if the user has entered data, use it to query the Twitter API
if(userInput){
    /*
    if (inputName[0] == '@'){
                //console.log('@ included');
    }
    //add an @ symbol, if the user didn't
    else {
        inputName = '@' + inputName;
        //console.log(inputName);
    }*/
    
    var toLookup = userInput[0];
    if (userInput[1] != 'undefined'){
        var toLookup2 = userInput[1];
    }
    if (userInput[2] != 'undefined'){
        var toLookup3 = userInput[2];
    }
    
    queue()
        .defer(d3.json, 'http://ericagunn.com/Twitter/TwitterDataAppAnyUser.php?screen_name=' + toLookup + '&count=100')
        .defer(d3.json, 'http://ericagunn.com/Twitter/TwitterDataAppAnyUser.php?screen_name=' + toLookup2 + '&count=100')
        .defer(d3.json, 'http://ericagunn.com/Twitter/TwitterDataAppAnyUser.php?screen_name=' + toLookup3 + '&count=100')
        .await(function(err,data1, data2,data3) {
        
            var twitterData = parse(data1);
            var twitterData2 = parse(data2);
            var twitterData3 = parse(data3);

            //console.log("await");
            //call the draw function, pass it the loaded data
            drawWindow(twitterData, twitterData2,twitterData3);
    })
}
        

//if the user hasn't identified users to compare (should be impossible)
//in the final version), then load static data from folder.
else {
    queue()
        .defer(d3.json, "./SethGodin_0320_100timeline.json")
        .defer(d3.json, "./AlbertoCairo_0320_100timeline.json")
        .defer(d3.json, "./AmandaPalmer_0320_100timeline.json")
        .await(function(err,data1, data2,data3) {
            if (err){
                console.log('error in queue');
            }
        
            var twitterData = parse(data1);
            var twitterData2 = parse(data2);
            var twitterData3 = parse(data3);

            //console.log("await");
            //call the draw function, pass it the loaded data
            drawWindow(twitterData, twitterData2,twitterData3);

        });
    
}


})







function parse(data){
    
    if (data.error == 'Not authorized.'){
        return;
    }
    else {
        var parsedTweets = [];

        //converts Twitter date to Unix Epoch time (ms since Jan 1, 1970)
        //date is originally formatted in UTC time.
        data.forEach(function(d){
            var dateParse = Date.parse(d.created_at); 
            d.parsedDate = dateParse;
            parsedTweets.push(d);

        })


        var sortedTweets = parsedTweets.sort(function(tweetA,tweetB){
            //sorts in date order
            return tweetA.parsedDate - tweetB.parsedDate;
        })

        //drawUsers(sortedTweets);
        //drawWindow(sortedTweets);

        return(sortedTweets);
    }
}

/*

function drawUsers(data) {
    /*
    twitterData=data;
    
    console.log(data);
    console.log(singleUser);
    
    drawUserCanvas(data);
    

    bubbles(twitterData,plot1);
    bubbles(twitterData,plot2);
    bubbles(twitterData,plot3);
    
    
    drawTimeline(twitterData);
    
    
    
    userData2 = userPlot2.append('g').attr('class','user-data');
    photoWidth = 100;
    
    userData2.append('rect')
        .attr('rx',5).attr('ry',5)
        .attr('x',userWidth/2-photoWidth/2)
        .attr('y',0)
        .attr('width',photoWidth)
        .attr('height',photoWidth)
        .style('fill','lightgray');
    
    userData2.append("svg:image")
       .attr('x',userWidth/2-photoWidth/2+5)
       .attr('y',5)
       .attr('width', 90)
       .attr('height', 90)
       .attr("xlink:href",twitterData[0].user.profile_image_url);
    
    userData2.append('text')
        .style('text-anchor','middle')
        .attr('x',userWidth/2)
        .attr('y',115)
        .style('font-size',14)
        .style('fill','gray')
        .text(data[0].user.name);
    

    
        
     for(var i=0; i<4; i++){
        
        timelinePlot2.append('line')
            .attr('x1',55)
            .attr('y1',15+i*25)
            .attr('x2',width2-30)
            .attr('y2',15+i*25)
            .style('stroke','gray')
            .style('stroke-width',0.2);
        
        timelinePlot2.append('text')
            .style('text-anchor','left')
            .attr('x',5)
            .attr('y',15+i*25+3)
            .style('font-size',10)  
            .style('fill','gray')
            .text('3/'+ (i +10)+ '/16');
        
        for (var j = 0; j < 10; j++){
            timelinePlot2.append('circle')
                .attr('cx', Math.random()*(width2-125)+60)
                .attr('cy', 15+i*25)
                .attr('r',4)
                .style('fill','rgba(153, 185, 230,.5')
        }
     }
    
    
    
    userData3 = userPlot3.append('g').attr('class','user-data');
    photoWidth = 100;
    
    userData3.append('rect')
        .attr('rx',5).attr('ry',5)
        .attr('x',userWidth/2-photoWidth/2)
        .attr('y',0)
        .attr('width',photoWidth)
        .attr('height',photoWidth)
        .style('fill','lightgray');
    
    userData3.append("svg:image")
       .attr('x',userWidth/2-photoWidth/2+5)
       .attr('y',5)
       .attr('width', 90)
       .attr('height', 90)
       .attr("xlink:href",twitterData[0].user.profile_image_url);
    
    
    userData3.append('text')
        .style('text-anchor','middle')
        .attr('x',userWidth/2)
        .attr('y',115)
        .style('font-size',14)
        .style('fill','gray')
        .text(data[0].user.name);

    
     for(var i=0; i<4; i++){
        
        timelinePlot3.append('line')
            .attr('x1',55)
            .attr('y1',15+i*25)
            .attr('x2',width2-30)
            .attr('y2',15+i*25)
            .style('stroke','gray')
            .style('stroke-width',0.2);
        
        timelinePlot3.append('text')
            .style('text-anchor','left')
            .attr('x',5)
            .attr('y',15+i*25+3)
            .style('font-size',10)  
            .style('fill','gray')
            .text('3/'+ (i +10)+ '/16');
        
        for (var j = 0; j < 10; j++){
            timelinePlot3.append('circle')
                .attr('cx', Math.random()*(width2-125)+60)
                .attr('cy', 15+i*25)
                .attr('r',4)
                .style('fill','rgba(153, 185, 230,.5')
        }
     }
    
}*/

