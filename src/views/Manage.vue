<template>
  <div class="manage">
    <h1>Manage Expenses</h1>
    <b-list-group>
      <b-list-group-item href="#" class="flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">16.37 EUR</h5>
          <p class="mb-1">
          Groceries
          </p>
          <small>3 days ago</small>
        </div>
      </b-list-group-item>
      <b-list-group-item href="#" class="flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">415.69 EUR</h5>
          <p class="mb-1">
          Repairs
          </p>
          <small>14 days ago</small>
        </div>
      </b-list-group-item>

    </b-list-group>
  </div>
</template>

<script>
import { BListGroup } from 'bootstrap-vue'
export default {
  name: "Manage",
  components: {
      "b-list-group": BListGroup
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
