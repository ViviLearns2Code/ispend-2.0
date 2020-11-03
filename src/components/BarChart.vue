<template>
  <div class="barchart">
    <h1>{{ title }}</h1>
    <p v-if="datapoints.length==0">{{ placeholder }}</p>
    <svg id="svg-barchart" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "Barchart",
  props: {
    title: String,
    color: String,
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
    var color=this.color;
    var padLeft=this.padLeft;
    var padBottom=this.padBottom;
    var padTop=this.padTop;
    var padRight=this.padRight;
    var datapoints=this.datapoints;
    this.setLayout(width, height, color, padLeft, padBottom, padTop, padRight)
    this.createBarchart(datapoints);
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
    clear(){
      d3.selectAll(".graph").remove();
    },
    createBarchart(data){
      var self = this;
      if(data.length == 0){
        return;
      }
      var d3Svg = this.d3Svg = d3.select("#svg-barchart");
      var gGraph = d3Svg.append("g").attr("class", "graph");
      var gBar = gGraph.append("g")
        .attr("class", "barchart");
      var gAxisX = gGraph.append("g")
        .attr("class", "x-axis");
      var gAxisY = gGraph.append("g")
        .attr("class", "y-axis");

      var xScale = this.xScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d)=>{
          return d.val;
        })])
        .range([0, self.width - self.padLeft - self.padRight]);
      var yScale = this.yScale = d3.scaleBand()
        .domain(data.map((d)=>{
          return d.text;
        }))
        .rangeRound([0, self.height - self.padBottom - self.padTop])
        .padding(0.1);
      var xAxis = this.xAxis = d3.axisBottom(xScale);
      var yAxis = this.yAxis = d3.axisLeft(yScale);
      var transform =
      `translate(${this.padLeft},${this.height-this.padBottom})`;
      gAxisX.call(xAxis)
        .attr("transform",transform);
      transform = `translate(${this.padLeft},${this.padTop})`;
      gAxisY.call(yAxis)
        .attr("transform", transform);

      var _bars = gBar
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d,i){
          return self.padLeft;
        })
        .attr("y", function(d,i){
          return yScale(d.text)+self.padTop;
        })
        .attr("width", function(d,i){
          return xScale(d.val);
        })
        .attr("height", function(d,i){
          return yScale.bandwidth();
        })
        .attr("fill", self.color)
        // todo
        .text(function(d,i){
          return `${d.text} (${d.val.toString()})`;
        });
    },
    updateBarchart(data){
      var d3 = this.d3;
      var self = this;
      var d3Svg = this.d3Svg;
      if (!d3Svg || d3Svg.select(".graph").empty()){
        this.createBarchart(data);
        return;
      }
      // update scales, axis, bar
      var xAxis = this.xAxis;
      var yAxis = this.yAxis;
      var xScale = this.xScale;
      var yScale = this.yScale;

      xScale.domain([0, d3.max(data, (d)=>{
        return d.val;
      })]);
      yScale.domain(data.map((d)=>{
          return d.text;
        })
      );
      var gAxisX = d3Svg.select(".x-axis");
      var gAxisY = d3Svg.select(".y-axis");

      var t = d3Svg.transition().duration(750);
      gAxisX.transition(t).call(xAxis);
      gAxisY.transition(t).call(yAxis);
      var selection = d3Svg.select("g.barchart")
        .selectAll(".bar")
        .data(data);
      selection.transition(t)
          .attr("x", function(d,i){
            return self.padLeft;
          })
          .attr("y", function(d,i){
            return yScale(d.text)+self.padTop;
          })
          .attr("width", function(d,i){
            return xScale(d.val);
          })
          .attr("height", function(d,i){
            return yScale.bandwidth();
          });
      selection.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d,i){
          return self.padLeft;
        })
        .attr("y", function(d,i){
          return yScale(d.text)+self.padTop;
        })
        .attr("width", function(d,i){
          return xScale(d.val);
        })
        .attr("height", function(d,i){
          return yScale.bandwidth();
        })
        .attr("fill", self.color);
      selection.exit()
        .remove();
    }
  }
}
</script>
