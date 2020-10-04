<template>
  <div class="piechart">
    <h1>{{ title }}</h1>
    <svg id="svg-piechart" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "Piechart",
  props: {
    title: String,
    colorDomain: Array,
    width: Number,
    height: Number,
    padLeft: Number,
    padBottom: Number,
    padTop: Number,
    padRight: Number,
    data: Array
  },
  mounted(){
    var width=this.width;
    var height=this.height;
    var colorDomain=this.colorDomain;
    var padLeft=this.padLeft;
    var padBottom=this.padBottom;
    var padTop=this.padTop;
    var padRight=this.padRight;
    var data=this.data;
    this.setLayout(width, height, colorDomain, padLeft, padBottom, padTop, padRight);
    this.createPieChart(data);
  },
  methods: {
    clear(){
      d3.selectAll(".pie").remove();
    },
    setLayout(
      width,
      height,
      color,
      padLeft,
      padBottom,
      padTop,
      padRight
      ) {
      this.width = width;
      this.height = height;
      this.color = color;
      this.padLeft = padLeft;
      this.padBottom = padBottom;
      this.padTop = padTop;
      this.padRight = padRight;
    },
    setTitle(title){
      this.title = title;
    },
    selectSlice(data, index){
      // fire event in case other components subscribed
      this.pieBroadcaster.fireSelectSlice(data);
    },
    calcLine(pieArcDatum, arcGenerator, radius){
      // calculate the label line for a pie slice
      var linePoints = this.calcLabelPoint(
        arcGenerator.centroid(pieArcDatum),
        pieArcDatum.startAngle,
        pieArcDatum.endAngle,
        radius
      );
      var lineGenerator = d3.line()
        .x(function(d){ return d.x; })
        .y(function(d){ return d.y; });
      return lineGenerator(linePoints);
    },
    calcLabelPoint(centroid, startAngle, endAngle, radius){
      var x0;
      var y0;
      var x1;
      var y1;
      var x2;
      var y2;
      var midangle;
      var halfRadius;
      var labelRadius;
      var direction;

      x0 = centroid[0];
      y0 = centroid[1];

      midangle = startAngle + (startAngle + endAngle) / 2;
      halfRadius = radius / 2;

      labelRadius =  1.25 * radius;

      x1 = ( x0 / halfRadius ) * labelRadius;
      y1 = ( y0 / halfRadius ) * labelRadius;

      direction = midangle < Math.PI ? 1 : -1;
      x2 = x1 + ( radius / 4 ) * direction;
      y2 = y1;

      return [
        {
          x: centroid[0],
          y: centroid[1]
        },
        {
          x: x1,
          y: y1
        },
        {
          x: x2,
          y: y2
        }
      ]
    },
    // credit for arcTween: https://bl.ocks.org/mbostock/5682158
    key(d){
      // keys on which to perform the join
      return d["data"]["text"];
    },
    findNeighborArc(i, dataOld, dataNew, key) {
      var self = this;
      var d_preceding = self.findPreceding(i, dataOld, dataNew, key)
      var d_following = self.findFollowing(i, dataOld, dataNew, key)
      return d_preceding ? {startAngle: d_preceding.endAngle, endAngle: d_preceding.endAngle}
        : d_following ? {startAngle: d_following.startAngle, endAngle: d_following.startAngle}
        : null;
    },
    findPreceding(i, dataOld, dataNew, key){
        // Find the element in dataOld that joins the highest preceding element in dataNew.
      var m = dataOld.length;
      while (--i >= 0) {
        var k = key(dataNew[i]);
        for (var j = 0; j < m; j++) {
          if (key(dataOld[j]) === k) return dataOld[j];
        }
      }
    },
    findFollowing(i, dataOld, dataNew, key){
      // Find the element in dataOld that joins the lowest following element in dataNew.
      var n = dataNew.length;
      var m = dataOld.length;
      while (++i < n) {
        var k = key(dataNew[i]);
        for (var j = 0; j < m; j++) {
          if (key(dataOld[j]) === k) return dataOld[j];
        }
      }
    },
    createPieChart(data){
      // ease of notation
      var self = this;
      self.colors = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(self.colorDomain);
      var radius = this.outerRadius - this.innerRadius;
      this.midpointX = this.padding + (this.width-2*this.padding) / 2;
      this.midpointY = this.padding + (this.height - 2*this.padding) / 2;
      // svg tag
      var d3Svg = d3.select("#svg-piechart")
        .select("svg");

      self.pieGenerator = d3.pie()
        .value(function(d){ return d.val; });

      // pieArcDatum does not contain inner/outer radi -> set them manually
      self.arcGenerator = d3.arc()
        .innerRadius(this.innerRadius)
        .outerRadius(this.outerRadius);

      var transform = `translate(${this.midpointX},${this.midpointY})`;
      var gPie = d3Svg.append("g")
        .attr("class","pie")
        .attr("transform",transform);

      var slices = gPie
        .selectAll("slice")
        .data(self.pieGenerator(data), self.key)
        .enter()
        .append("g")
        .attr("class", "slice");
      var arcPaths = slices
        .append("path");
      arcPaths.append("svg:title")
        .text(function(d,i){
          return `${d.data.val.toString()}%`;
        });
      arcPaths
        .attr("class", "arc")
        .attr("fill", function(d,i) {
          return self.colors(d.data.text);
        })
        .each(function(d, i){
          // arrow function causes typescript to scope "this" to component instead of d3 object
          const {_data, _value, _index, ...dReduced} = d;
          var b = {...dReduced, innerRadius: self.innerRadius, outerRadius: self.outerRadius};
          this["_current"] = b; // instead of this._current tp prevent typescript error
        })
        .attr("d", self.arcGenerator)
        .on("click", function(d,i){
          self.selectSlice(d.data,i);
        })
        .transition()
          .duration(750)
          .attrTween("d", (d)=>{
            const {_data, _value, _index, ...dReduced} = d;
            var b = {...dReduced, innerRadius: self.innerRadius, outerRadius: self.outerRadius};
            var i = this.d3.interpolate({startAngle: 0, endAngle: 0}, b);
            return function(t) {
              return d3.arc()(i(t));
            };
          });
      slices
        .append("path")
        .attr("class", "label-line")
        .attr("d", function(d){
          return self.calcLine(d, self.arcGenerator, radius);
        });
      slices
        .append("text")
        .attr("class", "label-text")
        .attr("x", function(d){
          var labelLine = self.calcLabelPoint(
            self.arcGenerator.centroid(d),
            d.startAngle,
            d.endAngle,
            radius
          );
          var midangle = d.startAngle
          + (d.startAngle + d.endAngle) / 2;
          var direction = midangle < Math.PI ? 1 : -1;
          return labelLine[2].x + ( 1/4 * radius ) * direction;
        })
        .attr("y", function(d){
          var labelLine = self.calcLabelPoint(
            self.arcGenerator.centroid(d),
            d.startAngle,
            d.endAngle,
            radius
          );
          return labelLine[2].y;
        })
        .text(function(d){
          return d.data.text;
        })
        .attr("text-anchor", function(d){
          var midangle = d.startAngle
            + (d.startAngle + d.endAngle) / 2;
          return midangle < Math.PI ? "start" : "end";
        });
    },
    updatePie(data){
      var d3 = this.d3;
      var self = this;
      var d3Svg = this.d3Svg;
      var radius = this.outerRadius - this.innerRadius;
      if (!d3Svg || d3Svg.select(".pie").empty()){
        this.createPieChart(data);
        return;
      }

      // data binding
      var dataOld = d3Svg.select("g.pie")
        .selectAll(".slice")
        .data();
      var dataNew = self.pieGenerator(data);
      var selection = d3Svg.select("g.pie")
        .selectAll(".slice")
        .data(dataNew,(d)=>{
          // keys on which to perform the join
          return d["data"]["text"];
        });

      // update
      selection
        .select("path.arc")
        .each(function(d,i){
          /* it is necessary to put the object destructuring in a separate function
            because typescript complains about redeclaration when destructuring is done twice in the same block */
          var nb;
          var reducePieData = function(d){
            const {_data, _value, _index, ...dReduced} = d;
            return dReduced;
          }
          var dReduced = reducePieData(d);
          var b = {...dReduced, innerRadius: self.innerRadius, outerRadius: self.outerRadius};
          var neighbor = self.findNeighborArc(i, dataOld, dataNew, self.key);
          if(neighbor){
            var neighborReduced = reducePieData(neighbor);
            nb = {...neighborReduced, innerRadius: self.innerRadius, outerRadius: self.outerRadius};
          }
          this["_current"] = nb || b;
        })
        .transition()
        .duration(750)
          .attrTween("d",function(d){
            const {_data, _value, _index, ...dReduced} = d;
            var b = {...dReduced, innerRadius: self.innerRadius, outerRadius: self.outerRadius};
            var i = d3.interpolate(this["_current"], b);
            this["_current"] = i(0);
            return function(t) { return d3.arc()(i(t)); };
          });
      selection
        .select("path.label-line")
        .attr("d", (d)=>{
          return self.calcLine(d, self.arcGenerator, radius);
        });
      selection
        .select("text.label-text")
        .attr("x", function(d){
          var labelLine = self.calcLabelPoint(
            self.arcGenerator.centroid(d),
            d.startAngle,
            d.endAngle,
            radius
          );
          var midangle = d.startAngle
          + (d.startAngle + d.endAngle) / 2;
          var direction = midangle < Math.PI ? 1 : -1;
          return labelLine[2].x + ( 1/4 * radius ) * direction;
        })
        .attr("y", function(d){
          var labelLine = self.calcLabelPoint(
            self.arcGenerator.centroid(d),
            d.startAngle,
            d.endAngle,
            radius
          );
          return labelLine[2].y;
        })
        .text(function(d){
          return d.data.text;
        })
        .attr("text-anchor", function(d){
          var midangle = d.startAngle
            + (d.startAngle + d.endAngle) / 2;
          return midangle < Math.PI ? "start" : "end";
        });
      // enter
      var enter = selection.enter()
        .append("g")
        .attr("class", "slice");
      var arcPaths = enter
        .append("path")
        .attr("class", "arc");
      arcPaths.append("svg:title")
        .text(function(d,i){
          return `${d.data.val.toString()}%`;
        });
      arcPaths
        .attr("fill", function(d,i) {
          return self.colors(d.data.text);
        })
        .each(function(d, i){
          const {_data, _value, _index, ...dReduced} = d;
          var b = {...dReduced, innerRadius: self.innerRadius, outerRadius: self.outerRadius};
          this["_current"] = self.findNeighborArc(i, dataOld, dataNew, self.key) || b;
        })
        .on("click", function(d,i){
          self.selectSlice(d.data,i);
        })
        .transition()
          .duration(750)
          .attrTween("d",function(d){
            const {_data, _value, _index, ...dReduced} = d;
            var b = {...dReduced, innerRadius: self.innerRadius, outerRadius: self.outerRadius};
            var i = d3.interpolate(this["_current"], b);
            this["_current"] = i(0);
            return function(t) { return d3.arc()(i(t)); };
          });
      enter
        .append("path")
        .attr("class", "label-line")
        .attr("d", (d)=>{
          return self.calcLine(d, self.arcGenerator, radius);
        });
      enter
        .append("text")
        .attr("class", "label-text")
        .attr("x", function(d){
          var labelLine = self.calcLabelPoint(
            self.arcGenerator.centroid(d),
            d.startAngle,
            d.endAngle,
            radius
          );
          var midangle = d.startAngle
            + (d.startAngle + d.endAngle) / 2;
          var direction = midangle < Math.PI ? 1 : -1;
          return labelLine[2].x + ( 1/4 * radius ) * direction;
        })
        .attr("y", function(d){
          var labelLine = self.calcLabelPoint(
            self.arcGenerator.centroid(d),
            d.startAngle,
            d.endAngle,
            radius
          );
          return labelLine[2].y;
        })
        .text(function(d){
          return d.data.text;
        })
        .attr("text-anchor", function(d){
          var midangle = d.startAngle
            + (d.startAngle + d.endAngle) / 2;
          return midangle < Math.PI ? "start" : "end";
        });
      var _exit = selection.exit().remove();
    }
  }
}
</script>
