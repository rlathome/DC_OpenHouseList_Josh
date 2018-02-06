var ReactDOM = require('react-dom');
var React = require('react');
var moment = require('moment');
var $ = require('jquery');

function listingFunctions(){
  this.pickDay = (comp,data) => {
    let date = [];
    date.push(data.day_short);
    date.push(data.mo_short);
    date.push(data.date);
    console.log('touring: ',date.join(','));
    comp.setState({
      day_picked:date.join(', '),
      booking_day:data.booking_day,
      day_short:data.day_short
    });
    let ep = '.'+data.day_abbr.toLowerCase();
    $('.slider-item').removeClass('picked');
    $(ep).addClass('picked');
  }

  this.pickModalDay = (comp,data) =>{
      let date = [];
      date.push(data.day_short);
      date.push(data.mo_short);
      date.push(data.date);
      console.log('touring: ',date.join(','));
      if(comp.state.time == '-'){
        comp.setState({
          next_ok:false,
          time:'-',
          end:'-'
        });
      }else if(comp.state.time !=='-' && comp.state.day !=='-'){
        console.log('not ok for next: comp time = ',comp.state.time)
        comp.setState({
          next_ok:false
        })
      }else {
        console.log('ok for next: comp time = ',comp.state.time)
        comp.setState({
          next_ok:true
        })
      }
      comp.setState({
        day_picked:date.join(', '),
        booking_day:data.booking_day,
        day_short:data.day_short
      });
      let ep = '.modal-slider-item.'+data.day_abbr.toLowerCase();
      $('.modal-slider-item').removeClass('picked');
      $(ep).addClass('picked');
    }
  this.pickTime = (comp,data) =>{
    // let ep = e.target.id;
    let id = data.id;
    let time = data.time;
    comp.setState({
      time:time,
      end:data.end
    });
    if(comp.state.booking_day !== '-'){
      comp.setState({
        next_ok:true
      });
    }
    console.log('the time: ',time);
    console.log('ending: ',data)
    id="#"+id;
    console.log('ep: ',id)
    $('.slider-time').removeClass('picked');
    $(id).addClass('picked');
  }
}
module.exports = listingFunctions;
