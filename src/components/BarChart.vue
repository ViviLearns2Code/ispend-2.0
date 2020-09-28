<template>
  <div class="barchart">
    <h1>{{ title }}</h1>
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
    data: Array
  },
  mounted() {
    let width=this.width;
    let height=this.height;
    let color=this.color;
    let padLeft=this.padLeft;
    let padBottom=this.padBottom;
    let padTop=this.padTop;
    let padRight=this.padRight;
    let data=this.data;
    this.setLayout(width, height, color, padLeft, padBottom, padTop, padRight)
    this.createBarchart(data);
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
    removeBarChart(){
      if(this.d3Svg){
        this.d3Svg.selectAll(".graph").remove();
      }
    },
    createBarchart(data){
      let self = this;
      let d3Svg = this.d3Svg = d3.select("#svg-barchart");
      let gGraph = d3Svg.append("g").attr("class", "graph");
      let gBar = gGraph.append("g")
        .attr("class", "barchart");
      let gAxisX = gGraph.append("g")
        .attr("class", "x-axis");
      let gAxisY = gGraph.append("g")
        .attr("class", "y-axis");

      let xScale = this.xScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d)=>{
          return d.val;
        })])
        .range([0, self.width - self.padLeft - self.padRight]);
      let yScale = this.yScale = d3.scaleBand()
        .domain(data.map((d)=>{
          return d.text;
        }))
        .rangeRound([0, self.height - self.padBottom - self.padTop])
        .padding(0.1);
      let xAxis = this.xAxis = d3.axisBottom(xScale);
      let yAxis = this.yAxis = d3.axisLeft(yScale);
      let transform = 
      `translate(${this.padLeft},${this.height-this.padBottom})`;
      gAxisX.call(xAxis)
        .attr("transform",transform);
      transform = `translate(${this.padLeft},${this.padTop})`;
      gAxisY.call(yAxis)
        .attr("transform", transform);

      let _bars = gBar
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
      let d3 = this.d3;
      let self = this;
      let d3Svg = this.d3Svg;
      if (!d3Svg || d3Svg.select(".graph").empty()){
        this.createBarchart(data);
        return;
      }
      // update scales, axis, bar
      let xAxis = this.xAxis;
      let yAxis = this.yAxis;
      let xScale = this.xScale;
      let yScale = this.yScale;

      xScale.domain([0, d3.max(data, (d)=>{
        return d.val;
      })]);
      yScale.domain(data.map((d)=>{
          return d.text;
        })
      );
      let gAxisX = d3Svg.select(".x-axis");
      let gAxisY = d3Svg.select(".y-axis");

      let t = d3Svg.transition().duration(750);
      gAxisX.transition(t).call(xAxis);
      gAxisY.transition(t).call(yAxis);
      let selection = d3Svg.select("g.barchart")
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
