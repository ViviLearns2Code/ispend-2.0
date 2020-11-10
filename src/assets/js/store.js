export var store = {
    state: {
      isLoggedIn: false
    },
    setLoginState (newValue) {
      this.state.isLoggedIn = newValue
    }
  }