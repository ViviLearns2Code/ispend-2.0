<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <timeseries
      ref = "timeseries"
      title = "timeseries"
      v-bind:colorDomain = "colorDomain"
      v-bind:data = "timeseriesData"
      v-bind:width = 500
      v-bind:height = 300
      v-bind:padLeft = 100
      v-bind:padBottom = 50
      v-bind:padTop = 10
      v-bind:padRight = 10
      v-on:monthselect="onMonthSelect($event)"></timeseries>
    <pie-chart
      ref = "piechart"
      title = "pie chart"
      v-bind:colorDomain = "colorDomain"
      v-bind:data = "pieChartData"
      v-bind:width = 500
      v-bind:height = 300
      v-bind:padLeft = 100
      v-bind:padBottom = 50
      v-bind:padTop = 10
      v-bind:padRight = 10
      v-on:monthselect="onSliceSelect($event)"></pie-chart>
    <bar-chart
      ref="barchart"
      title = "bar chart"
      color = "#7F7FFF"
      v-bind:data = "barChartData"
      v-bind:width = 300
      v-bind:height = 300
      v-bind:padLeft = 100
      v-bind:padBottom = 50
      v-bind:padTop = 10
      v-bind:padRight = 10></bar-chart>
  </div>
</template>

<script>
import BarChart from '@/components/BarChart.vue';
import PieChart from '@/components/PieChart.vue';
import TimeSeries from '@/components/TimeSeries.vue';
import axios from "axios";
import * as mapper from '../assets/js/DataMapper.js'

export default {
  name: "Dashboard",
  components: {
    "bar-chart": BarChart,
    "timeseries": TimeSeries,
    "pie-chart": PieChart
  },
  data() {
    return {
      colorDomain: ["Hobbies", "Home", "Car", "Insurance", "Food", "Career"],
      timeseriesData: [],/*[{
          text: "hihi",
          data: [{x: new Date(2020,2,1), y: 1},{x: new Date(2020,3,1), y: 1}]
        },{
          text: "haha",
          data: [{x: new Date(2020,2,1), y: 2}, {x: new Date(2020,3,1), y: 1}]
      }],*/
      pieChartData: [],
      barChartData: []/*[{
        text: "a",
        val: 1,
        data: "jjj"
      },{
        text: "b",
        val: 2,
        data: "jjj"
      }]*/
    }
  },
  methods: {
    load_history(){
      var vm = this;
      var now = new Date().toISOString();
      const request_hist = {
        params: {
          "to_date": now.substring(0,10),
          "months": 6
        },
        withCredentials: true
      };
      const request_monthstats = {
        params: {
          "to_date": now.substring(0,10),
          "top": 3
        },
        withCredentials: true
      };
      axios.get("http://localhost:8000/history", request_hist).then((resp)=>{
        vm.timeseriesData = mapper.conv2Lines(resp.data);
        vm.$refs.timeseries.clear();
        vm.$refs.timeseries.createTimeseriesChart(vm.timeseriesData);
      })
      axios.get("http://localhost:8000/monthstats", request_monthstats).then((resp)=>{
        vm.pieChartData = mapper.conv2Pie(resp.data);
        vm.$refs.piechart.clear();
        vm.$refs.piechart.createPieChart(vm.pieChartData);
      })
    },
    onMonthSelect(month) {
      console.log(month);
    }
  },
  mounted(){
    this.load_history();
  }
}
</script>
