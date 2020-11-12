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
      vm.$bvToast.toast("Please log in", {
        title: "Warning",
        //noAutoHide: true,
        autoHideDelay: 5000,
        appendToast: true,
        variant: "warning"
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