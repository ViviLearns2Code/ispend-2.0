<template>
  <div class="manage">
    <h1>Create new expense</h1>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="name-group" label="Name:" label-for="name-input" description="Name of expense">
        <b-form-input
          id="name-input"
          v-model="form.name"
          type="string"
          required
          placeholder="expense name"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="category-group" label="Category:" label-for="category-input">
        <b-form-select
          id="category-input"
          v-model="form.category"
          :options="categories"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="amount-group">
        <b-form-input
          id="amount-input"
          v-model="form.amount"
          type="Number"
          required
          placeholder="expense amount"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
import { BForm } from 'bootstrap-vue'
export default {
  name: "Manage",
  components: {
      "b-form": BForm
  },
  data() {
    return {
      show: true,
      form: {
        amount: 0,
        name: '',
        category: null
      },
      categories: [{ text: 'Select One', value: null }, 'Car', 'Home', 'Food', 'Hobbies', 'Insurance', 'Other'],
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      alert(JSON.stringify(this.form))
    },
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.amount = 0
      this.form.name = ''
      this.form.category = null
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>
