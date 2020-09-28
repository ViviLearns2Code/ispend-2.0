<template>
  <div id="app">
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-nav>
      <b-nav-item to="/">Home</b-nav-item>
      <b-nav-item to="/manage">Manage</b-nav-item>
      <b-nav-item to="/new">New</b-nav-item>
      <b-nav-item to="/dashboard">Dashboard</b-nav-item>
    </b-navbar-nav>
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-button variant="danger">Login</b-button>
      <b-button variant="success">Logout</b-button>
      <div id="g-signin2-btn" class="g-signin2" data-onsuccess="onSignIn">Sign in</div>
    </b-navbar-nav>
  </b-navbar>
  <router-view></router-view>
  </div>
</template>

<script>
import { BNavbar } from 'bootstrap-vue'
import { BButton } from 'bootstrap-vue'
export default {
  components: {
    "b-navbar": BNavbar,
    "b-button": BButton
  },
  methods: {
    isLoggedIn() {
        return false;
    }
  },
  mounted() {
    window.gapi.load("auth2", () => {
      /* Ready. Make a call to gapi.auth2.init or some other API */
      const auth2 = window.gapi.auth2.init({
        client_id: "628335156384-f2nn9sjonhucddp7jmnhc7gl16fehec9.apps.googleusercontent.com",
      });
      auth2.then((resp)=>{
        console.log("Initialization successful: "+resp);
      }, (resp) => {
        console.log("Could not initialize: "+resp);
      })
      window.gapi.signin2.render('g-signin2-btn', { 
        onsuccess: this.onSignIn
      })
    });
  }

}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
