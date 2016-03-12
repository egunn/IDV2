//figure out why the plot div height has to be set to a hard (rather than percentage) value //in the CSS
//why can't mouse leave canvas during force minimization?

//set some margins and record width and height of window
var margin = {t:25,r:40,b:25,l:40};

var width = document.getElementById('plot1').clientWidth - margin.r - margin.l,  
    height = document.getElementById('plot1').clientHeight - margin.t - margin.b;

/*
//set up scales for plotting the data
var xScale = d3.scale.ordinal()
    .domain(d3.range(data.length))
    .rangeRoundPoints([margin.l, width]);

var yScale = d3.scale.linear()
    .domain([10,1])
    .range([0,100]);

var colorScale = d3.scale.linear()
    .domain([0, data.length])
    .range([0, 360]);
 */

//for now, not linked to actual data - later, set max according to numbers stored in data object. 
var radiusScale = d3.scale.sqrt().domain([0,20000]).range([10,50]);


//select the HTML plot element by id 
var canvas = d3.select(".plot");

//create force layout, give charge and gravity
var force = d3.layout.force()
    .size([width,height])
    .charge(-5)
    .gravity(0.01) //in absence of all forces, nodes should be fixed where they are. Can get rid of all forces, and implement own custom gravity


// Define the div for the tooltip
var div = d3.select(".plot").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

plot = canvas.append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//load twitter data, then call draw function.
//d3.json("./twitter_data2.json", function(error, data) {
d3.json("./TwitterDataApp_static.json", function(error, data) {
    
    //check that you can access data (this gives follower count for a specific user)
    //console.log(data.statuses[0].user.followers_count); // this is your data
    //console.log(data);
    drawUsers(data);
})

/*
//Test code to load JSON data directly from PHP/TwitterAPI. Works, but queries 1x/refresh.
//Replace with static data file for now.
d3.json("http://ericagunn.com/Twitter/TwitterDataApp.php",function(error,webTwitter){
  console.log(webTwitter)  
})
*/

function drawUsers(data) {
    
    twitterData=data;

    //console.log(twitterData);

/*
    for(i=0;i<twitterData.statuses.length;i++){ 
        var x=Math.random()*350;
        var y=Math.random()*350;
        var r=radiusScale(twitterData.statuses[0].user.followers_count);

        var newObj = {x:x, y:y, r:r}
        data.push(newObj)
    };*/

    //console.log(data);

    var circles = plot.selectAll('.circ')
        .data(twitterData)
        .enter()
        .append('g')
        .attr('class',"circ-group")
        .attr('transform', function (d) { 
            
                 xPos = Math.random()*width;
                 if(xPos>width-radiusScale(d.user.followers_count)){
                      xPos -= radiusScale(d.user.followers_count);
                 } 
                 else if(xPos< -radiusScale(d.user.followers_count)) {
                      xPos += radiusScale(d.user.followers_count);
                 }

                 //write xPos to the bound object for later use
                 d.x=xPos;
                 d.xPos = xPos;

//******************fix this later!!
                 d.retweets = d.retweet_count;
                 //console.log(d.retweets);
         
                yPos = Math.random()*height
                if(yPos>height-radiusScale(d.user.followers_count)){
                        yPos -= radiusScale(d.user.followers_count);
                } 
                else if(yPos< radiusScale(d.user.followers_count)) {
                        yPos += radiusScale(d.user.followers_count);
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
        
            d.r = 10;
            return 10})
        .style('fill', function(d){
            //use substring(0,x) to get first few letters of each tweet.
            //should be RT for retweet
            if (d.text.substring(0,2)== "RT"){
                var color = 'rgba(153, 255, 150,.6)'
                return color;
            }
            //should be @username for a reply or direct message
            else if (d.text.substring(0,1) == "@"){
                var color = 'rgba(153, 255, 230,.6)'
                return color;
            }
            //should be nothing for fresh tweet
            else {
                var color = 'rgba(153, 185, 230,.6)'
                return color;
            }
        
//**********add .@ (public reply so that anyone who follows you can see it, rather than just 
            //their boards)
        })
        .call(force.drag)
        //tooltip based on http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            //div	.html("@" + d.user.screen_name +  "<br/>"  +  d.user.followers_count)	
            div	.html(d.text +  "<br/>"  +  d.favorite_count)	
                .style("left", d.x  + "px")		
                .style("top", d.y+ "px");
                //.attr('transform','translate(30,300)');	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
//*******************
//want this to happen when the user drags, not clicks...
//or, even better, keep satellites and translate with circle group.
        .on("click", function(d){
            satellites = d3.selectAll('.satellites');
            satellites.remove();
        });
    
/*    
    //Turn off collision detection for now.
    
    //Collision detection
    //array into force layout, updates start to happen, updated accordingly
    //link nodes var to twitter data array
    force.nodes(twitterData)
        .on('tick',tick)
        .on('end',end)  
        .start();*/
    
    
    
    
    
    
    
    
    var satGroup = circles.append('g').attr('class','sat-group');
    var satNodes = [];
    
    /*
        labels = circles    
            .append('text')
            .attr('class','labels')
            .attr('x', function(d){return d.x})
            .attr('y',function(d){return 100})
            .attr("font-size","10px")
            .attr('fill','rgb(100,100,100)')
            .attr('text-anchor',"middle")
            .text(function(d){
                return "@" + d.user.screen_name + " " + d.user.followers_count;
        }); 

        labels.attr("x", function(d) { return d.x})
               .attr("y", function(d) { return d.y});*/
    
    
    //based on http://jsfiddle.net/nrabinowitz/5CfGG/
    //and http://bl.ocks.org/milroc/4254604
    circles.each(function(d,index){
                
            //create a satellites array with one entry for each retweet
            satellites = [];
        
            //don't think I should need this...keep for now, to clear out possible problems
            dataTree={};
            
            for (var i = 0; i<d.retweet_count; i++){
                //console.log(d.retweet_count);
                satellite = {parentX:d.x, parentY:d.y, retweets:d.retweet_count, parentR:d.r}
                satellites.push(satellite);
            }
            

            //console.log(d);
    
            //console.log(satellites);
        
            if(satellites.length>0){ 
            
                var dataTree = {
                     //parent: d[index],
                     //take the satellites array, and map each entry onto a function that returns
                     //the length of the array, so that each satellite child object knows how many
                     //siblings it has.
                     //console.log(satellites.length);
                     children: []
                     //children: function(d) {return {size: d.retweet_count};}
            };    
                
            for (var j=0; j<satellites.length;j++){
                //map satellite data to a tree
                dataTree.children.push({size: 100})

            }
                
            //object with the children array inside it. Children array is an array of child objects, 
            //each with a size attribute. (Matches example)
            //console.log(dataTree);
                             
            }
 
//**********dataTree is fine, and has different #s of children for each satellite object.
//**********not drawing properly; tree function seems to be identical for all iterations.
//**********May drawing a copy of everything for each circle - be careful of the circles.each!
//**********Don't think so, based on console output of the dataTree from above - only 82 items, //**********consistent with the correct # of tweets with retweets.
//**********Not clear if a node is a single node, or an entire set of nodes for a particular level... 
        
            tree = null;
        
            //if there is a dataTree for a circle, make a treemap layout 
            if(dataTree != {}){
               // console.log('here');
                // make a radial tree layout
                tree = d3.layout.tree()
                    //make a "strip" of satellite nodes of the right length, to wrap                                         //around the bubbles when ready. x controls length (360 for radial degrees.
                    //Changing value doesn't seem to matter here, as circumference is set by radius),
                    //y controls radial distance. Node size is set when circles are drawn, below.
                    .size([360, 15])//function(d){
                        //console.log(d.r);
                        //return [360, 20]})
                    .separation(function(a, b) {
                        //console.log(a);
                        //each node has a size value, which stores the number of nodes in the tree level
                        //also has parent Object, and depth = 1, and an x and y that depend on the
                        //treemap size set above. 
                        //Use a fixed separation for now - need to go back and write a radiusScale for 
                        //satellites, rather than using the one for the circles (too big, has min value).
                        return 20;//radiusScale(a.size) + radiusScale(b.size);
                        
                        //base on # of circles
                        //console.log(a);
                    });
                
                //console.log(tree);
                
                
                 // apply the layout to the data
                satNodes = tree.nodes(dataTree);
                //console.log(satNodes.slice(1));
    
                //console.log(satNodes);

                //drawSatellites(satNodes);
            
            }
            
                    
          

        //console.log(satNodes);

              
        //console.log(d);
        
        //console.log(satNodes);
                
//function drawSatellites(satNodes) {
     // create dom elements for the node, and place them at the center of the parent circle
                var satNode = satGroup.selectAll(".satNode")
                      .data(satNodes.slice(1)) // cut out the root node, we don't need it
                      .enter();
        
                satNode.append("g")
                      .attr("class", "node")
                      .attr("transform", function(d,i) {            
                          //d here is the child node group of the tree map.
                          //console.log(d.parent);        
                          //not quite sure how this works, but it wraps the tree nodes around a center.
                          //then, need to translate it to the appropriate radial distance.
                          return "rotate(" + (d.x - 90) + ") translate(" + d.y + ")";
                          //return "translate(" + d.x + "," + 
                             // d.y + ")";
                      });
                      

                satNode.append("circle")
                    .attr("r", 1)
                    .style("fill",'rgba(153, 155, 230, .9)'); 

                satGroup.attr('transform',function(d){ return 'translate(' + d.x + ',' + d.y + ')'})
        //}

//}

    }) //close .each            
              
/*                
                //set angle per step for satellites arranged around center circle
                var toAngle = d3.scale.linear().domain([0, d.retweet_count]).range([0, 360]);
//******************in the middle of debugging here. Code seems to be working fine, but some
//circles are consistently drawing in non-circular patterns. 
                //d.retweets
                //console.log(d.retweet_count);
                //console.log(d.retweets);
                //console.log(toAngle(6));
                
                d3.select(this).selectAll('.satellites')
                    .data(satellites)
                    .enter()
                    .append('circle')
                    .attr('class','satellites')
                    .attr('cx',function(d,i){
                        //for debugging only! remove later.
                         satellites[i].angle = toAngle(i);
                         satellites[i].sinCalc = d.parentX+((d.parentR+3)*Math.sin(toAngle(i)));
                         return d.parentX+((d.parentR+3)*Math.sin(toAngle(i)));})
                    .attr('cy',function(d,i){
                        satellites[i].cos = Math.cos(toAngle(i));
                        satellites[i].cosCalc = d.parentY+((d.parentR+3)*Math.cos(toAngle(i)));
                         return d.parentY+((d.parentR+3)*Math.cos(toAngle(i)));})
                    .attr('r',1)
                    .style('fill','rgba(153, 155, 230,.9)');
*/
                
/*            if(index ==61){
                console.log(satellites);
            }*/
        
             
    //})//cut out circles.each
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
        

  
}


function tick(e){
      //implement custom tick function.

        circleGroups = plot.selectAll('.circ-group');
       
        circles = plot.selectAll('.circ');
        circles.each(collide(.5));
    
        var newX = circles.attr('cx');
        var newY = circles.attr('cy');
        
        console.log(newX);
    
        circleGroups.attr('transform', 'translate(' + newX + ',' + newY + ')');
        
}


//******************
//This doesn't update once the force layout minimization has stopped - need to figure out 
//how to update nicely!!

function end(e) {

//}
}

//from http://bl.ocks.org/mbostock/1804919
function collide(alpha){
    var quadtree = d3.geom.quadtree(twitterData);
  return function(d) {
    var r = d.r + 20,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
      
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.r + quad.point.r + 20;
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

/*
function attachTooltip(selection){
    
        //returns plot div, with svg, groups, all circles and circle groups in it. 
        console.log(canvas.node());
    
        selection
        .on('mouseenter',function(d){
            var tooltip = d3.select('.custom-tooltip');
            tooltip
                .transition()
                .style('opacity',1);
                //tried making separate classes to set tooltip box color to match lines; something broke.
                /*.attr('class', function(){
                    if(d.key=='Coffee, green'){
                        return 'coffee-tooltip'
                    }
                    else if (d.key=='Tea'){
                        return 'tea-tooltip'
                    }
                });
                


        })
        .on('mousemove',function(d){
            var xy = d3.mouse(canvas.node());
            //console.log(xy);

            var tooltip = d3.select('.custom-tooltip');

            tooltip
                .style('left',xy[0]+50+'px')
                .style('top',(xy[1]+50)+'px')
                .html(d.value);

        })
        .on('mouseleave',function(){
            var tooltip = d3.select('.custom-tooltip')
                .transition()
                .style('opacity',0);
        })
}
   */ 