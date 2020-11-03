<template>
  <div class="manage">
    <h1>Manage Expenses</h1>
    <b-list-group>
      <b-list-group-item href="#" class="flex-column align-items-start" v-for="e in expenses" :key="e._id">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{e.sum | currency_formatter}}</h5>
          <p class="mb-1">
          {{e.category}}
          </p>
          <small>{{e.date}}</small>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { BListGroup } from 'bootstrap-vue'
import axios from "axios";

export default {
  name: "Manage",
  components: {
      "b-list-group": BListGroup
  },
  data() {
    return {
      expenses: []
    }
  },
  filters: {
    currency_formatter: function(value){
      return value.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'});
    }
  },
  methods: {
    load_recent_expenses(){
      var now = new Date().toISOString();
      const request = {
        params: { "to_date": now.substring(0,10) },
        withCredentials: true
      };
      axios.get("http://localhost:8000/recent", request).then((resp)=>{
        this.expenses = resp.data
      }, (err)=>{
        console.log(err)
      })
    }
  },
  mounted(){
    this.load_recent_expenses();
  }
}
</script>
