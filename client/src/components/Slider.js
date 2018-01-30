import React, { Component } from 'react';
import $ from 'jquery';
import {findDOMNode} from 'react-dom';
var newFunctions = require('./Functions.js');
let Functions = new newFunctions();

export default class Slider extends Component{
  constructor(props){
    super(props);

  }
  componentDidMount(){
    const slider = findDOMNode(this.refs.slider);
    const slider_contents = findDOMNode(this.refs.slider_contents);
    const num_boxes = this.props.number_boxes;
    function resizeSlider(){
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
    resizeSlider();

    $(window).resize(function(){
      resizeSlider();
    });
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
    const button = (this.props.call_to_action) ? (
      <div onClick={()=>this.props.openScheduler()} className="btn btn-primary">Schedule Showing</div>
    ) : '';
    const sliderClass = (this.props.call_to_action) ? 'slider-contents' : 'modal-slider-contents';
    const onPageClass = (this.props.call_to_action) ? 'slider onPage' : 'slider modal-onPage';
    return(
      <div className="go-tour">
        <div className="go-tour-wrapper">
          <div className="go-tour-title">{this.props.title}</div>
          <span onClick={() => this.slideLeft()} className="fa fa-angle-left"></span>
          <div ref='slider' className={onPageClass}>
            <ul ref='slider_contents' className={sliderClass}>
              {this.props.slider_contents}
            </ul>
          </div>
          <span onClick={() => this.slideRight()} className="fa fa-angle-right"></span>
          { button }
        </div>
      </div>
    )
  }
}
