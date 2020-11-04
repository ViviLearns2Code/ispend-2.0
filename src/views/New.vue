<template>
  <div class="manage">
    <h1>Create new expense</h1>
    <b-overlay :show="isLoading" rounded="sm">
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="title-group" label="Title" label-for="title-input">
          <b-form-input
            id="title-input"
            v-model="form.title"
            type="text"
            required
            placeholder="expense title"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="date-group" label="Date" label-for="datepicker">
          <b-form-datepicker id="datepicker" v-model="form.date" class="mb-2"></b-form-datepicker>
        </b-form-group>
        <b-form-group id="category-group" label="Category" label-for="category-input">
          <b-form-select
            id="category-input"
            v-model="form.category"
            :options="categories"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group id="sum-group"
          label="Sum"
          label-for="sum-input"
          description="in EUR">
          <b-form-input
            id="sum-input"
            v-model="form.sum"
            required
            placeholder="0.00"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-overlay>
  </div>
</template>

<script>
import { BForm, BFormDatepicker, BOverlay } from 'bootstrap-vue';
import axios from "axios";
export default {
  title: "Manage",
  components: {
      "b-form": BForm,
      "b-form-datepicker": BFormDatepicker,
      "b-overlay": BOverlay
  },
  data() {
    return {
      isLoading: false,
      show: true,
      form: {
        sum: 0,
        title: '',
        category: null,
        date: new Date().toISOString().substring(0,10)
      },
      categories: [{ text: 'Select One', value: null }, 'Car', 'Home', 'Food', 'Hobbies', 'Insurance', 'Other'],
    }
  },
  methods: {
    onSubmit(evt) {
      var vm = this;
      vm.isLoading = true;
      evt.preventDefault()
      var request_body = { ...this.form }
      request_body["sum"] = parseFloat(request_body["sum"])
      const request_config = {
        withCredentials: true
      };
      axios.post("http://localhost:8000/add", request_body, request_config).then((resp)=>{
        vm.isLoading = false;
        vm.$bvToast.toast("Successfully created new expense", {
          title: "Info",
          autoHideDelay: 5000,
          appendToast: true,
          variant: "info"
        })
      }, (err)=>{
        vm.isLoading = false;
        vm.$bvToast.toast("Failed to create new expense", {
          title: "Error",
          autoHideDelay: 5000,
          appendToast: true,
          variant: "danger"
        })
      })
    },
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.sum = 0;
      this.form.title = '';
      this.form.category = null;
      this.form.date = new Date();
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      })
    }
  }
}
</script>
