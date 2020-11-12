import Manage from "../src/views/Manage.vue"
import { mount, createLocalVue, createWrapper } from '@vue/test-utils'
import axios from 'axios';
import { BootstrapVue } from 'bootstrap-vue'


jest.mock('axios');
const localVue = createLocalVue();
localVue.use(BootstrapVue);

//node --inspect-brk node_modules/.bin/jest --runInBand
//debug on chrome://inspect
describe("Test Manage Component", () => {
  test("check-list-items", async () =>{
    const resp = {
      "data": [{
        "id": "1",
        "title": "MyTest1",
        "sum": 2.00,
        "date": "2020-11-03",
        "category": "Hobbies"
      }, {
        "id": "2",
        "title": "MyTest2",
        "sum": 4.00,
        "date": "2020-11-05",
        "category": "Hobbies"
      }],
      "status": "200"
    }
    axios.request.mockResolvedValueOnce(resp);
    // mount() returns a wrapped Vue component we can interact with
    const wrapper = mount(Manage)
    // loading
    await wrapper.vm.$nextTick(); //wait for axios to return
    // not loading
    await wrapper.vm.$nextTick(); //wait for re-render after data update by axios request
    expect(wrapper.text()).toContain("MyTest1");
    expect(wrapper.text()).toContain("MyTest2");
  })
  test("handle-request-failure", async () =>{
    const createContainer = (tag = 'div') => {
      const container = document.createElement(tag)
      document.body.appendChild(container)
      return container
    };
    axios.request.mockRejectedValueOnce(new Error("Network Error"));
    // mount() returns a wrapped Vue component we can interact with
    const wrapper = mount(Manage, {localVue, attachTo: createContainer()})
    var waitRAF = function(){
      return new Promise(resolve => requestAnimationFrame(resolve));
    }
    // wait for axios to return
    await wrapper.vm.$nextTick();
    // https://github.com/bootstrap-vue/bootstrap-vue/blob/dev/src/components/toast/helpers/bv-toast.spec.js
    await waitRAF()
    await wrapper.vm.$nextTick();
    await waitRAF()
    await wrapper.vm.$nextTick();
    await waitRAF()
    const toast = document.querySelector(".toast");
    expect(toast).toBeDefined();
    expect(toast).not.toEqual(null);
    const $toast = createWrapper(toast);
    expect($toast.text()).toContain("Network Error")
  })
})
