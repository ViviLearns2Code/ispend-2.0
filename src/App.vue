<template>
  <div id="app">
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-nav>
      <b-nav-item to="/">Home</b-nav-item>
      <b-nav-item :disabled="!this.$root.isLoggedIn" to="/manage">Manage</b-nav-item>
      <b-nav-item :disabled="!this.$root.isLoggedIn" to="/new">New</b-nav-item>
      <b-nav-item :disabled="!this.$root.isLoggedIn" to="/dashboard">Dashboard</b-nav-item>
    </b-navbar-nav>
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-button ref="login-btn" v-show="!this.$root.isLoggedIn" variant="success">Login</b-button>
      <b-button ref="logout-btn" v-show="this.$root.isLoggedIn" variant="danger" v-on:click="onSignOut">Logout</b-button>
    </b-navbar-nav>
  </b-navbar>
  <router-view></router-view>
  </div>
</template>

<script>
import { BNavbar } from 'bootstrap-vue';
import { BButton } from 'bootstrap-vue';
import axios from "axios";

export default {
  components: {
    "b-navbar": BNavbar,
    "b-button": BButton
  },
  methods: {
    onSignIn(googleUser){
      const id_token = googleUser.getAuthResponse().id_token;
      var vm = this
      //send id_token to backend API for verification
      const request_data = {
        "google_id_token": id_token
      };
      const request_config = {
        withCredentials: true
      };
      axios.post("http://localhost:8000/login", request_data, request_config).then((resp)=>{
        vm.$root.isLoggedIn = true;
        vm.$bvToast.toast("Login succeeded", {
          title: "Info",
          autoHideDelay: 5000,
          appendToast: true,
          variant: "info"
        })
      }, (err)=>{
        vm.$bvToast.toast("Login failed", {
          title: "Error",
          autoHideDelay: 5000,
          appendToast: true,
          variant: "danger"
        })
      })
    },
    onSignOut(){
      var vm = this;
      axios.get("http://localhost:8000/logout").then((resp)=>{
        vm.$root.isLoggedIn = false;
        this.$router.push("/").catch((err)=>{});
        vm.$bvToast.toast("Logout succeeded", {
          title: "Info",
          autoHideDelay: 5000,
          appendToast: true,
          variant: "info"
        })
      }, (err)=>{
        vm.$bvToast.toast("Logout failed", {
          title: "Danger",
          autoHideDelay: 5000,
          appendToast: true,
          variant: "danger"
        })
      });
    },
    attachSignin(element) {
      var vm = this;
      const auth2 = window.gapi.auth2.getAuthInstance();
      auth2.attachClickHandler(element, {}, this.onSignIn, (error)=>{
        vm.$bvToast.toast(JSON.stringify(error, undefined, 2), {
          title: "Danger",
          autoHideDelay: 5000,
          appendToast: true,
          variant: "danger"
        })
      });
    }
  },
  mounted() {
    var vm = this;
    window.gapi.load("auth2", () => {
      /* Ready. Make a call to gapi.auth2.init or some other API */
      const _auth2 = window.gapi.auth2.init({
        client_id: "628335156384-f2nn9sjonhucddp7jmnhc7gl16fehec9.apps.googleusercontent.com",
        scope: "openid"
      });
      vm.attachSignin(vm.$refs["login-btn"]);
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
