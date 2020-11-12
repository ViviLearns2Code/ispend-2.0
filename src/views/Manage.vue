<template>
  <div class="manage">
    <h1>Manage Expenses</h1>
    <b-overlay :show="isLoading" rounded="sm">
      <b-list-group>
        <b-list-group-item href="#" class="flex-column align-items-start" v-for="e in expenses" :key="e.id">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">{{e.sum | currency_formatter}}</h5>
            <div>
              <p class="mb-1">{{e.title}}</p>
              <small>{{e.category}}</small>
            </div>
            <small>{{e.date}}</small>
          </div>
        </b-list-group-item>
      </b-list-group>
    </b-overlay>
  </div>
</template>

<script>
import { BListGroup, BListGroupItem, BOverlay } from 'bootstrap-vue';
import * as request_handler from '../assets/js/RequestHandler.js';

export default {
  name: "Manage",
  components: {
      "b-list-group": BListGroup,
      "b-list-group-item": BListGroupItem,
      "b-overlay": BOverlay
  },
  data() {
    return {
      expenses: [],
      isLoading: false
    }
  },
  filters: {
    currency_formatter: function(value){
      if (!value){
        return "";
      }
      return value.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'});
    }
  },
  methods: {
    success_fn(resp){
      var vm = this;
      vm.isLoading = false;
      vm.expenses = resp.data;
    },
    cleanup_fn(){
      var vm = this;
      vm.espenses = [];
      vm.isLoading = false;
    },
    load_recent_expenses(){
      var vm = this;
      var now = new Date().toISOString();
      vm.isLoading = true;
      request_handler.send_request(
        {
          url: "http://localhost:8000/recent",
          method: "get",
          params: {"to_date": now.substring(0,10)}
        },
        vm,
        vm.success_fn,
        vm.cleanup_fn
      );
    }
  },
  mounted(){
    this.load_recent_expenses();
  }
}
</script>
