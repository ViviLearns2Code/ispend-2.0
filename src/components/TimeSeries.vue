<template>
  <div class="timeseries">
    <h1>{{ title }}</h1>
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
    data: Array
  },
  mounted() {
    let width=this.width;
    let height=this.height;
    let colorDomain=this.colorDomain;
    let padLeft=this.padLeft;
    let padBottom=this.padBottom;
    let padTop=this.padTop;
    let padRight=this.padRight;
    let data=this.data;
    this.setLayout(width, height, colorDomain, padLeft, padBottom, padTop, padRight);
    this.createTimeseriesChart(data);
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
      // fire event in case other components subscribed
      this.timeseriesBroadcaster.fireSelectMonth(data);
    },
    createTimeseriesChart(data){
      let self = this;
      self.colors = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(self.colorDomain);
      let d3Svg = self.d3Svg = d3.select("#svg-timeseries");

      // tooltip div
      /*let _div = d3.select(self.parentNativeElement)
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);*/

      let gAxisX = d3Svg.append("g")
        .attr("class", "x-axis");
      let gAxisY = d3Svg.append("g");
      let gLines = d3Svg.append("g")
        .attr("class", "timeseries");

      let xScale = this.xScale = d3.scaleTime();
      let minX = d3.min(data, (d)=>{
          return d3.min(d.data, (cd)=>{
            return cd.x;
          }
        );
      });
      let maxX = d3.max(data, (d)=>{
        return d3.max(d.data, (cd)=>{
          return cd.x;
        });
      });   
      let minY = d3.min(data, (d)=>{
        return d3.min(d.data, (cd)=>{
          return cd.y;
        });
      });
      let maxY = d3.max(data, (d)=>{
        return d3.max(d.data, (cd)=>{
          return cd.y;
        });
      }); 
      xScale
        .domain([minX, maxX])
        .range([self.padLeft, self.width - self.padLeft - self.padRight]);

      let xAxis = this.xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%b-%y"))
        .ticks(12);
      
      let yScale = this.yScale = d3.scaleLinear();
      yScale
        .domain([maxY, minY])
        .range([self.padTop, self.height - self.padTop - self.padBottom]);
      let yAxis = this.yAxis = d3.axisLeft(yScale);

      let transformX = 
      `translate(0,${this.height-this.padBottom})`;
      gAxisX.call(xAxis)
        .attr("transform",transformX);
      d3Svg.selectAll(".x-axis .tick")
        .on("click", function(d) {
          self.selectMonth(d);
        }); 

      let transformY = `translate(${self.padLeft},${self.padTop})`;
      gAxisY.call(yAxis)
        .attr("transform",transformY);
      let lines = gLines.selectAll(".lines")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "lines");
      let lineGenerator = d3.line()
        .x((d)=>{
          return xScale(d.x);
        })
        .y((d)=>{
          return yScale(d.y);
        });
      let dataPointCollection = [];
      data.forEach((d,i)=>{
        let catName = d.text;
        lines.append("path")
        .datum(d.data)
        .attr("d", lineGenerator)
        .attr("stroke", self.colors(d.text))
        .attr("fill", "none");
        dataPointCollection = dataPointCollection.concat(d.data);
        let circles = lines.selectAll(".circle")
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
