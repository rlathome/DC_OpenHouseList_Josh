import React, { Component } from 'react';
import Days from './Days';
import Neighborhood from './Neighborhood';
import Results from './Results';
import Featured from './Featured';
import Listing from './Listing';
import Header from './Header';
import axios from 'axios';
import jquery from 'jquery';
import Map from './ReactMap';

class Search extends Component{
  constructor(props){
    super(props);
    this.state={
      pressed:false,
      pressed2:false,
      day:'',
      neighborhood:'',
      step:'',
      selected_listing:'',
      last_place:'',
      stored_results:'',
      raw_stored_results:''
    }
  }
  pressed_toggle(e){
    e.preventDefault();
    let $item = jquery(e.target).closest('span');
    if($item.hasClass('btn-pressed')){
      $item.removeClass('btn-pressed');
    }else{
      jquery('.btn-3d').removeClass('btn-pressed');
      $item.addClass('btn-pressed');
    }
  }
  goHome(){
    this.setState({
      step:''
    });
  }
  saturday(e){
    e.preventDefault();
    setTimeout(()=>{
      this.setState({
        last_place:'neighborhoods',
        day:'saturday',
        step:'neighborhoods'
      });
    },250);
    let $item = jquery(e.target).closest('span');
    this.pressed_toggle(e);
  }
  sunday(e){
    e.preventDefault();
    setTimeout(()=>{
      this.setState({
        last_place:'neighborhoods',
        day:'sunday',
        step:'neighborhoods'
      });
    },250);
    let $item = jquery(e.target).closest('span');
    this.pressed_toggle(e);
  }
  selectNeighborhood(e,subd){
    let $item = jquery(e.target).closest('span');
    this.pressed_toggle(e);
    console.log('setting neighborhood: ',subd);
    this.setState({
      neighborhood:subd,
      step:'results',
      last_place:'results'
    });
  }
  arrowToggle(e){
    let $item = jquery(e.target).closest('span');
    this.pressed_toggle(e);
  }
  reload(){
    this.setState({
      step:''
    });
  }
  viewListing(listing){
    console.log('listing to view: ',listing);
    let last_place = this.state.last_place;
    this.setState({
      step:'results',
      last_place,
      selected_listing:listing[0]
    });
    setTimeout(()=>{
      this.setState({
        step:'listing'
      });
    },15);
    window.scrollTo(0,0);
  }
  goBack(place){
    console.log('going back');
    let last_place = this.state.last_place;
    this.setState({
      step:last_place
    });
  }
  setLastPlace(place){
    this.setState({
      last_place:place
    });
  }
  storeResults(results,raw_results){
    this.setState({
      stored_results:results,
      raw_stored_results:raw_results
    });
  }
  skipAhead(){
    this.setState({
      step:'neighborhoods'
    });
  }
  render(){
    let btn_style = 'day-btn btn-3d btn-3d-blue';
    let options;
    let params = {
      day:this.state.day,
      neighborhood:this.state.neighborhood,
      listings:this.state.listings
    }
    let selected_listing = this.state.selected_listing;
    switch(this.state.step){
      case '':
      options = (<Days skipAhead={this.skipAhead.bind(this)} saturday={this.saturday.bind(this)} sunday={this.sunday.bind(this)} pressed_toggle={this.pressed_toggle.bind(this)} />);
      break;
      case 'neighborhoods':
      options = (<Neighborhood selectNeighborhood={this.selectNeighborhood.bind(this)} arrowToggle={this.arrowToggle.bind(this)}/>);
      break;
      case 'results':
      options = (<Results storeResults={this.storeResults.bind(this)} goHome={this.goHome.bind(this)} raw_stored_results={this.state.raw_stored_results} stored_results={this.state.stored_results} viewListing={this.viewListing.bind(this)} params={params}/>);
      break;
      case 'listing':
      options = (<Listing goBack={this.goBack.bind(this)} listing={selected_listing}/>);
      break;
    }
    let neighborhood = this.state.neighborhood.toUpperCase();
    let day = this.state.day.toUpperCase();
    return(
      <div>

          <Header day={day} neighborhood={neighborhood} reload={this.reload.bind(this)}/>
          <div className="wrapper">

            {/* <Map /> */}
              { options }
              {/* <Days saturday={this.saturday.bind(this)} sunday={this.sunday.bind(this)} pressed_toggle={this.pressed_toggle.bind(this)} /> */}
            <Featured last_place={this.props.last_place} setLastPlace={this.setLastPlace.bind(this)} viewListing={this.viewListing.bind(this)}/>
            <footer>
              <div className="footer-info">
                <span className='logo-contain'>
                  <img className="footer-logo" src={require('../images/rlah_logo-11-01.png')} alt="logo" />
                </span>
                <span className="footer-divider"> | </span>
                <span className='logo-text'>
                  IS A LOCALLY OWNED AND OPERATED FRANCHISE. REAL LIVING REAL ESTATE IS A NETWORK BRAND OF HSF
                  AFFILIATES LLC, WHICH IS MAJORITY OWNED BY HOME SERVICES OF AMERICA, INC. A BERKSHIRE HATHAWAY AFFILIATE.
                </span>
              </div>
            </footer>
          </div>
      </div>
    );
  }
}

export default Search;
