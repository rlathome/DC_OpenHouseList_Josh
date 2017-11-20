import React, { Component } from 'react';
import ListingMap from './ListingMap';
import Header from './Header';
import axios from 'axios';
import { hashHistory } from 'react-router';
import currency from 'currency-formatter';
import $ from 'jquery';
import moment from 'moment';
// let apiKey = (process.env.REACT_APP_STATUS == 'development') ? "http://localhost:8080" : "http://vast-shore-14133.herokuapp.com";

// let apiKey = "http://localhost:8080";

let apiKey="http://www.dcopenhouselist.com";

// let apiKey="https://dcopenhouselist.herokuapp.com";

console.log('listingjs env: ',process.env.REACT_APP_STATUS);

class Listing extends Component{
  constructor(props){
    super(props);
    this.state={
      listing:'',
      showing:'',
      thumb_photos:[],
      big_photos:[],
      showing_index:0,
      showing_modal:false,
      day:'',
      submitted_email:false,
      inapp:false,
      autoscroll:true,
      showingpic:false,
      agents:'',
      stored:''
    }
  }
  componentWillMount(){

    this.getAllAgents();
    let mls=(this.props.params) ? this.props.params.mls : '';
    let day=(this.props.params) ? this.props.params.day : '';
    let neighborhood=(this.props.params) ? this.props.params.neighborhood : '';
    if(day && neighborhood){
      this.setState({
        day,
        neighborhood
      });
    }
    window.scrollTo(0,0);
        // console.log('axios: ',this.props.listing);
        // let listing = this.props.listing
    if(mls){
      axios.get(apiKey + '/info/listing/'+mls).then(
      (listing)=>{
        console.log('listing axios: ',listing);
        listing = (listing.data.results) ? listing.data.results[0] : '';
        let showing = (listing) ? listing.image_urls.all_big[0] : '';
        let showing_index = 0;
        let style = {
          backgroundImage:'url('+showing+')',
          backgroundPosition:'left',
          backgroundSize:'cover',
          overlap:'hidden'
        }

        showing = (
          <div style={style} className="photo-container"></div>
        )
        let index=-1;
        let thumb_photos = (listing) ? listing.image_urls.all_thumb.map((pic)=>{
          // console.log('thumb pic: ',pic);
          let style = {
            backgroundImage:'url('+pic+')',
            backgroundPosition:'center',
            backgroundSize:'cover',
            overlap:'hidden',
            borderRight:'4px solid #000'
          }
          index++;
          let showing = (index===0) ? 'thumb-viewing' : '';
          let thumb_class = 'thumb-photo-container '+showing;
          return(
            <div key={index} onClick={this.showPic.bind(this)} id={index} style={style} className={thumb_class}>

            </div>
          );
        }) : '';
        let big_photos = (listing) ? listing.image_urls.all_big : '';

        this.setState({
          showing,
          showing_index,
          thumb_photos,
          big_photos,
          listing
        });

        this.scrollPhotos();

      });
    }
  }

  getAllAgents(){
    let url=apiKey+"/info/getallagents";
    axios.get(url).then((response)=>{
      console.log('axios agents: ',response);
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
      console.log('agent: ',agent);
      let agent_email=agent.email;

      this.setState({
        agent,
        agent_email
      });
    }).catch((err)=>{
      console.log('err - ',err);
    });


  }
  scrollPhotos(index){
      let photo=index || this.state.showing_index;
      let photos = this.state.big_photos;
      console.log('photo index: ',photo);
      photo=parseInt(photo);
      photo++;
      if(photo===photos.length){
        photo=0;
      }
      setTimeout(()=>{
        if(this.state.autoscroll===true && this.state.showingpic==false){
        console.log('incrementing: ',photo);
          // $('.photo-container').css('opacity',0);
          // $('.photo-container-day').css('opacity',1+' !important');
          setTimeout(()=>{
            this.setState({
              showing_index:photo
            });
            // $('.photo-container').css('opacity',1);
          let x = (photo !==0) ? this.scrollAlong(photo-1) : this.scrollAlong(photo);
          if(x ===false){return;}
          let newIndex = photo;
          let id='#'+newIndex;
          let id2= (photo !==0) ? '#'+(this.state.showing_index-1) : '#'+(this.state.thumb_photos.length-1);
          $(id).addClass('thumb-viewing');
          $(id2).removeClass('thumb-viewing');
          this.scrollPhotos();

        },500);
        }else{
          setTimeout(()=>{
              this.scrollPhotos();
          },5000);
        }
      },5000);
  }
  scrollChecker(){
    this.setState({
      autoscroll:false,
      showingpic:true
    });
    setTimeout(()=>{
      this.setState({
        showingpic:false
      });
      if(this.state.autoscroll===false){
        this.setState({
          autoscroll:true
        });
      }
    },5000);
  }
  showPic(e){
    this.scrollChecker();
    // e.preventDefault();
    // console.log("showing: ",e.target.id);
    let newIndex = e.target.id;
    let id='#'+newIndex;
    let id2='#'+this.state.showing_index;
    $(id).addClass('thumb-viewing');
    $(id2).removeClass('thumb-viewing');

    this.setState({
      showing_index:parseInt(e.target.id)
    });
    $('.photo-container').css('opacity',1);
  }
  componentDidMount(){
    let id2='#'+this.state.showing_index;
    $(id2).addClass('thumb-viewing');
    setTimeout(()=>{
      $('.listing-specs').css('width','100%');
      $('.listing-specs div').css('opacity','1');
    },10);
  }
  scrollAlong(index){
    let idx = index || this.state.showing_index;
    let pic = $('#'+idx);
    let width = pic.width();
    let off = pic.offset();
    let scroller_width = $('.scroller').width();
    let scroller_pos = $('.scroller').position();
    if(!scroller_pos){
      return false;
    }
    let scroller_right_offset = scroller_pos.left+scroller_width;
    let scroller_left_offset = scroller_pos.left;
    let pic_offset_left = (off) ? off.left : 0;
    let pic_abs_left = pic.position().left;
    let num_pics = scroller_width/width;

    //SCROLL RIGHT:
    if(pic_offset_left+width>scroller_right_offset-width){
      console.log('passed! ',(pic_offset_left+width));
      $('.scroller').scrollLeft(pic_abs_left-((num_pics-2)*width));
    }
    //SCROLL LEFT:
    if(pic_offset_left-width<scroller_left_offset){
      console.log('passed!');
      $('.scroller').scrollLeft(pic_abs_left-width);
    }
  }
  goRight(e){
    e.preventDefault();
    this.scrollChecker();
    let index = this.state.showing_index;
    let newIndex=index;
    this.scrollAlong();
    console.log('now on: ',newIndex);
    if(index!==this.state.thumb_photos.length-1){
      newIndex = this.state.showing_index+1;
      console.log('navigating to: ',newIndex);
      let id='#'+newIndex;
      let id2='#'+(newIndex-1);
      $(id).addClass('thumb-viewing');
      $(id2).removeClass('thumb-viewing');
    }else{
      newIndex = 0;
      console.log('navigating to: ',newIndex);
      let id='#'+newIndex;
      let id2='#'+(newIndex.length-1);
      $(id).addClass('thumb-viewing');
      $(id2).removeClass('thumb-viewing');
    }
    this.setState({
      showing_index:newIndex
    });
  }
  goLeft(e){
    e.preventDefault();
    this.scrollChecker();
    let index = this.state.showing_index;
    let newIndex=index;
    console.log('now on: ',newIndex);
    this.scrollAlong();
    if(index!==0){
      newIndex = this.state.showing_index-1;
      console.log('navigating to: ',newIndex);
      let id='#'+newIndex;
      let id2='#'+(newIndex+1);
      $(id).addClass('thumb-viewing');
      $(id2).removeClass('thumb-viewing');
    }
    else{
      newIndex = this.state.thumb_photos.length-1;
      console.log('navigating to: ',newIndex);
      let id='#'+newIndex;
      let id2='#0';
      $(id).addClass('thumb-viewing');
      $(id2).removeClass('thumb-viewing');
    }
    this.setState({
      showing_index:newIndex
    });
  }
  submitForm(e){
    e.preventDefault();
    let first = this.refs.first_name.value;
    let last = this.refs.last_name.value;
    let email = this.refs.email.value;
    let phone = this.refs.phone.value;
    let textarea = this.refs.textarea.value;
    let agent_email = this.state.agent_email;
    let mls = this.props.params.mls;
    console.log('submitting: ',first,last,email,textarea);
    //FILTER FOR SCRIPTING ATTACKS:
    //CODE HERE
    if(this.refs.hidden.val !==undefined){
      console.log('bot');
      return;
    }
    if(first==='' || last==='' || email===''){
      alert('Please fill required fields.');
      return;
    }
    let data = {
      first,
      last,
      email,
      agent_email,
      mls,
      phone,
      textarea
    }
    axios.post(apiKey + '/info/submitform',data).then((response)=>{
      console.log('successfully submitted',response);
      if(response.data.message === "Queued. Thank you."){

        //show modal
        this.setState({
          submitted_email:true
        });

        //clear form
        this.refs.first_name.value = '';
        this.refs.last_name.value = '';
        this.refs.email.value = '';
        this.refs.phone.value = '';
        this.refs.textarea.value = '';

        //hide modal
        setTimeout(()=>{
          this.setState({
            submitted_email:false
          });
        },2000);
      }
    }).catch((err)=>{
      console.log('err - ',err);
    });
  }
  navigateBack(){
    // this.props.goBack();
    if(this.state.day !=='none' && this.state.neighborhood !=='none'){
      hashHistory.push('/search/'+this.state.day+'/'+this.state.neighborhood);
    }else if(this.state.day !=='none' && this.state.neighborhood === 'none'){
      hashHistory.push('/search/'+this.state.day+'/none');
    }else{
      hashHistory.push('/');
    }
  }

  //large view of listing photos:
  showing_modal(){
    console.log('showing');
    this.setState({showing_modal:true})
  }
  showing_modal_off(){
    this.setState({showing_modal:false})
  }
  reload(){
    hashHistory.push('/');
  }
  render(){
    let showing=this.state.showing;
    let listing=this.state.listing;
    // console.log('listing to display: ',listing);
    let subdivision=(listing) ? listing.subdivision : '';
    let price = (listing) ? listing.list_price : '';
    subdivision=subdivision.toLowerCase();
    subdivision = subdivision.replace(/\b\w/g, l => l.toUpperCase());
    let showing_index = this.state.showing_index;
    let thumb_photos=this.state.thumb_photos;
    let big_photos=this.state.big_photos;

    let is_vert = false;
    let pic_image = document.createElement('img');
    pic_image.src=big_photos[showing_index];
    console.log('pic height: ',pic_image.height);
    if(pic_image.height>pic_image.width){
      console.log('vertical!!!');
      is_vert = true;
    }
    let pic_size = (is_vert) ? 'contain' : 'cover';
    let pic_pos = (is_vert) ? 'center' : 'left';
    let showing_image = {
      backgroundImage:'url('+big_photos[showing_index]+')',
      backgroundRepeat:'no-repeat',
      backgroundPosition:pic_pos,
      backgroundSize:pic_size,
      overlap:'hidden'
    }
    let date = (listing.open_house_events && listing.open_house_events.length > 0) ? moment(listing.open_house_events[0].event_start) : '';
    let date2 = (listing.open_house_events && listing.open_house_events.length > 0) ? moment(listing.open_house_events[0].event_end) : '';
    let time = (date) ? date.format('h') : '';
    let time2 = (date2) ? ' - '+date2.format('hA') : '';

    let event_start = (listing.open_house_events && listing.open_house_events.length > 0) ? listing.open_house_events[0].event_start : '';
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let dow = moment(event_start).day();
    dow = days[dow];
    console.log('open house is on: ',dow);
    dow = (dow) ? 'Open '+dow : '';
    showing = (
      <div style={showing_image} className="photo-container">
        <div className="photo-container-day">{dow} {time} {time2}</div>
      </div>
    )
    //FULLSCREEN IMAGES
    let showing_modal = (this.state.showing_modal) ? (
      <div className="showing-modal">
          <div className="sm_opacity"></div>
          <div onClick={this.goLeft.bind(this)} className="arrow arrow-left fa fa-arrow-left"></div>
          <div onClick={this.goRight.bind(this)} className="arrow arrow-right fa fa-arrow-right"></div>
          <img className="showing-modal-image image-responsive" src={big_photos[showing_index]} alt="listing"/>
          <i className="glyphicon glyphicon-resize-small" onClick={this.showing_modal_off.bind(this)}></i>
      </div>
    ) : '';

    let comments = (listing) ? listing.internet_remarks : '';
    let listing_bedrooms = (listing) ? listing.num_bedrooms : '';
    let halfbaths = (listing && listing.half_baths) ? '/'+listing.half_baths : '';
    //LISTING SPECS:
    let bed_img = (listing) ? (
      <div className="listing-beds">
        <div>{listing_bedrooms}</div>
        <img className="listing-emoji" src={require('../images/bed.svg')} alt="bed" />
      </div>
    ) : '';
    let bath_img = (listing) ? (
      <div className="listing-baths">
        <div>{listing.full_baths}{halfbaths}</div>
        <img className="listing-emoji" src={require('../images/bath.svg')} alt="bath" />
      </div>
    ) : '';

    let sq_ft = (listing && listing.square_feet > 0) ? (<span className="sqFt">{listing.square_feet}&nbsp;sq ft</span>): (<span>Built: {listing.year_built}</span>);
    price = (listing) ? currency.format(listing.list_price,{ code: 'USD', decimalDigits: 0 }): '';
    price = (listing) ? price.slice(0,price.length-3): '';
    price = (listing) ? (<span className="listing-price-emoji">{price}</span>) : '';
    let stories = (listing) ? (<div>{listing.stories}&nbsp;story</div>) : '';
    // let built = (listing) ? ( <div>Built:&nbsp;{listing.year_built}</div> ): '';
    let built = (listing.square_feet > 0) ? ( <div>Built:&nbsp;{listing.year_built}</div> ):(<span className="sqFt">Sq ft unknown</span>);
    let subd = ( <div>Subdivision:&nbsp;{ subdivision }</div> );
    let dom = (listing) ? ( <div>{listing.cdom}&nbsp;days on the market</div> ): '';
    let dir;
    switch(listing.street_pre_direction){
      case 'Northwest':
      dir = 'NW';
      break;
      case 'Southwest':
      dir = 'SW';
      break;
      case 'Souteast':
      dir = 'SE';
      break;
      case 'Northeast':
      dir = 'NE';
      break;
      default:
      dir = '';
    };
    let st_address = (listing) ? (<div>{listing.street_number}&nbsp;{listing.street_name}&nbsp;{listing.street_post_dir} {dir}</div>) : '';
    let lng = (listing) ? parseFloat(listing.longitude) : '';
    let lat = (listing) ? parseFloat(listing.latitude) : '';
    let floor_type = (listing) ? listing.floor : '';
    let flooring = (floor_type !=='') ? (<div>Flooring:&nbsp;{ floor_type }</div>) : '';
    let marker = {
      title:'listing',
      position: {lat: lat, lng: lng}
    };
    let center = {lat:lat,lng:lng};
    let map = (listing) ? (
      <ListingMap center={center} listing_marker={marker}/>
    ) : '';
    let mls = (listing) ? (
      <div>MLS #:&nbsp;{(listing) ? listing.mls_number : ''}</div>
    ) : '';
    let parking = (listing.parking_spaces) ? (<div>Parking spaces-&nbsp;{(listing) ? listing.parking_spaces || listing.garage_spaces : ''}</div>) : '';

    //EMAIL SUBMIT MODAL
    let submit_modal = (this.state.submitted_email) ? (
      <div className="submit_modal">
        <div className="submit_message rounded">
          <div>We'll be in touch shortly!</div>
          <img src="../images/DC_open House_sm-10.svg" alt='rlah logo' />
        </div>
      </div>
    ) : '';

    let agent = (this.state.agent) ? this.state.agent : '';

    let listing_agent_column = (agent) ? (
      <div className="row listing-agent-column">
        <div className="agent-photo-holder col-lg-12 col-md-6 col-sm-6 pull-right">
          <img src={agent.headshot_url} className="image-responsive" alt="Agent" />
        </div>
        <div className="col-lg-12 col-md-6 col-sm-6">
          <div><h3>{agent.name}</h3></div>
          <div>11 Dupont Circle NW, Ste 650</div>
          <div>Washington, DC 20036</div>
          <div>Phone: {agent.phone}</div>
          <div>Email: <a ref="agent_email" href={agent.email} alt='agent email'>{agent.email}</a></div>
        </div>
      </div>
    ) : '';

    return (
      <div>
      <Header reload={this.reload.bind(this)}/>
      <div className="wrapper listing-page">
        {showing_modal}
        {submit_modal}
        <div className="listing-header row rounded">
          <div className="listing-address">
            { st_address }
            <div>{(listing) ? listing.city : ''},&nbsp;{(listing) ? listing.state : ''}&nbsp;{(listing) ? listing.zip : ''}</div>
          </div>
          <div className="listing-header-specs">
            { price }  { bed_img }  { bath_img }  {sq_ft}
          </div>
          <div onClick={this.navigateBack.bind(this)} className="back-button rounded">
            Back
          </div>
        </div>
        <div className="listing-section">
          <div className="listing-section-wrapper row">
            <div className="listing-column col-md-8 col-lg-6">
              <div className="photos-map-column">
                <div className="listing-photos rounded">
                  <div className="photo-viewer">
                    <div className="full-screen-icon hidden-xs">
                      <i onClick={this.showing_modal.bind(this)} className="glyphicon glyphicon-fullscreen"></i>
                    </div>
                    {/* <img src={this.state.showing} alt="listing photo" /> */}
                    {showing}
                    <div onClick={this.goLeft.bind(this)} className="arrow arrow-left fa fa-arrow-left"></div>
                    <div onClick={this.goRight.bind(this)} className="arrow arrow-right fa fa-arrow-right"></div>
                  </div>
                  <div className="scroller">
                    <div className="photo-carousel">
                      <div className="photo-carousel-interior">
                        {thumb_photos}
                      </div>
                    </div>
                  </div>

                </div>
                <div className="listing-description">
                  <div className="listing-comments">{ comments }</div>
                  <div className="office">Courtesy of:&nbsp;{(listing) ? listing.listing_office_name : ''}</div>
                </div>
                <div className="listing-map">{map}</div>
              </div>
            </div>
            <div className="listing-column2 col-md-4 col-lg-6">
              <div className="specs-form-column">
                <div className="listing-specs rounded clearfix">


                  <div className="specs-2">
                    <div className="specs-text">{ subd }</div>
                    <div className="specs-text">{ flooring }</div>
                    <div className="specs-text">{ dom }</div>
                    <div className="specs-text">{ mls }</div>
                  </div>
                  <div className="specs-1">
                    <div className="specs-text">{ stories }</div>
                    <div className="specs-text">{ (listing) ? listing.property_type : '' }&nbsp;{ (listing) ? listing.property_sub_type : '' }</div>
                    <div className="specs-text">{ built }</div>
                    <div className="specs-text">{parking}</div>
                  </div>
                </div>
                <div className="listing-form-column row">
                  <div className="listing-form col-lg-8">
                    <div className="listing-form-header">
                      Ask a Question
                      <div className="listing-form-header-quote">"We'll respond quickly!"</div>
                    </div>
                    <form className="form form-default" onSubmit={this.submitForm.bind(this)}>
                      <div className="form-column">
                        <input className="form-control required" ref="first_name" placeholder="First Name"/>
                        <input className="form-control required" ref="last_name" placeholder="Last Name"/>
                      </div>
                      <div className="form-column">
                        <input className="form-control required" ref="email" placeholder="E-mail"/>
                        <input className="form-control" ref="phone" placeholder="Phone"/>
                      </div>
                      <textarea className="form-control" ref="textarea" placeholder = "What can we do for you?"/>
                      <input ref="hidden" className="hidden" />
                      <input className="btn btn-primary" type="submit" value="Submit"/>
                    </form>
                  </div>
                  <div className="listing-agent-photo col-lg-4">
                    { listing_agent_column }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default Listing;
