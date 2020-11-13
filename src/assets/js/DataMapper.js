import moment from "moment"


export function conv2Lines(data, now){
  return data.map((c)=>{
    return {
        text: c.categoryname, // line name
        data: this.fillDates(c.history, now)
    }
  });
}
export function fillDates(data, to){
  // helper method to fill in zero spendings for dates with no recorded spendings
  let from = moment(to).subtract(12, "months");
  from.startOf("month");
  let result = [];
  let lastChecked = 0;
  while( from.isSameOrBefore(moment(to), "day") ){
    // use momentjs to increment by months
    // check if data belongs to month and sum up totals
    // if no data found, write 0
    // data is already ordered by dates
    let monthTotal = 0;
    let monthStart = from;
    for(let i=lastChecked;i<data.length;i++){
      if(from.isSame(data[i].date, "month")){
        monthTotal += data[i].total;
        lastChecked = lastChecked + 1;
      } else { // from date before range covered by data array
        result.push({
          x: monthStart.toDate(),
          y: monthTotal
        });
        break;
      }
    }
    if(lastChecked >= data.length) { // from date after range covered by data array
      result.push({
        x: monthStart.toDate(),
        y: monthTotal
      });
    }
    from = from.add(1, "months").startOf("month");
  }
  return result;
}

export function conv2Pie(monthStats) {
  let result = [];
  let total = monthStats.monthtotal;
  monthStats.categorystats.forEach( (c) => {
    let catData;
    catData = {
      text: c.categoryname,
      data: {
        catTop: c.expenselist
      },
      val: c.total / total * 100
    }
    result.push(catData);
  });
  return result;
}

export function conv2Bar(data) {
  return data.data.catTop.map((e)=>{
    return { text: e.title,
             val: e.sum,
             data: e
           };
  });
}