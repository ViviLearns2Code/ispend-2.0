<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <bar-chart 
      title = "bar chart"
      color = "#7F7FFF"
      v-bind:data = "barChartData"
      v-bind:width = 300
      v-bind:height = 300
      v-bind:padLeft = 100
      v-bind:padBottom = 50
      v-bind:padTop = 10
      v-bind:padRight = 10></bar-chart>
    <timeseries 
      title = "timeseries"
      v-bind:colorDomain = "colorDomain"
      v-bind:data = "timeseriesData"
      v-bind:width = 300
      v-bind:height = 300
      v-bind:padLeft = 100
      v-bind:padBottom = 50
      v-bind:padTop = 10
      v-bind:padRight = 10></timeseries>
  </div>
</template>

<script>
import BarChart from '@/components/BarChart.vue'
import TimeSeries from '@/components/TimeSeries.vue'
export default {
  name: "Dashboard",
  components: {
    "bar-chart": BarChart,
    "timeseries": TimeSeries
  },
  data() {
    return {
      colorDomain: ["Hobbies", "Home", "Car", "Insurance", "Food", "Career"],
      timeseriesData: [{
          text: "hihi",
          data: [{x: new Date(2020,2,1), y: 1},{x: new Date(2020,3,1), y: 1}]
        },{
          text: "haha",
          data: [{x: new Date(2020,2,1), y: 2}, {x: new Date(2020,3,1), y: 1}]
      }],
      barChartData: [{
        text: "a",
        val: 1,
        data: "jjj"
      },{
        text: "b",
        val: 2,
        data: "jjj"
      }]
    }
  }
}
</script>
