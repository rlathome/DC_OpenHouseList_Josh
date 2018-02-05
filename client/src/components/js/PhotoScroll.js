var React = require('react');
var $ = require('jquery');

function myScroller(){
  this.scrollChecker=(component)=>{
    component.setState({
      autoscroll:false,
      showingpic:true
    });
    setTimeout(()=>{
      component.setState({
        showingpic:false
      });
      if(component.state.autoscroll===false){
        component.setState({
          autoscroll:true
        });
      }
    },5000);
  }
  this.showPic=(component,e)=>{
    component.scrollChecker();
    // e.preventDefault();
    // // console.log("showing: ",e.target.id);
    let newIndex = e.target.id;
    let id='#'+newIndex;
    let id2='#'+component.state.showing_index;
    $(id).addClass('thumb-viewing');
    $(id2).removeClass('thumb-viewing');

    component.setState({
      showing_index:parseInt(e.target.id)
    });
    $('.photo-container').css('opacity',1);
  }
  this.scrollAlong=(component,index)=>{
    let idx = index || component.state.showing_index;
    let pic = $('#'+idx);
    let width = pic.width();
    let off = pic.offset();
    let scroller_width = $('.scroller').width();
    let scroller_pos = $('.scroller').position();
    if(!scroller_pos || !pic.position()){
      return false;
    }
    let scroller_right_offset = scroller_pos.left+scroller_width;
    let scroller_left_offset = scroller_pos.left;
    let pic_offset_left = (off) ? off.left : 0;
    let pic_abs_left = pic.position().left;
    let num_pics = scroller_width/width;

    //SCROLL RIGHT:
    if(pic_offset_left+width>scroller_right_offset-width){
      // console.log('passed! ',(pic_offset_left+width));
      $('.scroller').scrollLeft(pic_abs_left-((num_pics-2)*width));
    }
    //SCROLL LEFT:
    if(pic_offset_left-width<scroller_left_offset){
      // console.log('passed!');
      $('.scroller').scrollLeft(pic_abs_left-width);
    }
  }

  this.goRight=(comp,e)=>{
    e.preventDefault();
    comp.scrollChecker();
    let index = comp.state.showing_index;
    let newIndex=index;
    comp.scrollAlong();
    // console.log('now on: ',newIndex);
    if(index!==comp.state.thumb_photos.length-1){
      newIndex = comp.state.showing_index+1;
      // console.log('navigating to: ',newIndex);
      let id='#'+newIndex;
      let id2='#'+(newIndex-1);
      $(id).addClass('thumb-viewing');
      $(id2).removeClass('thumb-viewing');
    }else{
      newIndex = 0;
      // console.log('navigating to: ',newIndex);
      let id='#'+newIndex;
      let id2='#'+(newIndex.length-1);
      $(id).addClass('thumb-viewing');
      $(id2).removeClass('thumb-viewing');
    }
    comp.setState({
      showing_index:newIndex
    });
  }
  this.goLeft=(comp,e)=>{
    e.preventDefault();
    comp.scrollChecker();
    let index = comp.state.showing_index;
    let newIndex=index;
    // console.log('now on: ',newIndex);
    comp.scrollAlong();
    if(index!==0){
      newIndex = comp.state.showing_index-1;
      // console.log('navigating to: ',newIndex);
      let id='#'+newIndex;
      let id2='#'+(newIndex+1);
      $(id).addClass('thumb-viewing');
      $(id2).removeClass('thumb-viewing');
    }
    else{
      newIndex = comp.state.thumb_photos.length-1;
      // console.log('navigating to: ',newIndex);
      let id='#'+newIndex;
      let id2='#0';
      $(id).addClass('thumb-viewing');
      $(id2).removeClass('thumb-viewing');
    }
    comp.setState({
      showing_index:newIndex
    });
  }
}

module.exports = myScroller;
