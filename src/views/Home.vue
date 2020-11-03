<template>
  <div class="home">
    <b-img :src="require('../assets/money.jpg')" alt="ispend" thumbnail fluid></b-img>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import { BImg } from 'bootstrap-vue';
export default {
  name: "Home",
  components: {
    HelloWorld,
    "b-img": BImg
  }
}
</script>
