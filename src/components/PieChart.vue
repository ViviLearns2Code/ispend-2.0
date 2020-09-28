<template>
  <div class="piechart">
    <h1>{{ title }}</h1>
    <svg viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet"></svg>
  </div>
</template>

<script>
export default {
  name: "Piechart",
  props: {
    title: String
  }
}
</script>
