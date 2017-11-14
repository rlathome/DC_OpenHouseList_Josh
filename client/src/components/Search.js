import React, { Component } from 'react';
import { hashHistory } from 'react-router';
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
  componentWillMount(){
    let day = (this.props.params.day !=='none') ? this.props.params.day : '';
    console.log('chosen day: ',day);
    let neighborhood = (this.props.params.neighborhood !=='none') ? this.props.params.neighborhood : '';
    console.log('chosen neighborhood: ',neighborhood);
    if(day && neighborhood){
      this.setState({
        step:'results',
        day,
        neighborhood
      })
    }else if(day && !neighborhood){
      this.setState({
        step:'neighborhoods',
        day
      })
    }

  }
  pressed_toggle(e){
    e.preventDefault();
    let $item = jquery(e.target).closest('.btn-3d');
    if($item.hasClass('btn-pressed')){
      $item.removeClass('btn-pressed');
    }else{
      jquery('.btn-3d').removeClass('btn-pressed');
      $item.addClass('btn-pressed');
    }
  }
  goHome(){
    // this.setState({
    //   step:''
    // });
    // hashHistory.push('/');
    this.reload();
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
    let $item = jquery(e.target).closest('.day-btn');
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
    hashHistory.push('/search/'+this.state.day+'/'+subd);
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
      step:'',
      day:'',
      neighborhood:''
    });
    hashHistory.push('/');
  }

  viewListing(listing){
    console.log('listing to view: ',listing);
    let day = (this.state.day !=='') ? this.state.day : 'none';
    let neighborhood = (this.state.neighborhood) ? this.state.neighborhood : 'none';
    listing = listing[0].mls_number;
    hashHistory.push('/listing/'+listing+'/'+day+'/'+neighborhood);
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
      step:'neighborhoods',
      day:'none'
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
    let neighborhood = this.state.neighborhood;
    let day = this.state.day.toUpperCase();

    let subd = '';

    switch(neighborhood){
      case 'FullDCArea':
      subd='Full DC Area';
      break;
      case 'adamsmorgan':
      subd='Adams Morgan';
      break;
      case 'anacostia':
      subd='Anacostia';
      break;
      case 'brookland':
      subd='Brookland';
      break;
      case 'capitolhill':
      subd='Capitol Hill';
      break;
      case 'columbiaheights':
      subd='Columbia Heights';
      break;
      case 'deanwood':
      subd='Deanwood';
      break;
      case 'dupontcircle':
      subd='Dupont Circle';
      break;
      case 'eckington':
      subd='Eckington';
      break;
      case 'friendshipheights':
      subd='Friendship Heights';
      break;
      case 'georgetown':
      subd='Georgetown';
      break;
      case 'logancircle':
      subd='Logan Circle';
      break;
      case 'petworth':
      subd='Petworth';
      break;
      case 'southwestwaterfront':
      subd='Southwest Waterfront';
      break;
      case 'woodleypark':
      subd='Woodley Park';
      break;
      case 'clevelandpark':
      subd='Cleveland Park';
      break;
      case 'foggybottom':
      subd='Foggy Bottom';
      break;
      case 'ne':
      subd='Northeast DC';
      break;
      case 'nw':
      subd='Northwest DC';
      break;
      case 'se':
      subd='Southeast DC';
      break;
      case 'sw':
      subd='Southwest DC';
      break;
      case 'westend':
      subd='Westend';
      break;
      default:
      subd=''
    }
    subd = subd.toUpperCase();
    return(
      <div>
          <Header day={day} neighborhood={subd} reload={this.reload.bind(this)}/>
          <div className="wrapper">
              { options }
            <Featured last_place={this.props.last_place} day={this.state.day} neighborhood={subd} setLastPlace={this.setLastPlace.bind(this)} viewListing={this.viewListing.bind(this)}/>
          </div>
      </div>
    );
  }
}

export default Search;
