<template>
  <div class="timeseries">
    <h1>{{ title }}</h1>
    <p v-if="datapoints.length==0">{{ placeholder }}</p>
    <svg id="svg-timeseries" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "Timeseries",
  props: {
    title: String,
    colorDomain: Array,
    width: Number,
    height: Number,
    padLeft: Number,
    padBottom: Number,
    padTop: Number,
    padRight: Number,
    datapoints: Array
  },
  data: function (){
    return {
      placeholder: "No data available"
    }
  },
  mounted() {
    var width=this.width;
    var height=this.height;
    var colorDomain=this.colorDomain;
    var padLeft=this.padLeft;
    var padBottom=this.padBottom;
    var padTop=this.padTop;
    var padRight=this.padRight;
    var datapoints=this.datapoints;
    this.setLayout(width, height, colorDomain, padLeft, padBottom, padTop, padRight);
    this.createTimeseriesChart(datapoints);
  },
  methods: {
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
    selectMonth(data){
      // fire event to parent so other components can update
      this.$emit("monthselect", data);
    },
    clear(){
      d3.selectAll("#svg-timeseries > *").remove()
    },
    createTimeseriesChart(data){
      var self = this;
      if(data.length == 0){
        return;
      }
      self.colors = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(self.colorDomain);
      var d3Svg = self.d3Svg = d3.select("#svg-timeseries");

      // tooltip div
      /*var _div = d3.select(self.parentNativeElement)
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);*/

      var gAxisX = d3Svg.append("g")
        .attr("class", "x-axis");
      var gAxisY = d3Svg.append("g");
      var gLines = d3Svg.append("g")
        .attr("class", "timeseries");

      var xScale = this.xScale = d3.scaleTime();
      var minX = d3.min(data, (d)=>{
          return d3.min(d.data, (cd)=>{
            return cd.x;
          }
        );
      });
      var maxX = d3.max(data, (d)=>{
        return d3.max(d.data, (cd)=>{
          return cd.x;
        });
      });
      var minY = d3.min(data, (d)=>{
        return d3.min(d.data, (cd)=>{
          return cd.y;
        });
      });
      var maxY = d3.max(data, (d)=>{
        return d3.max(d.data, (cd)=>{
          return cd.y;
        });
      });
      xScale
        .domain([minX, maxX])
        .range([self.padLeft, self.width - self.padLeft - self.padRight]);

      var xAxis = this.xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%b-%y"))
        .ticks(12);

      var yScale = this.yScale = d3.scaleLinear();
      yScale
        .domain([maxY, minY])
        .range([self.padTop, self.height - self.padTop - self.padBottom]);
      var yAxis = this.yAxis = d3.axisLeft(yScale);

      var transformX =
      `translate(0,${this.height-this.padBottom})`;
      gAxisX.call(xAxis)
        .attr("transform",transformX);
      d3Svg.selectAll(".x-axis .tick")
        .on("click", function(d) {
          self.selectMonth(d.explicitOriginalTarget.__data__);
        });
      d3Svg.selectAll(".x-axis .tick text")
          .attr("y", 0)
          .attr("x", 9)
          .attr("transform", "rotate(90)")
          .style("text-anchor", "start");

      var transformY = `translate(${self.padLeft},${self.padTop})`;
      gAxisY.call(yAxis)
        .attr("transform",transformY);
      var lines = gLines.selectAll(".lines")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "lines");
      var lineGenerator = d3.line()
        .x((d)=>{
          return xScale(d.x);
        })
        .y((d)=>{
          return yScale(d.y);
        });
      var dataPointCollection = [];
      data.forEach((d,i)=>{
        var catName = d.text;
        lines.append("path")
        .datum(d.data)
        .attr("d", lineGenerator)
        .attr("stroke", self.colors(d.text))
        .attr("fill", "none");
        dataPointCollection = dataPointCollection.concat(d.data);
        var circles = lines.selectAll(".circle")
          .data(dataPointCollection)
          .enter()
          .append("circle")
          .attr("class", "circle");
        circles
          .each((d)=>{ d._name = catName })
          .attr("cx", (d)=>{ return xScale(d.x); })
          .attr("cy", (d)=>{ return yScale(d.y); })
          .attr("fill", self.colors(d.text))
          .attr("r", "5px")
          .on("mouseover", function(d){
          })
          .on("mouseout", function(d){
          });
        circles
          .append("svg:title")
          .text(function(d,i){
            return `${d["_name"].toString()}: ${d.y.toString()}`;
          });
      });
    }
  }
}
</script>
