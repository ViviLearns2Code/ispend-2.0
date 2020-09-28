<template>
  <div class="hello">
    <h1>Keeping track of your finances is difficult.</h1>
    <h2>With this app as your little assistant, you can </h2>
    <ul>
      <li>add a new entry every time you spend money</li>
      <li>view your most recent spendings</li>
      <li>analyze your spending structure</li>
      <li>see how your spending habits have changed over time</li>
    </ul>
    <h5>tldr;</h5>
    Don't stay clueless about where your money ends up anymore - understand your own habits and optimize your behaviour if necessary! 
    <h5>What are you waiting for?</h5>
    Log in with your google account and start <s>spending</s> analyzing!
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
