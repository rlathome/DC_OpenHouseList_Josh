var ReactDOM = require('react-dom');
var React = require('react');
var moment = require('moment');
var $ = require('jquery');

function sliderFunctions(){

  this.slideLeft = (comp) =>{
    console.log('left')
    let slider = ReactDOM.findDOMNode(comp.refs.slider);
    let slider_contents = ReactDOM.findDOMNode(comp.refs.slider_contents);
    let slide_len = $(slider).width();
    console.log(slide_len);
    let pic_abs_left = $(slider_contents).position().left;

    console.log('abs left: ',pic_abs_left)
    const amt = '-='+slide_len;
    $(slider).animate({ scrollLeft: amt},200);
  }

  this.slideRight = (comp) =>{
    console.log('right')
    let slide_len = $('.slider').width();
    console.log(slide_len);
    const amt = '+='+slide_len;
    // let pic_abs_left;
    let slider_contents = ReactDOM.findDOMNode(comp.refs.slider_contents);
    let slider = ReactDOM.findDOMNode(comp.refs.slider);
    let pic_abs_left = $(slider_contents).position().left;

    let remaining = pic_abs_left+$(slider_contents).width()-slide_len;
    if(remaining>=slide_len){
      $(slider).animate({ scrollLeft: amt},200,()=>{
        // let pic_abs_left = $('.slider-contents').position().left;
        let remaining = pic_abs_left+$(slider_contents).width();
        console.log('remaining: ',remaining,' slider-width: ',slide_len);
      });
    }else{
      // remaining = pic_abs_left+$('.slider-contents').width()-slide_len+15;
      console.log('not more');
      remaining=remaining;
      remaining = '+='+remaining;
      $(slider).animate({ scrollLeft: remaining},200);
    }
  }

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

  this.listenForChanges = (comp,slider,slider_contents,num_boxes) =>{
    if(comp.props.slider_kind == 'times' && comp.props.day_short !== comp.state.curr_hour.format('ddd')){
      // commands for different day:
      console.log('day changed: ',comp.props.day_short, comp.state.curr_hour.format('ddd'))
      comp.setState({
        slider_contents:comp.props.slider_contents
      });
      setTimeout(()=>{
        this.resizeSlider(slider,slider_contents,num_boxes);
      },100);
      this.remove_current_day(comp);
      // commands for same day:
    }else if (comp.props.slider_kind == 'times'){
      console.log('day changed to same day!')
      setTimeout(()=>{
        this.resetHours(comp);
        this.remove_current_day(comp);
      },50);
      this.resizeSlider(slider,slider_contents,num_boxes);
    }
  }

  //This function is only called if user picks today, so as to create a 4 hour time window:

  this.resetHours= (comp) =>{
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

  this.remove_current_day = (comp) =>{
    comp.setState({
      slider_contents:comp.props.slider_contents.slice(1,comp.props.slider_contents.length)
    });
    let curr_hour = comp.state.curr_hour.format('HH');
    let withinRange = curr_hour >9 && curr_hour<15;
    let day_chosen = comp.props.day_short;
    let now = comp.state.curr_hour;
    let today = now.format('ddd');
    console.log('late aft clear ',day_chosen,' equals ',today, ' curr_hour: ',curr_hour);
    // if(!withinRange && comp.props.slider_kind !=='times' && day_chosen==today){
    // // console.log('late aft curr_hour: ',comp.props.slider_kind,curr_hour);
    //
    //
    //   console.log('erasing contents')
    //   // comp.setState({
    //   //   s
    //   // });
    // }else{
    //   // comp.setState({
    //   //   late_afternoon:false
    //   // });
    // }
  }

  this.scrollChosenDay = (comp) =>{
    let booking_day = comp.props.booking_day;
    let curr_hour = comp.state.curr_hour.format('HH')+'00';
    console.log('curr_hour: ',curr_hour);
    let withinRange = curr_hour >9 && curr_hour<15;
    if(booking_day && comp.props.slider_kind !=='times'){
      this.remove_current_day(comp);
      setTimeout(()=>{
        console.log('slicing off day')
        let _booking_day = '.'+booking_day;
        let $booking_day = $(_booking_day);
        console.log('day picked in scrollChosenDay: ',booking_day);
        $booking_day.addClass('picked');
        const scrollPos = $booking_day.position().left;
        console.log(booking_day,' is ',scrollPos)
        let slider = ReactDOM.findDOMNode(comp.refs.slider);
        $(slider).scrollLeft(scrollPos);
      },50);
    }
    if(!withinRange && comp.props.slider_kind !=='times' && comp.props.slider_kind !=='modal-days'){
      console.log('not within range today, ',curr_hour)
      //Either set to following day or display all available times later in that day
      if(curr_hour>=1500){
        this.remove_current_day(comp);
        //set the day to tomorrow:
        // booking_day = comp.state.curr_hour.add(24,'hour').format('dddd').toLowerCase();
        // console.log('greater than 1500',booking_day, ' ', comp.props.slider_kind);
        //
        // let _booking_day = '.'+booking_day;
        // let $booking_day = $(_booking_day);
        // const scrollPos = $booking_day.position().left;
        // console.log(booking_day,' is ',scrollPos)
        // let slider = ReactDOM.findDOMNode(comp.refs.slider);
        // $(slider).scrollLeft(scrollPos);
        // comp.setState({
        //   late_afternoon:true
        // });
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
