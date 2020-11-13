import axios from "axios";

export function send_request(request, vm, success_fn, cleanup_fn){
  const axrequest = {
    ...request,
    withCredentials: true,
    validateStatus: () => true
  };
  axios.request(axrequest).then((resp)=>{
    if (resp.status == "200"){
      success_fn(resp)
    }
    else if (resp.status == "401"){
      cleanup_fn()
      vm.$bvToast.toast("Not logged in", {
        title: "Info",
        //noAutoHide: true,
        autoHideDelay: 5000,
        appendToast: true,
        variant: "info"
      })
    }
  }, (err)=>{
    cleanup_fn(vm)
    vm.$bvToast.toast("Network Error", {
      title: "Error",
      autoHideDelay: 5000,
      appendToast: true,
      variant: "danger"
    })
  })
}