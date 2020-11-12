<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          <timeseries
            ref = "timeseries"
            title = "timeseries"
            v-bind:colorDomain = "colorDomain"
            v-bind:datapoints = "timeseriesData"
            v-bind:width = 500
            v-bind:height = 300
            v-bind:padLeft = 100
            v-bind:padBottom = 50
            v-bind:padTop = 10
            v-bind:padRight = 10
            v-on:monthselect="onMonthSelect($event)"></timeseries>
        </b-col>
      </b-row>
      <b-row id="drilldown">
        <b-col>
          <pie-chart
            ref = "piechart"
            title = "pie chart"
            v-bind:colorDomain = "colorDomain"
            v-bind:datapoints = "pieChartData"
            v-bind:width = 400
            v-bind:height = 400
            v-bind:innerRadius = 0
            v-bind:outerRadius = 80
            v-bind:padding = 0
            v-on:sliceselect="onSliceSelect($event)"></pie-chart>
        </b-col>
        <b-col>
          <bar-chart
            ref="barchart"
            title = "bar chart"
            color = "#7F7FFF"
            v-bind:datapoints = "barChartData"
            v-bind:width = 400
            v-bind:height = 400
            v-bind:padLeft = 100
            v-bind:padBottom = 50
            v-bind:padTop = 10
            v-bind:padRight = 10></bar-chart>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import BarChart from '@/components/BarChart.vue';
import PieChart from '@/components/PieChart.vue';
import TimeSeries from '@/components/TimeSeries.vue';
import * as request_handler from '../assets/js/RequestHandler.js';
import moment from "moment"
import * as mapper from '../assets/js/DataMapper.js';
import { BContainer, BRow, BCol } from 'bootstrap-vue';

export default {
  name: "Dashboard",
  components: {
    "bar-chart": BarChart,
    "timeseries": TimeSeries,
    "pie-chart": PieChart,
    "b-row": BRow,
    "b-col": BCol,
    "b-container": BContainer
  },
  data() {
    return {
      isLoading: false,
      colorDomain: ["Hobbies", "Home", "Car", "Insurance", "Food", "Career"],
      timeseriesData: [],
      pieChartData: [],
      barChartData: []
    }
  },
  methods: {
    load_history(){
      var vm = this;
      vm.isLoading = true;
      var now = new Date().toISOString();
      request_handler.send_request(
        {
          url: "http://localhost:8000/history",
          method: "get",
          params: {
            "to_date": now.substring(0,10),
            "months": 6
          }
        },
        vm,
        (resp)=>{
          vm.timeseriesData = mapper.conv2Lines(resp.data);
          vm.$refs.timeseries.clear();
          vm.$refs.timeseries.createTimeseriesChart(vm.timeseriesData);
          vm.isLoading = false
        },
        ()=>{
          vm.timeseriesData = [];
          vm.isLoading = false;
        }
      );
      request_handler.send_request(
        {
          url: "http://localhost:8000/monthstats",
          method: "get",
          params: {
            "to_date": now.substring(0,10),
            "top": 3
          }
        },
        vm,
        (resp)=>{
          vm.pieChartData = mapper.conv2Pie(resp.data);
          vm.$refs.piechart.createPieChart(vm.pieChartData);
          vm.isLoading = false;
        },
        ()=>{
          vm.pieChartData = [];
          vm.isLoading = false;
        }
      );
      /*const request_hist = {
        params: {
          "to_date": now.substring(0,10),
          "months": 6
        },
        withCredentials: true,
        validateStatus: () => true
      };
      const request_monthstats = {
        params: {
          "to_date": now.substring(0,10),
          "top": 3
        },
        withCredentials: true,
        validateStatus: () => true
      };
      axios.get("http://localhost:8000/history", request_hist).then((resp)=>{
        vm.timeseriesData = mapper.conv2Lines(resp.data);
        vm.$refs.timeseries.clear();
        vm.$refs.timeseries.createTimeseriesChart(vm.timeseriesData);
        vm.isLoading = false
      }, (err)=>{
        vm.isLoading = false;
        vm.$bvToast.toast("Failed to retrieve data", {
          title: "Error",
          autoHideDelay: 5000,
          appendToast: true,
          variant: "danger"
        })
      })
      axios.get("http://localhost:8000/monthstats", request_monthstats).then((resp)=>{
        vm.pieChartData = mapper.conv2Pie(resp.data);
        vm.$refs.piechart.createPieChart(vm.pieChartData);
        vm.isLoading = false;
      }, (err)=>{
        vm.isLoading = false;
        vm.$bvToast.toast("Failed to retrieve data", {
          title: "Error",
          autoHideDelay: 5000,
          appendToast: true,
          variant: "danger"
        })
      })*/
    },
    onMonthSelect(data) {
      var vm = this;
      vm.isLoading = true;
      vm.$router.push("#drilldown").catch(err => {})
      request_handler.send_request(
        {
          url: "http://localhost:8000/monthstats",
          method: "get",
          params: {
            "to_date": moment(data).endOf("month").toISOString().substring(0,10),
            "top": 3
          }
        },
        vm,
        (resp)=>{
          vm.pieChartData = mapper.conv2Pie(resp.data);
          vm.$refs.piechart.clear();
          vm.$refs.barchart.clear();
          vm.$refs.piechart.createPieChart(vm.pieChartData);
          vm.isLoading = false;
        },
        ()=>{
          vm.pieChartData = [];
          vm.barChartData = []
          vm.isLoading = false;
        }
      );

      /*const request_monthstats = {
        params: {
          "to_date": moment(data).endOf("month").toISOString().substring(0,10),
          "top": 3
        },
        withCredentials: true,
        validateStatus: () => true
      };
      axios.get("http://localhost:8000/monthstats", request_monthstats).then((resp)=>{
        vm.pieChartData = mapper.conv2Pie(resp.data);
        vm.$refs.piechart.clear();
        vm.$refs.barchart.clear();
        vm.$refs.piechart.createPieChart(vm.pieChartData);
        vm.isLoading = false;
      }, (err)=>{
        vm.isLoading = false;
        vm.$bvToast.toast("Failed to retrieve data", {
          title: "Error",
          autoHideDelay: 5000,
          appendToast: true,
          variant: "danger"
        })
      })*/
    },
    onSliceSelect(data) {
      var vm = this;
      vm.barChartData = mapper.conv2Bar(data)
      vm.$refs.barchart.clear();
      vm.$refs.barchart.createBarchart(vm.barChartData);
    }
  },
  mounted(){
    this.load_history();
  }
}
</script>
