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

  this.filterJPEG = (val) =>{
    //filter out all photo URLS that don't contain 'JPG':
    const jpgFilter = new RegExp('.jpg');
    //filter all_big:
    val.image_urls.all_big = val.image_urls.all_big.filter((pic)=>{
      return jpgFilter.test(pic);
    });
    //filter all_thumb:
    val.image_urls.all_thumb = val.image_urls.all_thumb.filter((pic)=>{
      return jpgFilter.test(pic);
    });
    //filter primary_big:
    val.image_urls.primary_big = (!jpgFilter.test(val.image_urls.primary_big)) ? val.image_urls.all_big[0] : val.image_urls.primary_big;
    return val;
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

  this.show_times = () =>{
    return [
      {
        'start':'9:00 AM',
        'end':'9:45 AM'
      },
      {
        'start':'9:30 AM',
        'end':'10:15 AM'
      },
      {
        'start':'10:00 AM',
        'end':'10:45 AM'
      },
      {
        'start':'10:30 AM',
        'end':'11:15 AM'
      },
      {
        'start':'11:00 AM',
        'end':'11:45 AM'
      },
      {
        'start':'11:30 AM',
        'end':'12:15 PM'
      },
      {
        'start':'12:00 PM',
        'end':'12:45 PM'
      },
      {
        'start':'12:30 PM',
        'end':'1:15 PM'
      },
      {
        'start':'1:00 PM',
        'end':'1:45 PM'
      },
      {
        'start':'1:30 PM',
        'end':'2:15 PM'
      },
      {
        'start':'2:00 PM',
        'end':'2:45 PM'
      },
      {
        'start':'2:30 PM',
        'end':'3:15 PM'
      },
      {
        'start':'3:00 PM',
        'end':'3:45 PM'
      },
      {
        'start':'3:30 PM',
        'end':'4:15 PM'
      },
      {
        'start':'4:00 PM',
        'end':'4:45 PM'
      },
      {
        'start':'4:30 PM',
        'end':'5:15 PM'
      },
      {
        'start':'5:00 PM',
        'end':'5:45 PM'
      },
      {
        'start':'5:30 PM',
        'end':'6:15 PM'
      },
      {
        'start':'6:00 PM',
        'end':'6:45 PM'
      },
      {
        'start':'6:30 PM',
        'end':'7:15 PM'
      },
      {
        'start':'7:00 PM',
        'end':'7:45 PM'
      }
    ];
  }


}

module.exports = myFunctions;
