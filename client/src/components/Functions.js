var $ = require('jquery');

function myFunctions(){
  this.keys = {37: 1, 38: 1, 39: 1, 40: 1}

  this.resizeSlider = () =>{
      let width = $('.onPage').width();
      console.log('width change')
      let height=$('.onPage').height();
      console.log('height: ',height);
      height = height*.75+'px';
      width=(width/3);
      let slider_width= width+'px';
      $('.slider-contents li').css({'width':slider_width,'height':height});
      const ratio = $('.slider-contents').children().length+2;
      let new_width = width*ratio+'px';
      console.log('new width: ',new_width);
      $('.slider-contents').css('width',new_width);
  }


  this.preventDefault = (e) =>{
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
  }

  this.preventDefaultForScrollKeys = (e) =>{
      if (this.keys[e.keyCode]) {
          this.preventDefault(e);
          return false;
      }
  }

  this.disableScroll = () =>{
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', this.preventDefault, false);
    window.onwheel = this.preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
    window.ontouchmove  = this.preventDefault; // mobile
    document.onkeydown  = this.preventDefaultForScrollKeys;
  }

  this.enableScroll = () =>{
      if (window.removeEventListener)
          window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
      window.onmousewheel = document.onmousewheel = null;
      window.onwheel = null;
      window.ontouchmove = null;
      document.onkeydown = null;
  }


}

module.exports = myFunctions;
