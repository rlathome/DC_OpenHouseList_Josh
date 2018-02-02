import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import {findDOMNode} from 'react-dom';
var newFunctions = require('./Functions.js');
let Functions = new newFunctions();

export default class Slider extends Component{
  constructor(props){
    super(props);
    this.state={
      slider_contents:[],
      booking_day:'',
      curr_hour:moment()
    }
  }
  componentWillMount(){
    // let booking_day = (this.props.booking_day) ? this.props.booking_day : '';
    // this.setState({
    //   booking_day
    // });
  }

  componentDidMount(){
    const slider = findDOMNode(this.refs.slider);
    const slider_contents = findDOMNode(this.refs.slider_contents);
    const num_boxes = this.props.number_boxes;
    function resizeSlider(){
      console.log('resize slider mounting')
        let $slider = $(slider);
        let $slider_contents = $(slider_contents);
        let width = $slider.width();
        // console.log('width change')
        let height=$slider.height();
        // console.log('height: ',height);
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
        $slider.scrollLeft(0);

    }

    //INITIAL SLIDER RESIZE AND SETTING UP SLIDER RESIZING LISTENERS:
    resizeSlider();

    $(window).resize(function(){
      resizeSlider();
    });

    // listen for if user changes day in modal, and if user switches to same day:

    if(this.props.slider_kind == 'times' && this.props.day_short !== this.state.curr_hour.format('ddd')){
      // commands for different day:
      console.log('day changed: ',this.props.day_short, this.state.curr_hour.format('ddd'))
      this.setState({
        slider_contents:this.props.slider_contents
      });
      setTimeout(()=>{
        resizeSlider();
      },100);
      // commands for same day:
    }else if (this.props.slider_kind == 'times'){
      console.log('day changed to same day!')
      setTimeout(()=>{
        this.resetHours();
      },50);
      resizeSlider();
    }

    //SET SLIDER TO CORRECT DAY/TIME:
    let booking_day = this.props.booking_day;
    let curr_hour = this.state.curr_hour.format('HH')+'00';
    console.log('curr_hour: ',curr_hour);
    let withinRange = curr_hour >9 && curr_hour<15;
    if(!withinRange){
      console.log('not within range today, ',curr_hour)
      //Either set to following day or display all available times later in that day
      if(curr_hour>=1500){
        //set the day to tomorrow:
        booking_day = this.state.curr_hour.add(24,'hour').format('dddd').toLowerCase();
        console.log('greater than 1500',booking_day)
      }else if(curr_hour<900){
        // display available times for today
        console.log('less than 900')
        return;
      }
    }else{
      this.resetHours();
    }
    // scroll to chosen day:
    if(booking_day){
      const _booking_day = '.'+booking_day;
      let $booking_day = $(_booking_day);
      console.log('day picked: ',booking_day);
      $booking_day.addClass('picked');
      const scrollPos = $booking_day.position().left;
      console.log(booking_day,' is ',scrollPos)
      let slider = findDOMNode(this.refs.slider);
      $(slider).scrollLeft(scrollPos);
    }

  }

  //This function is only called if user picks today, so as to create a 4 hour time window:

  resetHours(){
    let day_chosen = this.props.day_short;
    let now = this.state.curr_hour;
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
      // let scrollElem = this.refs.scrollClass;
      let $scrollElem = $(scrollClass);
      const scrollPos = $scrollElem.position().left;
      const scrollIndex = $scrollElem.closest('li').index();
      console.log('our desired time is at ',this.props.slider_contents, ' ',scrollIndex);
      if(scrollIndex !==0){
        console.log('changing contents')
        const contents = this.props.slider_contents.slice(scrollIndex,this.props.slider_contents.length);
        this.setState({
          slider_contents: contents
        });
      }
      time_window.subtract(4,'hour');
    }
  }
  componentWillReceiveProps(nextProps){
    const slider = findDOMNode(this.refs.slider);
    const slider_contents = findDOMNode(this.refs.slider_contents);
    const num_boxes = this.props.number_boxes;
    function resizeSlider(){
        console.log('resize slider props')
        let $slider = $(slider);
        let $slider_contents = $(slider_contents);
        let width = $slider.width();
        // console.log('width change')
        let height=$slider.height();
        // console.log('height: ',height);
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

        // this scroll is causing unnecessary repositioning of time bar:
        // $slider.scrollLeft(0);
    }

    // listen for if user changes day in modal, and if user switches to same day:

    if(this.props.slider_kind == 'times' && nextProps.day_short !== this.state.curr_hour.format('ddd')){
      // commands for different day:
      console.log('day changed: ',nextProps.day_short, this.state.curr_hour.format('ddd'))
      this.setState({
        slider_contents:nextProps.slider_contents
      });
      setTimeout(()=>{
        resizeSlider();
      },100);
      // commands for same day:
    }else if (this.props.slider_kind == 'times'){
      console.log('day changed to same day!')
      setTimeout(()=>{
        this.resetHours();
        resizeSlider();
      },100);
    }
  }
  componentDidUpdate(){
    console.log('new now: ',this.state.curr_hour.format('HH'))
  }

  slideLeft(){
    console.log('left')
    let slider = findDOMNode(this.refs.slider);
    let slider_contents = findDOMNode(this.refs.slider_contents);
    let slide_len = $(slider).width();
    console.log(slide_len);
    let pic_abs_left = $(slider_contents).position().left;

    console.log('abs left: ',pic_abs_left)
    const amt = '-='+slide_len;
    $(slider).animate({ scrollLeft: amt},200);
  }
  slideRight(){
    console.log('right')
    let slide_len = $('.slider').width();
    console.log(slide_len);
    const amt = '+='+slide_len;
    // let pic_abs_left;
    let slider_contents = findDOMNode(this.refs.slider_contents);
    let slider = findDOMNode(this.refs.slider);
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

  render(){
    let arrowClass;
    let arrowClass2;
    switch(this.props.slider_kind){
      case 'days':
      arrowClass='fa fa-angle-left';
      arrowClass2='fa fa-angle-right';
      break;
      case 'modal-days':
      arrowClass='fa fa-angle-left arrow_modal_days';
      arrowClass2='fa fa-angle-right arrow_modal_days';
      break;
      case 'times':
      arrowClass='fa fa-angle-left arrow_left_modal_times';
      arrowClass2='fa fa-angle-right arrow_right_modal_times';
      break;
      default:
      arrowClass='fa fa-angle-left';
      arrowClass2='fa fa-angle-right';
    }
    const button = (this.props.call_to_action) ? (
      <div onClick={()=>this.props.openScheduler()} className="btn btn-primary">Schedule Showing</div>
    ) : '';
    const sliderClass = (this.props.call_to_action) ? 'slider-contents' : 'modal-slider-contents';
    const onPageClass = (this.props.call_to_action) ? 'slider onPage' : 'slider modal-onPage';
    const contents = (this.state.slider_contents.length > 0) ? this.state.slider_contents : this.props.slider_contents;
    return(
      <div className="go-tour">
        <div className="go-tour-wrapper">
          <div className="go-tour-title">{this.props.title}</div>
          <span onClick={() => this.slideLeft()} className={arrowClass}></span>
          <div ref='slider' className={onPageClass}>
            <ul ref='slider_contents' className={sliderClass}>
              {contents}
            </ul>
          </div>
          <span onClick={() => this.slideRight()} className={arrowClass2}></span>
          { button }
        </div>
      </div>
    )
  }
}
