function bubbles(twitterData, plotHandle){
    
        var circles = plotHandle.selectAll('.circ')
        .data(twitterData)
        .enter()
        .append('g')
        .attr('class',"circ-group")
        .attr('id',function(d,i){return String('circle-' + i)})
        .attr('transform', function (d) { 
                
            xPos = Math.random()*width1;
            if(xPos>width1-circleSize){ 
                xPos -= circleSize;
            } 
            else if(xPos< -xPos>width1-circleSize) {
                xPos += xPos>width1-circleSize;
            }

            //write xPos to the bound object for later use
            d.x=xPos;
            d.xPos = xPos;
     
            yPos = Math.random()*height1
            if(yPos>height1-circleSize){
                yPos -= circleSize;
            } 
            else if(yPos< circleSize) {
                yPos += circleSize;
            }

            //write xPos to the bound object for later use
            d.y=yPos;
            d.yPos = yPos;
            
            return  'translate('+ xPos + ',' + yPos + ')'; 
        });
    
    circles
        .append('circle')
        .attr('class','circ')
        .attr('cx',0)
        .attr('cy',0)
        .attr('r', function(d){
            //turn off scaling of radii for now - working on single user timeline
            //d.r = radiusScale(d.user.followers_count);
            //return radiusScale(d.user.followers_count)})
            d.r = circleSize;
            return circleSize})
        .style('fill', function(d){
            //use substring(0,x) to get first few letters of each tweet.
            //should be RT for retweet
            if (d.text.substring(0,2)== "RT"){
                var color = 'rgba(102, 0, 102,' 
                var alpha = .5;
                d.alpha = alpha;
                d.color = color;
                return color + alpha+')';
            }
            //should be @username for a reply or direct message
            else if (d.text.substring(0,1) == "@"){
                var color = 'rgba(0, 179, 179,'
                var alpha = .5;
                d.alpha = alpha;
                d.color = color;
                return color + alpha+')';
            }
            //should be nothing for fresh tweet
            else {
                var color = 'rgba(255, 140, 26,'
                var alpha = .5;
                d.alpha = alpha;
                d.color = color;
                return color + alpha+')';
            }

        })
        .call(force.drag)
        //tooltip based on http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
    
    if (singleUser) {
        circles
            .on("mouseover", mouseHighlightTweet)					
            .on("mouseout", noMouseHighlightTweet)
            .on('click', tweetClick);
    }

    //console.log(plotHandle);
    
    
    var safety = 0;
    while(force.alpha() > 0.045) { // You'll want to try out different, "small" values for this
        force.tick();
        if(safety++ > 500) {
          break;// Avoids infinite looping in case this solution was a bad idea
    }
    }
    
    

    //Collision detection
    //array into force layout, updates start to happen, updated accordingly
    //link nodes var to twitter data array
    force.nodes(twitterData)
        .on('tick',function(e){ tick(e,twitterData,plotHandle);})
        .start();
    
    
    
    var satNodes = [];
    
    //append a group to the circles selection to hold satellites
    //var satGroup = circles.append('g').attr('class','sat-group');
    
    var numSats = null;

    //based on http://jsfiddle.net/nrabinowitz/5CfGG/
    //and http://bl.ocks.org/milroc/4254604
    circles.each(function(d,index){
         
            //select the current circle in the .each loop, append a group to it.
            var satGroup = d3.select(this).append('g').attr('class','sat-group');
        
            //create a blanks to fill
            satellites = [];
            dataTree={};
            
            for (var i = 0; i<d.retweet_count; i++){
                //console.log(d.retweet_count);
                numSats = d.retweet_count;
                
                satellite = {parentX:d.x, parentY:d.y, retweets:d.retweet_count, parentR:d.r}
                satellites.push(satellite);
            }
        
            if(satellites.length > 0){ 
            
                var dataTree = {
                     //take the satellites array, and map each entry onto a function that returns
                     //the length of the array, so that each satellite child object knows how many
                     //siblings it has.
                     children: []
            };    
                
            for (var j=0; j<satellites.length;j++){
                //map satellite data to a tree
                dataTree.children.push({size: satellites.length})

            }
                
            //object with the children array inside it. Children array is an array of child objects, 
            //each with a size attribute.
            //console.log(dataTree);
                             
            }
         
            tree = null;
        
            //if there is a dataTree for a circle, make a treemap layout 
            if(dataTree != {}){
                // make a radial tree layout
                tree = d3.layout.tree()
                    //x controls length (360 for radial degrees. y controls radial distance. 
                    //Node size is set when circles are drawn, below.
                    .size([360*4,circleSize]); //why won't this work with an anonymous function? returns NaN...
                    //.separation(function(a,b) {
                        //set ideal separation between satellites (doesn't do much, but have to have it,
                        //or node x,y position calculation returns NaN)
                    //    return 2;//radiusScale(a.size) + radiusScale(b.size);
                    //});
                
                
                //apply the layout to the data
                satNodes = tree.nodes(dataTree);

            }
            
      
                //create empty selection to append satellites into
                var satNode = satGroup.selectAll(".node");
        
                var nodes = satNode.data(satNodes.slice(1)) // cut out the root node, we don't need it
                      .enter()
                      .append("g")
                      .attr("class", "node")
                      .attr("transform", function(d,i) {                    
                          //draw the satellite nodes around the center and translate to the 
                          //appropriate radial distance.
                          //console.log(numSats);
                          
                          if (numSats<200){
                              return "rotate(" + (d.x) + ") translate(" + ((circleSize +circleSize/4) + (i*.05)) + ")";
                          }
                          else if (numSats<500){
                              return "rotate(" + (d.x*10) + ") translate(" + ((circleSize +circleSize/4) + (i*.05)) + ")";
                          }
                          else {
                              if(singleUser){
                                  return "rotate(" + (d.x*15*circleSize/2) + ") translate(" + ((circleSize +circleSize/4) + 
                                    (i*.01)) + ")";
                              }
                              else{
                                  return "rotate(" + (d.x*15*circleSize/4) + ") translate(" + ((circleSize +circleSize/4) + 
                                    (i*.01*circleSize/64)) + ")";
                              }
                          }

                      });
                      

                nodes.append("circle")
                    .attr("r", circleSize/12)
                    .style("fill",'rgba(95, 95, 95, .7)'); 


                
                
    }) //close .each  
    
    
    
}