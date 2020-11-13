import Manage from "../src/views/Manage.vue"
import Dashboard from "../src/views/Dashboard.vue"
import { mount, createLocalVue, createWrapper } from '@vue/test-utils'
import axios from 'axios';
import { BootstrapVue } from 'bootstrap-vue'
import MockDate from 'mockdate'


jest.mock('axios');
const localVue = createLocalVue();
localVue.use(BootstrapVue);

var waitRAF = function(){
  return new Promise(resolve => requestAnimationFrame(resolve));
}
const createContainer = (tag = 'div') => {
  const container = document.createElement(tag)
  document.body.appendChild(container)
  return container
};

//node --inspect-brk node_modules/.bin/jest --runInBand
//debug on chrome://inspect
describe("Test Manage Component", () => {
  test("list items are displayed", async () =>{
    const resp = {
      data: [{
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
      status: "200"
    }
    axios.request.mockResolvedValueOnce(resp);
    // mount() returns a wrapped Vue component we can interact with
    const wrapper = mount(Manage)
    await wrapper.vm.$nextTick(); //wait for axios to return
    await wrapper.vm.$nextTick(); //wait for re-render after data update by axios request
    expect(wrapper.text()).toContain("MyTest1");
    expect(wrapper.text()).toContain("MyTest2");
  })
  test("toast is displayed after error", async () =>{
    axios.request.mockRejectedValueOnce(new Error("Network Error"));
    // mount() returns a wrapped Vue component we can interact with
    const wrapper = mount(Manage, {localVue, attachTo: createContainer()})
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
});
describe("Test Dashboard Component", () => {
  test("dashboard events trigger correctly", async () =>{
    const now = new Date(2020, 10, 20);
    MockDate.set(now)
    const resp_hist = {status: 200, data: [{
      "categoryname":"Hobbies",
      "history":[{"date":"2020-11-02","total": 5.50},{"date":"2020-11-05","total": 4.50}]
    },{
      "categoryname":"Home",
      "history":[{"date":"2020-10-14","total":6.00},{"date":"2020-11-20","total": 10.00}]
    }]}
    const resp_month = {status: 200, data: {
      "monthtotal": 20.00,
      "categorystats":[
        {
          "categoryname":"Hobbies",
          "total": 10.00,
          "expenselist":[
            {
              "title":"MyTest1",
              "sum":5.50,
              "date":"2020-11-02",
              "category":"Hobbies"
            },
            {
              "title":"MyTest2",
              "sum":4.50,
              "date":"2020-11-05",
              "category":"Hobbies"
            }
          ]
        },{
          "categoryname":"Home",
          "total": 10.00,
          "expenselist":[
            {
              "title":"MyTest3",
              "sum":10.00,
              "date":"2020-11-10",
              "category":"Home"
            }
          ]
        }
      ]}
    }
    axios.request.mockImplementation((req)=>{
      if(req.url == "http://localhost:8000/history"){
        return Promise.resolve(resp_hist);
      } else if(req.url == "http://localhost:8000/monthstats"){
        return Promise.resolve(resp_month);
      } else {
        expect(1).toEqual(0); //test fail
      }
    })
    // fake router
    const $router = {
      push: ()=>{return Promise.resolve();},
    }
    // mount component
    const wrapper = mount(Dashboard, {
      attachTo: createContainer(), // render d3js
      mocks: {$router}
    })
    // receive axios response -> update UI
    await wrapper.vm.$nextTick();
    const svgTimeseries = document.getElementById("svg-timeseries")
    const svgPiechart = document.getElementById("svg-piechart")
    const svgBarchart = document.getElementById("svg-barchart")
    expect(svgTimeseries).toBeDefined()
    expect(svgTimeseries).not.toBe(null)
    expect(svgBarchart).toBeDefined()
    expect(svgBarchart).not.toBe(null)
    expect(svgPiechart).toBeDefined()
    expect(svgPiechart).not.toBe(null)
    const ticks = document.querySelectorAll("svg#svg-timeseries g.x-axis > g.tick")
    expect(ticks[12].textContent).toBe("Nov-20")
    expect(ticks).toBeDefined()
    expect(ticks).not.toBe(null)
    // click on month to trigger pie chart
    expect(ticks[12].textContent).toBe("Nov-20")
    ticks[12].dispatchEvent(new Event("click"));
    await wrapper.vm.$nextTick(); // axios
    const pieArcs = document.querySelectorAll("svg#svg-piechart g.slice")
    expect(pieArcs.length).toBe(2)
    var hobbiesArc;
    pieArcs.forEach((p)=>{
      var percentage = p.querySelector("path.arc title").textContent;
      var label = p.querySelector("text.label-text").textContent;
      switch(label){
        case "Hobbies":
          expect(percentage).toBe("50%");
          hobbiesArc = p.querySelector("path.arc"); // for next test
          break;
        case "Home":
          expect(percentage).toBe("50%");
          break;
        default:
          expect(1).toBe(0); // test fail
      }
    });
    hobbiesArc.dispatchEvent(new Event("click"));
    const bars = document.querySelectorAll("svg#svg-barchart g.barchart rect")
    expect(bars.length).toBe(2)
    bars.forEach((b)=>{
      expect(b.textContent).toMatch(new RegExp("MyTest"));
    })
  })
})