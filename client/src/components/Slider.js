import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import {findDOMNode} from 'react-dom';
var newFunctions = require('./js/Functions.js');
var sliderFunctions = require('./js/SliderFunc.js');
let Slide = new sliderFunctions();
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

  componentDidMount(){
    const slider = findDOMNode(this.refs.slider);
    const slider_contents = findDOMNode(this.refs.slider_contents);
    const num_boxes = this.props.number_boxes;

    //INITIAL SLIDER RESIZE AND SETTING UP SLIDER RESIZING LISTENERS:
    Slide.resizeSlider(slider,slider_contents,num_boxes);;
    $(slider).scrollLeft(0);

    $(window).resize(function(){
      Slide.resizeSlider(slider,slider_contents,num_boxes);;
      $(slider).scrollLeft(0);
    });

    // listen for if user changes day in modal, and if user switches to same day:

    Slide.listenForChanges(this,slider,slider_contents,num_boxes);

    // scroll to chosen day and correct time:
    Slide.scrollChosenDay(this);
  }


  componentWillReceiveProps(nextProps){
    const slider = findDOMNode(this.refs.slider);
    const slider_contents = findDOMNode(this.refs.slider_contents);
    const num_boxes = this.props.number_boxes;
    // In showing times slider, listen for if user changes day in modal, and if user switches to same day:

    if(this.props.slider_kind == 'times' && nextProps.day_short !== this.state.curr_hour.format('ddd')){
      // commands for different day:
      console.log('day changed: ',nextProps.day_short, this.state.curr_hour.format('ddd'))
      this.setState({
        slider_contents:nextProps.slider_contents
      });
      setTimeout(()=>{
        Slide.resizeSlider(slider,slider_contents,num_boxes);
      },100);
      // Slide.late_afternoon_clear(this);
      // commands for same day:
    }else if (this.props.slider_kind == 'times'){
      console.log('day changed to same day!')
      setTimeout(()=>{
        Slide.resetHours(this);
        Slide.resizeSlider(slider,slider_contents,num_boxes);
        // setTimeout(()=>{Slide.late_afternoon_clear(this);},200)
        // Slide.late_afternoon_clear(this);
      },100);
    }

  }
  componentDidUpdate(){
    console.log('new now: ',this.state.curr_hour.format('HH'));
  }

  slideLeft(){
    Slide.slideLeft(this);
  }
  slideRight(){
    Slide.slideRight(this);
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
    let contents = (this.state.slider_contents.length > 0) ? this.state.slider_contents : this.props.slider_contents;
    if(this.state.late_afternoon===true && this.props.slider_kind ==='times'){
      console.log('begone')
      contents = '';
    }
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
