var React = require ('react');
var $ = require('jquery');
var axios = require('axios');

function myFunctions(){
  this.keys = {37: 1, 38: 1, 39: 1, 40: 1}

  // this.resizeSlider = (slider,slider_contents,num_boxes) =>{
  //   console.log('resize slider props')
  //     let $slider = $(slider);
  //     let $slider_contents = $(slider_contents);
  //     let width = $slider.width();
  //     let height=$slider.height();
  //     height = height*.75+'px';
  //     width=(width/num_boxes);
  //     let slider_width= width+'px';
  //     let $items = $slider_contents.children('li');
  //     $items.css({'width':slider_width,'height':height});
  //     const ratio = $slider_contents.find('li').length+2;
  //     console.log('ratio: ',ratio);
  //     let new_width = width*ratio+'px';
  //     console.log('new width: ',new_width);
  //     $slider_contents.css('width',new_width);
  // }

  this.testReact=(component,msg)=>{
    component.setState({
      testmsg:msg
    });
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

  this.getAllAgents = (component,url) =>{
    console.log('getting agents in Functions.js')
    axios.get(url).then((response)=>{
      // console.log('axios agents: ',response);
      let agents = response.data;

      let agentinfo = agents.map((agent)=>{
        return {
          email:agent.email,
          name:agent.name,
          headshot_url:agent.headshot_url,
          id:agent.id,
          phone:agent.phone
        }
      });
      let agentindex = Math.random();
      agentindex = agentindex*agentinfo.length;
      agentindex = Math.floor(agentindex);
      let agent = agentinfo[agentindex];
      // console.log('agent: ',agent);
      let agent_email=agent.email;

      component.setState({
        agent,
        agent_email
      });
    }).catch((err)=>{
      console.log('err - ',err);
    });
  }

  this.scrollPhotos = (component,index) =>{
    let photo=index || component.state.showing_index;
    let photos = component.state.big_photos;
    // console.log('photo index: ',photo);
    photo=parseInt(photo);
    photo++;
    if(photo===photos.length){
      photo=0;
    }
    setTimeout(()=>{
      if(component.state.autoscroll===true && component.state.showingpic==false){
      // console.log('incrementing: ',photo);
        // $('.photo-container').css('opacity',0);
        // $('.photo-container-day').css('opacity',1+' !important');
        setTimeout(()=>{
          component.setState({
            showing_index:photo
          });
          // $('.photo-container').css('opacity',1);
        let x = (photo !==0) ? component.scrollAlong(photo-1) : component.scrollAlong(photo);
        if(x ===false){return;}
        let newIndex = photo;
        let id='#'+newIndex;
        let id2= (photo !==0) ? '#'+(component.state.showing_index-1) : '#'+(component.state.thumb_photos.length-1);
        $(id).addClass('thumb-viewing');
        $(id2).removeClass('thumb-viewing');
        component.scrollPhotos();

      },500);
      }else{
        setTimeout(()=>{
            component.scrollPhotos();
        },5000);
      }
    },5000);
  }


}

module.exports = myFunctions;
