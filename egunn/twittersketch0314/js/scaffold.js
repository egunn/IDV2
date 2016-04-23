function drawWindow(data,data2,data3) {
    
    var twitterData=data;
    var twitterData2 = false;
    var twitterData3 = false;
    if (data2){
        twitterData2 = data2;
    }
    if (data3){
        twitterData3 = data3;
    }
     
    //console.log(singleUser);
    
    if (singleUser){
        
        //create 4 svgs following layout of sketch1
        
            //get size and other info from CSS - set classes appropriately
            //photo, name
            drawUserCanvas(data,userPlot);
        
            //input new user, compare users, and gravity buttons
            drawSidebarCanvas(data,sidebarPlot);
            
            //bubbles
            drawBubbles(data,plot1);
            
            //timeline
            drawTimeline(data,plot2);
    }
    
    
    
    else {
        
        //draw Users, force layouts, and timelines
        drawUserCanvas(data, userPlot1);
        bubbles(twitterData,plot1);
        drawTimeline(twitterData,timelinePlot1);
        
        if (twitterData2){
            drawUserCanvas(twitterData2, userPlot2);
            bubbles(twitterData2,plot2);
            drawTimeline(twitterData2,timelinePlot2);
        }
        if (twitterData3){
            drawUserCanvas(twitterData3, userPlot3);
            bubbles(twitterData3,plot3);
            drawTimeline(twitterData3,timelinePlot3);
        }
        
        
        
        
    }
    
}

function drawUserCanvas(twitterData,currentCanvas){

    if (singleUser) {
        //************************
        //User 
        //************************

        userData = currentCanvas.append('g').attr('class','user-data');
        photoWidth = 100;

        userData.append('rect')
            .attr('rx',5).attr('ry',5)
            .attr('x',0)//userWidth/2-photoWidth/2)
            .attr('y',10)
            .attr('width',photoWidth)
            .attr('height',photoWidth)
            .style('fill','lightgray');

        /*
        //Can't make sense of this, not sure it's worth the time. Come back later?
        //https://gist.github.com/mbostock/3468167
        var rect = userPlot.append("path")
            .attr("d", topLeftRoundedRect(0, 0, 50, 100, 5));
        // Returns path data for a rectangle with rounded right corners.
        // Note: it’s probably easier to use a <rect> element with rx and ry attributes!
        // The top-left corner is ⟨x,y⟩.
        function topLeftRoundedRect(x, y, width, height, radius) {
          //M = coord to begin path, h = horizontal line, a = arc (rx,ry,xrotation),    
          return "M" + 0 + "," + 200
               + "v" + -50
               + "a" + 30 + "," + 30 + " 90 1 0 " + 30 + "," + 20
               + "h" + 75
               + "v" + -100


               //+ "v" + (0)
               //+ "h" + (width/2);
               //+ "z";
        }*/

        userData.append("svg:image")
           .attr('x',5)//userWidth/2-photoWidth/2+5)
           .attr('y',15)
           .attr('width', 90)
           .attr('height', 90)
           .attr("xlink:href",twitterData[0].user.profile_image_url);


        userData.append('text')
            .style('text-anchor','middle')
            .attr('x',50)//userWidth/2)
            .attr('y',photoWidth/2+photoWidth)
            .style('font-size',14)
            .style('fill','gray')
            .text(twitterData[0].user.name);

        userData.append('text')
            .style('text-anchor','middle')
            .attr('x',50)//userWidth/2)
            .attr('y',photoWidth/2+photoWidth+13)
            .style('font-size',10)
            .style('fill','gray')
            .text('@'+twitterData[0].user.screen_name);


        userData.append('text')
            .style('text-anchor','middle')
            .attr('x',50)//userWidth/2)
            .attr('y',photoWidth/2+photoWidth+36)
            .style('font-size',10)
            .style('fill','gray')
            .text(twitterData[0].user.followers_count +' followers');
    }
    
    else {
    //************************
    //User 
    //************************
    
    userData1 = currentCanvas.append('g').attr('class','user-data');
    photoWidth = 100;
    
    userData1.append('rect')
        .attr('rx',5).attr('ry',5)
        .attr('x',userWidth/2-photoWidth/2)
        .attr('y',0)
        .attr('width',photoWidth)
        .attr('height',photoWidth)
        .style('fill','lightgray');
    
    userData1.append("svg:image")
       .attr('x',userWidth/2-photoWidth/2+5)
       .attr('y',5)
       .attr('width', 90)
       .attr('height', 90)
       .attr("xlink:href",twitterData[0].user.profile_image_url);
    
    userData1.append('text')
        .style('text-anchor','middle')
        .attr('x',userWidth/2)
        .attr('y',115)
        .style('font-size',14)
        .style('fill','gray')
        .text(twitterData[0].user.name);
    }
}

function drawSidebarCanvas(twitterData, currentCanvas){
        sidebarData = currentCanvas.append('g').attr('class','user-data');
    
    sidebarData.append('rect')
        .attr('rx',5).attr('ry',5)
        .attr('x',userWidth/2-65)
        .attr('y',20)
        .attr('width',130)
        .attr('height',20)
        .style('fill','rgba(95, 95, 95, .7)')
        .on('click', function(){mouseClickCategories(twitterData)});
    
    sidebarData.append('text')
        .style('text-anchor','middle')
        .attr('class','multi-toggle')
        .attr('x',userWidth/2)
        .attr('y',34)
        .style('font-size',12)
        .style('fill','white')
        .text('Separate Categories')
        .on('click', function(){mouseClickCategories(twitterData)});
    
    /*sidebarData.append('text')
        .style('text-anchor','left')
        .attr('x',userWidth/2-65)
        .attr('y',75)
        .style('font-size',14)
        .style('fill','gray')
        .text("New user:");
    
    sidebarData.append('rect')
        .attr('rx',5).attr('ry',5)
        .attr('x',userWidth/2-65)
        .attr('y',75+10)
        .attr('width',130)
        .attr('height',20)
        .style('fill','rgba(95, 95, 95, .7)');
    
    sidebarData.append('text')
        .style('text-anchor','middle')
        .attr('x',userWidth/2-55)
        .attr('y',75+23)
        .style('font-size',8)
        .style('fill','white')
        .text('|');
        
    sidebarData.append('text')
        .style('text-anchor','left')
        .attr('x',userWidth/2-65)
        .attr('y',150-10)
        .style('font-size',14)
        .style('fill','gray')
        .text("or:");*/
    /*
    sidebarData.append('rect')
        .attr('rx',5).attr('ry',5)
        .attr('x',userWidth/2-65)
        .attr('y',150)
        .attr('width',130)
        .attr('height',20)
        .style('fill','rgba(95, 95, 95, .7)')
        .on('click', multUsers);
    
    sidebarData.append('text')
        .style('text-anchor','middle')
        .attr('x',userWidth/2)
        .attr('y',150+14)
        .style('font-size',12)
        .style('fill','white')
        .text('Compare users')
        .on('click', multUsers);
    */
    
    var inputName = undefined;
    
    //add a text input box, and save the input as a variable
    sidebarData.append("foreignObject")
        //.attr("width", '100px')
        //.attr("height", 40)
        .attr('transform', 'translate(' + (userWidth/2-94) + ',65)')  
        .append("xhtml:body") 
        .attr('class','input-box')
        .html("<form><input type=text id=\"check\" placeholder=\"  Enter a new user\" /></form>")
        //.attr('style','width:50px')
        .on("submit", function(){inputName = document.getElementById("check").value;
            reloadData(inputName);
        });
        
    //tell the text entry box not to reload the page when you hit "enter"
    $('.input-box')
        //.attr('style', 'width=50px')
        .submit(function(e){
            e.preventDefault();
            //do something
    });
    

        
    sidebarData.append("foreignObject")
        //.attr("width", '100px')
        //.attr("height", 150)
        //.attr('transform', 'translate(' + (userWidth/2-94) + ',65)')  
        .attr('transform','translate(' + (userWidth/2-65) + ',135)')
        //.append("xhtml:body") 
        //.attr('class','input-box')
        .html("<button id=\"popupButton\" onclick=\"div_show()\">Compare Users</button>")
        .attr('style','width:50px')
        .on("click", function() {
            console.log('div_show');
            //popupPressed();
            document.getElementById('popupWindowDiv').style.display = "block";
        });
        //.on("submit", function(){inputName = document.getElementById("popUser1").value;
        //    console.log(inputName);
        //});

    
            var docBody = d3.select('.body');
        
        docBody.append("foreignObject")
            //.attr("width", '100px')
            //.attr("height", 40)
            //.attr('transform', 'translate(' + (userWidth/2-94) + ',65)')  
            .append("xhtml:body") 
            .attr('class', 'popup-form')
            .html("<div id=\"popupWindowDiv\"> <div id=\"popupWindow\"> <form action=\"#\" id=\"form-popup\"  name=\"form\">                <h3 class = \"h3-input\" >Enter 3 users to compare</h3>  <input class = \"popup-input\" id=\"popupUser1\" name=\"name\" placeholder=\"Name\" type=\"text\">     <input class = \"popup-input\" id=\"popupUser2\" name=\"name\" placeholder=\"Name\" type=\"text\">         <input class = \"popup-input\" id=\"popupUser3\" name=\"name\" placeholder=\"Name\" type=\"text\">       <input id=\"submitForm\" class=\"submitForm\" type=\"submit\" />  <a href=\"javascript:%20div_hide()\" id=\"close\">Close</a></form>     </div>      </div>");     

                  //<a href=\"javascript:%20check_empty()\" id=\"submitForm\">Send</a>    </form>     </div>      </div>");
                  //method=\"POST\" action=\"passToPHP.php\" 

      /*  formSubmit = d3.selectAll("#submitForm")    
            .on("submit", function(){
                inputName = document.getElementById("popUser1").value;
                console.log(inputName);
            });*/


        //make an array to store names
        userInput = [null,null,null];

        var inputName1 = d3.select('#popupUser1').on('input', function(){
            userInput[0] = this.value;
        })

        var inputName2 = d3.select('#popupUser2').on('input', function(){
            userInput[1] = this.value;
        })

        var inputName3 = d3.select('#popupUser3').on('input', function(){
            userInput[2] = this.value;
        })
        
        $('#form-popup').submit(function () {
            console.log(packDataForPHP(userInput));
            
            //call the php page to save the data for sketch1b to load
            $.post('http://ericagunn.com/Twitter/sendToPHP.php', packDataForPHP(userInput), function(data, status){
        //alert("Data: " + data + "\nStatus: " + status);
    });
            //call function to hide the popup
            div_hide();
            multUsers(userInput);
            
            //prevent screen from refreshing by returning false
            return false;
        });

       
    
        
}

function drawBubbles(twitterData, currentCanvas){
    
     //legend
     var legend = currentCanvas.append('g').attr('class','legend');
    
     legend.append('circle')
        .attr('cx',-15).attr('cy',15).attr('r',5).style('fill','rgba(102, 0, 102,.6)').attr('class','legendCircle'); 
     legend.append('text').attr('class','legendLabel-retweet legendLabel')
        .attr('x',-5).attr('y',18).text("retweet");
    
     legend.append('circle')
        .attr('cx',-15).attr('cy',30).attr('r',5).style('fill','rgba(0, 179, 179,.6)').attr('class','legendCircle');
     legend.append('text').attr('class','legendLabel-reply legendLabel')
        .attr('x',-5).attr('y',33).text("@reply");
    
     legend.append('circle')
        .attr('cx',-15).attr('cy',45).attr('r',5).style('fill','rgba(255, 140, 26,.6)').attr('class','legendCircle');
     legend.append('text').attr('class','legendLabel-new legendLabel')
        .attr('x',-5).attr('y',48).text("new tweet");
    
     legend.append('circle')
        .attr('cx',-15).attr('cy',60).attr('r',2).style('fill','rgba(95, 95, 95, .7)').attr('class','legendCircle legendCircle-satellite');
     legend.append('text').attr('class','legendLabel-satellite legendLabel')
        .attr('x',-5).attr('y',63).text("# retweets");            

    var circleSize = 8;
    
    bubbles(twitterData,plot1);  
    
}

function drawTimeline(twitterData,currentCanvas){
    
    if(singleUser){
        
        timeline = currentCanvas.append('g').attr('class','timelines');

        var tweetInterval = twitterData[twitterData.length-1].parsedDate - twitterData[0].parsedDate;

        for(var i=0; i<4; i++){

            timeline.append('line')
                .attr('x1',65)
                .attr('y1',15+i*25)
                .attr('x2',width2)
                .attr('y2',15+i*25)
                .style('stroke','gray')
                .style('stroke-width',0.2);

            timeline.append('text')
                .style('text-anchor','left')
                .attr('x',0)
                .attr('y',15+i*25+3)
                .style('font-size',10)  
                .style('fill','gray')
                .text(function(d){
                    var d = new Date(i*tweetInterval/4+twitterData[0].parsedDate);
                    d = d.toString().substring(0,10);
                    return d;
                });

        }

        //set up time length scale (domain = input, range = output)
        //(May want to switch to built in time.scale later?)
        var timeScale1 = d3.scale.linear().domain([0,tweetInterval/4]).range([75,width2-40]);
        var timeScale2 = d3.scale.linear().domain([tweetInterval/4,tweetInterval/2]).range([75,width2-40]);
        var timeScale3 = d3.scale.linear().domain([tweetInterval/2,3*tweetInterval/4]).range([75,width2-40]);
        var timeScale4 = d3.scale.linear().domain([3*tweetInterval/4,tweetInterval]).range([75,width2-40]);

        //console.log(timeScale1(1450433707000));

        twitterData.forEach(function(d){

            var tweetDate = new Date(d.parsedDate);
            var shortDate = tweetDate.toString().substring(0,10);
            var time = tweetDate.toString().substring(16,25);
            d.shortDate = shortDate;
            d.time = time;

            caseValue = Math.floor((d.parsedDate - twitterData[0].parsedDate)/(tweetInterval/4));

            //console.log(Math.floor((twitterData[twitterData.length-1].parsedDate - twitterData[0].parsedDate)/(tweetInterval/4)));

            switch(caseValue){
                case 0: 
                    //console.log(timeScale1(d.parsedDate-twitterData[0].parsedDate));
                    d.xcoord = timeScale1(d.parsedDate-twitterData[0].parsedDate);
                    d.yaxis = 1;
                break;

                case 1: 
                    d.xcoord = timeScale2(d.parsedDate-twitterData[0].parsedDate);
                    d.yaxis = 2;
                break;

                case 2: 
                    d.xcoord = timeScale3(d.parsedDate-twitterData[0].parsedDate);
                    d.yaxis = 3;
                break;

                case 3: 
                    //console.log(timeScale4(twitterData[twitterData.length-1].parsedDate - twitterData[0].parsedDate));
                    d.xcoord = timeScale4(d.parsedDate-twitterData[0].parsedDate);
                    d.yaxis = 4;
                break;

                case 4: 
                    //console.log(timeScale4(twitterData[twitterData.length-1].parsedDate - twitterData[0].parsedDate));
                    d.xcoord = timeScale4(d.parsedDate-twitterData[0].parsedDate);
                    d.yaxis = 4;
                break;
            }

        });

        //console.log(twitterData);

        tweetCircGroup = currentCanvas.selectAll('circ')
            .append('g')
            .attr('class','circ-group');

        tweetCircGroup    
            .data(twitterData)
            .enter()
            .append('circle')
            .attr('cx',function(d){return d.xcoord})
            .attr('cy',function(d){return (15+(d.yaxis-1)*25)})
            .attr('r',5)
            .style('fill',function(d){return d.color + d.alpha +')'})
            .attr('id',function(d,i){return String('circle-' + i)})
            .on("mouseover", mouseHighlightTimeline)				
            .on("mouseout", noMouseHighlightTimeline)
            .on('click',timelineClick);
        

    }                                               
    else {
            /*for(var i=0; i<4; i++){

                
            timelinePlot1.append('line')
                .attr('x1',55)
                .attr('y1',15+i*25)
                .attr('x2',width2-30)
                .attr('y2',15+i*25)
                .style('stroke','gray')
                .style('stroke-width',0.2);

            timelinePlot1.append('text')
                .style('text-anchor','left')
                .attr('x',5)
                .attr('y',15+i*25+3)
                .style('font-size',10)  
                .style('fill','gray')
                .text('3/'+ (i +10)+ '/16');

            for (var j = 0; j < 10; j++){
                timelinePlot1.append('circle')
                    .attr('cx', Math.random()*(width2-125)+60)
                    .attr('cy', 15+i*25)
                    .attr('r',4)
                    .style('fill','rgba(153, 185, 230,.5')
            }*/
                
        
        
        timeline = currentCanvas.append('g').attr('class','timelines');

        var tweetInterval = twitterData[twitterData.length-1].parsedDate - twitterData[0].parsedDate;

        for(var i=0; i<4; i++){

            timeline.append('line')
                .attr('x1',65)
                .attr('y1',15+i*25)
                .attr('x2',width2)
                .attr('y2',15+i*25)
                .style('stroke','gray')
                .style('stroke-width',0.2);

            timeline.append('text')
                .style('text-anchor','left')
                .attr('x',0)
                .attr('y',15+i*25+3)
                .style('font-size',10)  
                .style('fill','gray')
                .text(function(d){
                    var d = new Date(i*tweetInterval/4+twitterData[0].parsedDate);
                    d = d.toString().substring(0,10);
                    return d;
                });

        }

        //set up time length scale (domain = input, range = output)
        //(May want to switch to built in time.scale later?)
        var timeScale1 = d3.scale.linear().domain([0,tweetInterval/4]).range([75,width2-40]);
        var timeScale2 = d3.scale.linear().domain([tweetInterval/4,tweetInterval/2]).range([75,width2-40]);
        var timeScale3 = d3.scale.linear().domain([tweetInterval/2,3*tweetInterval/4]).range([75,width2-40]);
        var timeScale4 = d3.scale.linear().domain([3*tweetInterval/4,tweetInterval]).range([75,width2-40]);

        //console.log(timeScale1(1450433707000));

        twitterData.forEach(function(d){

            var tweetDate = new Date(d.parsedDate);
            var shortDate = tweetDate.toString().substring(0,10);
            var time = tweetDate.toString().substring(16,25);
            d.shortDate = shortDate;
            d.time = time;

            caseValue = Math.floor((d.parsedDate - twitterData[0].parsedDate)/(tweetInterval/4));

            //console.log(Math.floor((twitterData[twitterData.length-1].parsedDate - twitterData[0].parsedDate)/(tweetInterval/4)));

            switch(caseValue){
                case 0: 
                    //console.log(timeScale1(d.parsedDate-twitterData[0].parsedDate));
                    d.xcoord = timeScale1(d.parsedDate-twitterData[0].parsedDate);
                    d.yaxis = 1;
                break;

                case 1: 
                    d.xcoord = timeScale2(d.parsedDate-twitterData[0].parsedDate);
                    d.yaxis = 2;
                break;

                case 2: 
                    d.xcoord = timeScale3(d.parsedDate-twitterData[0].parsedDate);
                    d.yaxis = 3;
                break;

                case 3: 
                    //console.log(timeScale4(twitterData[twitterData.length-1].parsedDate - twitterData[0].parsedDate));
                    d.xcoord = timeScale4(d.parsedDate-twitterData[0].parsedDate);
                    d.yaxis = 4;
                break;

                case 4: 
                    //console.log(timeScale4(twitterData[twitterData.length-1].parsedDate - twitterData[0].parsedDate));
                    d.xcoord = timeScale4(d.parsedDate-twitterData[0].parsedDate);
                    d.yaxis = 4;
                break;
            }

        });

        //console.log(twitterData);

        tweetCircGroup = currentCanvas.selectAll('circ')
            .append('g')
            .attr('class','circ-group');
//*******radius different!
        tweetCircGroup    
            .data(twitterData)
            .enter()
            .append('circle')
            .attr('cx',function(d){return d.xcoord})
            .attr('cy',function(d){return (15+(d.yaxis-1)*25)})
            .attr('r',4)
            .style('fill',function(d){return d.color + d.alpha +')'})
            .attr('id',function(d,i){return String('circle-' + i)})
            .on("mouseover", mouseHighlightTimeline)				
            .on("mouseout", noMouseHighlightTimeline)
            .on('click',timelineClick);    
                

        
        if (twitterData.legend == true){
            drawLegend();
        }
        
       // }
    }
    
}