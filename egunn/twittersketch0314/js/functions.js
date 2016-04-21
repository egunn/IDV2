
function timelineClick(d) {

    var xShift = d.x+20;
    var yShift = d.y+20;
    
    div1.transition()		
        .duration(200)		
        .style("opacity", .8);		

    div1.html(d.text +  "<br/>"  + "<b>" + "Retweets: " + d.retweet_count +"</b>")	
        .style("left", xShift + "px")		
        .style("top", yShift + "px");
}

function tweetClick(d) {

    var xShift = d.xcoord+40;
    var yShift = 25+(d.yaxis-1)*25;
    div2.transition()		
        .duration(200)		
        .style("opacity", .8);		
    	
    div2.html(d.shortDate + "<br/>" + d.time)	
        .style("left", xShift + "px")		
        .style("top", yShift + "px");
}

function mouseHighlightTweet(d){
    
    var xShift = d.x+20;
    var yShift = d.y+20;
    
    div1.transition()		
        .duration(200)		
        .style("opacity", .8);		

    div1.html(d.text +  "<br/>"  + "<b>" + "Retweets: " + d.retweet_count +"</b>")	
        .style("left", xShift + "px")		
        .style("top", yShift + "px");


    var highlightedTweet = d3.select(this);
    
    highlightedTweet.style('fill', function(d){
       return d.color + '1)'})
    
    tweetId = highlightedTweet.attr('id');
    idConcat =  '#' + tweetId ;
    
    var circle = plot2.select(idConcat);
    
    circle.style('fill', function(d){
        return d.color + '1)'})
        .transition(100)
        .attr('r',20)
        .transition(100)
        .attr('r',10);

}

function noMouseHighlightTweet(d){
    div1.transition()		
        .duration(500)		
        .style("opacity", 0);
    
    div2.transition()		
        .duration(500)		
        .style("opacity", 0);	
    
    var highlightedTweet = d3.select(this);
    
    highlightedTweet.style('fill', function(d){return d.color + d.alpha + ')'})
    
    tweetId = highlightedTweet.attr('id');
    idConcat =  '#' + tweetId ;
    
    var circle = plot2.select(idConcat);
    
    circle
        .transition(5000)
        .delay(500)
        .style('fill', function(d){return d.color + d.alpha+ ')'})
        .attr('r',5);
        
    
	
    

}






function mouseHighlightTimeline(d){
    //console.log(d);
    var xShift = d.xcoord+40;
    var yShift = 25+(d.yaxis-1)*25;
    var circleSize = 8;
        
    div2.transition()		
        .duration(200)		
        .style("opacity", .8);		
    	
    div2.html(d.shortDate + "<br/>" + d.time)	
        .style("left", xShift + "px")		
        .style("top", yShift + "px");
        	
    
    var highlightedTime = d3.select(this);
    
    highlightedTime.style('fill', function(d){
       return d.color + '1)'})
    
    timelineId = highlightedTime.attr('id');
    idConcat =  '#' + timelineId ;
    
    var circle = d3.select(idConcat);
    
    circle.style('fill', function(d){
        return d.color + '1)'})
        .transition(100)
        .attr('r',15)
        .transition(100)
        .attr('r',circleSize);

}

function noMouseHighlightTimeline(d){
    div2.transition()		
        .duration(500)		
        .style("opacity", 0);	
    
    var highlightedTime = d3.select(this);
    
    highlightedTime.style('fill', function(d){return d.color + d.alpha + ')'})
    
    timelineId = highlightedTime.attr('id');
    idConcat =  '#' + timelineId ;
    
    var circle = d3.select(idConcat);
    
    circle
        .transition(5000)
        .delay(500)
        .style('fill', function(d){return d.color + d.alpha+ ')'});

}


function reloadData(inputName){
    
    console.log(singleUser);
    console.log(inputName);
    
    if (singleUser) {
        //console.log('reloadData ' + inputName);
            if (inputName[0] == '@'){
                //console.log('@ included');
            }
                //add an @ symbol, if the user didn't
                else {
                    inputName = '@' + inputName;
                    //console.log(inputName);
                }

                plot1.selectAll("*").remove();
                plot2.selectAll("*").remove();
                sidebarPlot.selectAll("*").remove();
                userPlot.selectAll("*").remove();
                tweetInterval = 0;

                //load this link to call data live from Twitter
                //http://ericagunn.com/Twitter/TwitterDataAppAnyUser.php?screen_name=engunneer&count=100
                d3.json('http://ericagunn.com/Twitter/TwitterDataAppAnyUser.php?screen_name=' + inputName + '&count=100', function(error, data){
                    parse(data);
                });
    }
    
    //doesn't like inputName[i].[0] - check back when inputName is an array of 3.
    else if (!singleUser) {
        for (var i = 0; i < inputName.length; i++){
            var str = inputName[i];
            if (str[0] == '@'){
                //console.log('@ included');
            }
            //add an @ symbol, if the user didn't
            else {
                toLookup = '@' + str;
                //console.log(inputName);
            }


            tweetInterval = 0;

            //load this link to call data live from Twitter
            //http://ericagunn.com/Twitter/TwitterDataAppAnyUser.php?screen_name=engunneer&count=100
            d3.json('http://ericagunn.com/Twitter/TwitterDataAppAnyUser.php?screen_name=' + toLookup + '&count=100', function(error, data){
                parse(data);
            });
        }
        
    }
    
}

function tick(e){
      //implement custom tick function.

        circleGroups = d3.selectAll('.circ-group');
       
        circles = plot1.selectAll('.circ');
        circles.each(collide(.15));
    
        if (!multiGravityOn){
            if(singleUser){
                circles.each(gravity(.01));//gravity(.01);
            }
            else {
                circles.each(gravity(.15));//gravity(.01);
            }
        }
    
        else if (multiGravityOn){
            circles.each(multiGravity(.01));//gravity(.01);
        }

    
        circleGroups.each(function(d,i){
            d3.select(this).attr('transform', 'translate(' + d.x + ',' + d.y + ')');
        })
        
        function gravity(k){  
            //console.log('singlesgrvity');

            //custom gravity: data points gravitate towards a straight line
            return function(d){
                d.y += (height1/2 - d.y)*k;
                d.x += (d.xPos*.5 + width1/4 - d.x)*k;//(d.xPos - d.x)*k;
            }
        }
            
        function multiGravity(k){
            //console.log('multigrvity');
            //custom gravity: data points gravitate towards a straight line
            return function(d){
                var focus = {};
                
                if (d.text.substring(0,2)== "RT"){
                    focus.x = width1/3 - width1/6;
                }
                //should be @username for a reply or direct message
                else if (d.text.substring(0,1) == "@"){
                    focus.x = width1/2;
                }
                //should be nothing for fresh tweet
                else {
                    focus.x = (2*width1)/3+width1/6;
                }

                //focus.x = (d.xPos < width/2)?(width/3-100):(width*2/3+100);
                focus.y = height1/2;

                d.y += (focus.y - d.y)*k;
                d.x += (focus.x - d.x)*k;
            }
        }

        
}

//from http://bl.ocks.org/mbostock/1804919
function collide(alpha){
    
  var quadtree = d3.geom.quadtree(twitterData);
  return function(d) {
    var r = d.r + 15,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
      
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y);
            if (singleUser) {
                r = d.r + quad.point.r + (circleSize*2+4);
            }
            else {
                r = d.r + quad.point.r + (circleSize*6);
            }
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= (l*.3);
          d.y -= y *= (l*.3);
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
          
}
