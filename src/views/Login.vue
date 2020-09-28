<template>
  <div class="login">
    <h1>Login</h1>
    <div id="g-signin2-btn" class="g-signin2" data-onsuccess="onSignIn">Sign in</div>
  </div>
</template>

<script>
export default {
  name: "Login",
  methods: {
    onSignIn(user){
      //do stuff
      console.log(user)
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
