d3.slider = function module() {
    "use strict";

    var div, min = 0, max = 100, svg, svgGroup, value, classPrefix, axis, color,
    height=40, rect,
    //12
    rectHeight = 4,
    tickSize = 6,
    margin = {top: 10, right: 10, bottom: 10, left: 10}, 
    //margin = {top: 25, right: 25, bottom: 15, left: 25}, 
    ticks = 0, tickValues, scale, tickFormat, dragger, width,positionScale,
    range = false,
    callbackFn, stepValues, focus;

    function slider(selection) {
        selection.each(function() {
            //d3.classed => to add a class
            div = d3.select(this).classed('d3slider', true);
            width = 130
            //width = parseInt(div.style("width"), 10)-(margin.left + margin.right);
            //width == 898
            console.log(width)
            value = value || min; 
            //domain定义域,range值域
            scale = d3.scale.linear().domain([min,max]).range([0,width]).clamp(true);
            //定义色值比例尺
            color = d3.scale.linear().domain([min,50,max]).range(["#49c79b","#fca744",'#ef5b33']);
            //色值与坐标位置转换
            positionScale = d3.scale.linear().domain([0,width]).range([min,max]).clamp(true);
            // SVG 
            svg = div.append("svg")
            .attr("class", "d3slider-axis")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("rect")
            .attr("class", "d3slider-rect-range")
            .attr("width", width)
            .attr("height", rectHeight);

            var gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%")
            .attr("spreadMethod", "pad");

            gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#49c79b")
            .attr("stop-opacity", 1);

            gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#fca744")
            .attr("stop-opacity", 1);

            var gradient2 = svg.append("defs")
            .append("linearGradient")
            .attr("id", "gradient2")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%")
            .attr("spreadMethod", "pad");

            gradient2.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#fca744")
            .attr("stop-opacity", 1);

            gradient2.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#ef5b33")
            .attr("stop-opacity", 1);

            if (range) {
                svg.append("rect")
                .attr("class", "d3slider-rect-value")
                .attr("width", scale(value))
                .attr("height", rectHeight)
                .style('fill','url(#gradient)');

                svg.append("rect")
                .attr("class", "d3slider-rect-value-2")
                .attr("width", 130 - scale(value))
                .attr("height", rectHeight)
                .attr('x',65)
                .style('fill','url(#gradient2)');
            }
      
            var axis = d3.svg.axis().scale(scale).orient("bottom");
      
            if (ticks != 0) {
                axis.ticks(ticks);
                axis.tickSize(tickSize);
            } else if (tickValues) {
                axis.tickValues(tickValues);
                axis.tickSize(tickSize);
            } else {
                axis.ticks(0);
                axis.tickSize(0);
            }
            if (tickFormat) {
                axis.tickFormat(tickFormat);
            }
      
            svg.append("g")
               .attr("transform", "translate(0," + rectHeight + ")")
               .call(axis)

            var values = [value];
            dragger = svg.selectAll(".dragger")
                         .data(values)
                         .enter()
                         .append("g")
                         .attr("class", "dragger")
                         .attr("transform", function(d) {
                           return "translate(" + scale(d) + ")";
                         }) 
      
            var displayValue = null;
            if (tickFormat) { 
                displayValue = tickFormat(value);
            }else{
                displayValue = d3.format(",.0f")(value);
            }
          
            dragger.append("text")
                   .attr("x", 0)
                   .attr("y", -15)
                   .attr("text-anchor", "middle")
                   .attr("class", "draggertext")
                   .text(displayValue);

            dragger.append("circle")
                   .attr("class", "dragger-outer")
                   .attr("r", 10)
                   .attr("transform", function(d){
                        return "translate(0,6)";
                    });
                  
            dragger.append("circle")
                   .attr("class", "dragger-inner")
                   .attr("r", 4)
                   .attr("transform", function(d){
                        return "translate(0,6)";
                    });

            var dragBehaviour = d3.behavior.drag();
            dragBehaviour.on("drag", slider.drag);
            dragger.call(dragBehaviour);
      
            svg.on("click", slider.click);
        });
    }

    slider.click = function() {
        var pos = d3.event.offsetX || d3.event.layerX;
        slider.move(pos);
    };

    slider.drag = function() {
        var pos = d3.event.x;
        slider.move(pos+margin.left);
    };

    slider.move = function(pos) {
        var l,u;
        var newValue = scale.invert(pos - margin.left);

        var oldValue = value;
        value = newValue;
        var values = [value];

        // Move dragger
        svg.selectAll(".dragger").data(values)
           .attr("transform", function(d) {
                return "translate(" + scale(d) + ")";
            });
    
        var displayValue = null;
        if (tickFormat) { 
            displayValue = tickFormat(value);
        }else{
            displayValue = d3.format(",.0f")(value);
        }
        svg.selectAll(".dragger").select("text")
           .text(displayValue);
   
        if (range) { 
            svg.selectAll(".d3slider-rect-value")
               .attr("width",scale(value));
            svg.selectAll('.d3slider-rect-value-2')
               .attr('width',130 - scale(value))
               .attr('x',scale(value))
            console.log(color(positionScale(scale(value))))
        }

        if (callbackFn) {
            callbackFn(slider);
        }
    }

    slider.min = function(_) {
        if (!arguments.length) return min;
        min = _;
        return slider;
    };

    slider.max = function(_) {
        if (!arguments.length) return max;
        max = _;
        return slider;
    };

    slider.tickValues = function(_) {
        if (!arguments.length) return tickValues;
        tickValues = _;
        return slider;
    };
 
    slider.ticks = function(_) {
        if (!arguments.length) return ticks;
        ticks = _;
        return slider;
    };

    slider.value = function(_) {
        if (!arguments.length) return value;
        value = _;
        return slider;
    };
  
    slider.showRange = function(_) {
        if (!arguments.length) return range;
        range = _;
        return slider;
    }; 

    // slider.tickFormat = function(_) {
    //     if (!arguments.length) return tickFormat;
    //     tickFormat = _;
    //     return slider;
    // };

    // slider.classPrefix = function(_) {
    //     if (!arguments.length) return classPrefix;
    //     classPrefix = _;
    //     return slider;
    // };

    // slider.callback = function(_) {
    //     if (!arguments.length) return callbackFn;
    //     callbackFn = _;
    //     return slider;
    // };

    // slider.setValue = function(newValue) {
    //     var pos = scale(newValue) + margin.left;
    //     slider.move(pos);
    // };

    // slider.draggerTranslateFn = function() {
    //     return function(d) {
    //         return "translate(" + scale(d) + ")";
    //     };
    // };

    return slider;

};



