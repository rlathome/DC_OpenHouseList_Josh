// import {findDOMNode} from 'react-dom';
var ReactDOM = require('react-dom');
var React = require('react');
var moment = require('moment');
var $ = require('jquery');

function sliderFunctions(){

  this.resizeSlider = (slider,slider_contents,num_boxes,comp) =>{
    console.log('resize slider props')
      let $slider = $(slider);
      let $slider_contents = $(slider_contents);
      let width = $slider.width();
      let height=$slider.height();
      height = height*.75+'px';
      width=(width/num_boxes);
      let slider_width= width+'px';
      let $items = $slider_contents.children('li');
      $items.css({'width':slider_width,'height':height});
      const ratio = $slider_contents.find('li').length+2;
      console.log('ratio: ',ratio);
      let new_width = width*ratio+'px';
      console.log('new width: ',new_width);
      $slider_contents.css('width',new_width);

  }

  //This function is only called if user picks today, so as to create a 4 hour time window:

  this.resetHours=(comp)=>{
    let day_chosen = comp.props.day_short;
    let now = comp.state.curr_hour;
    let today = now.format('ddd');
    // let curr_hour = moment().add(12,'hour').format('HH');
    let curr_hour = now.format('HH');
    console.log('curr_hour reset: ',curr_hour);
    let withinDayRange = curr_hour >9 && curr_hour<15;
    if(!withinDayRange){
      console.log('not within range today')
      //Either set to following day or display all available times later in that day
      return;
    }
    console.log('is within range');
    console.log('user picks day: ',day_chosen,' & today is ',today);
    let scrollClass;
    if(day_chosen === today){
      // create time window:
      let time_window = now;
      time_window.add(4,'hour');
      console.log('time_window: ',time_window.format('HH'));
      scrollClass = '.'+(moment(time_window,'hh').format('h')+'00').toString()+'hours';
      console.log('four hours from ',scrollClass);
      // let scrollElem = comp.refs.scrollClass;
      let $scrollElem = $(scrollClass);
      const scrollPos = $scrollElem.position().left;
      const scrollIndex = $scrollElem.closest('li').index();
      console.log('our desired time is at ',comp.props.slider_contents, ' ',scrollIndex);
      if(scrollIndex !==0){
        console.log('changing contents')
        const contents = comp.props.slider_contents.slice(scrollIndex,comp.props.slider_contents.length);
        comp.setState({
          slider_contents: contents
        });
      }
      time_window.subtract(4,'hour');
    }
  }

  this.late_afternoon_clear = (comp) =>{
    let curr_hour = comp.state.curr_hour.format('HH')+'00';
    let withinRange = curr_hour >9 && curr_hour<15;
    let day_chosen = comp.props.day_short;
    let now = comp.state.curr_hour;
    let today = now.format('ddd');
    if(!withinRange && comp.props.slider_kind =='times' && day_chosen==today){
    console.log('late aft curr_hour: ',comp.props.slider_kind,curr_hour);
      console.log('erasing contents')
      comp.setState({
        slider_contents:'',
        late_afternoon:true
      });
    }else{
      comp.setState({
        late_afternoon:false,
        slider_contents:comp.props.slider_contents
      });
    }
  }

  this.scrollChosenDay=(comp)=>{
    let booking_day = comp.props.booking_day;
    let curr_hour = comp.state.curr_hour.format('HH')+'00';
    console.log('curr_hour: ',curr_hour);
    let withinRange = curr_hour >9 && curr_hour<15;
    if(booking_day && comp.props.slider_kind !=='times'){
      let _booking_day = '.'+booking_day;
      let $booking_day = $(_booking_day);
      console.log('day picked: ',booking_day);
      $booking_day.addClass('picked');
      const scrollPos = $booking_day.position().left;
      console.log(booking_day,' is ',scrollPos)
      let slider = ReactDOM.findDOMNode(comp.refs.slider);
      $(slider).scrollLeft(scrollPos);
    }
    if(!withinRange && comp.props.slider_kind !=='times'){
      console.log('not within range today, ',curr_hour)
      //Either set to following day or display all available times later in that day
      if(curr_hour>=1500){
        //set the day to tomorrow:
        booking_day = comp.state.curr_hour.add(24,'hour').format('dddd').toLowerCase();
        console.log('greater than 1500',booking_day, ' ', comp.props.slider_kind);

        let _booking_day = '.'+booking_day;
        let $booking_day = $(_booking_day);
        const scrollPos = $booking_day.position().left;
        console.log(booking_day,' is ',scrollPos)
        let slider = ReactDOM.findDOMNode(comp.refs.slider);
        $(slider).scrollLeft(scrollPos);
        comp.setState({
          late_afternoon:true
        });
      }else if(curr_hour<900){
        // display available times for today
        console.log('less than 900')
        return;
      }
    }else{
      this.resetHours(comp);
    }
  }

}

module.exports = sliderFunctions;
