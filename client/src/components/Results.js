import React, { Component } from 'react';
// import Map from './Map';
import jquery from 'jquery';
import axios from 'axios';
import currency from 'currency-formatter';
import moment from 'moment';
import { hashHistory } from 'react-router';
// import _ from "lodash";
import ReactMap from './ReactMap';
let myFunctions = require('./js/Functions.js');
let Functions = new myFunctions();
// let apiKey = (process.env.REACT_APP_STATUS == 'development') ? "http://localhost:8080" : "http://vast-shore-14133.herokuapp.com";

// let apiKey="https://dcopenhouselist.herokuapp.com";

// let apiKey = "http://localhost:8080";

let apiKey="http://www.dcopenhouselist.com";

class Results extends Component{
  constructor(props){
    super(props);
    this.state={
      find_out:false,
      results:'',
      display:'loading',
      selected_listings:'',
      dropdown:false,
      selected:'SORT BY',
      popup:false,
      sorting_spec:'',
      sort_order:'ascending',
      markers: '',
      neighborhood:'',
      cache:[],
      listings_shown:'',
      listings_remaining:'',
      updated:false,
      pages:{0:[]}
    }
  }
  componentWillMount(){
    // console.log('mounting results');
    let results;
    let params = this.props.params;
    // console.log('params: ',params);
    let neighborhood = (params) ? params.neighborhood : '';
    // console.log('neighborhood in cwm: ',neighborhood);
    let stored_results = this.props.global_listings;
    let i = (stored_results) ? true: false;
    // console.log('app has stored results: ',i, ', ',stored_results, ', and raw results: ',this.state.results);
    let timestamp = moment();
    timestamp = timestamp.format('YYYY M MM d dd h hh');
    // console.log('timestamp: ',stored_results.timestamp);
    if(i==false && stored_results.timestamp !== timestamp){
      axios.get(apiKey + '/info/open_houses').then(
      (response)=>{


        response = response.data.filter((val)=>{
          return val !==null;
        });

        response = response.map((val) => Functions.filterJPEG(val));
        console.log('FILTERED AXIOS RESULTS: ',response);
        this.props.storeResults({
          results,
          markers:response,
          neighborhood,
          cache:response,
          timestamp
        });
        this.setState({
          results,
          markers:response,
          neighborhood,
          cache:response,
          display:this.props.params.view
        });
      }).catch((err)=>{
        // console.log('error -',err);
        let exception = new RegExp('quota');
        if(exception.test(err)){
          // console.log('full storage!!');
          localStorage.clear();
          // this.componentWillMount();
        }
        hashHistory.push('/');
      });
    }else{
      // console.log('setting previous markers: ',this.props.params.view,' and ',stored_results.markers);
      // let listings_remaining = stored_results.slice(10,markers.length);
      // let listings_shown = stored_results.slice(0,10);
      // if(!stored){
        this.setState({
          results:stored_results.results,
          markers:stored_results.markers,
          cache:stored_results.cache,
          neighborhood:neighborhood,
          display:this.props.params.view
        });
      // }
      if(this.props.params.view==='list'){
        setTimeout(()=>{jquery('.list-view').addClass('list-btn-pressed');},50);
      }else{
        setTimeout(()=>{jquery('.map-view').addClass('list-btn-pressed');},50);
      }
    }

    // if(stored){
    //   stored = stored.concat(stored1);
    //   // // console.log('stored listings: ', JSON.parse(stored));
    //   stored = JSON.parse(stored);
    //   this.props.storeResults(markers,results);
    //   this.setState({
    //     results,
    //     markers:stored,
    //     neighborhood,
    //     cache:stored,
    //     display:'list'
    //   });
    // }
}

  componentDidUpdate(){
    if(this.state.display === 'map'){
      jquery('.map-view').addClass('map-btn-pressed');
    }
    if(this.state.display ==='list'){
      jquery('.list-view').addClass('list-btn-pressed');
    }
  }
  arrowToggle(e){
    this.pressed_toggle(e);
    setTimeout(()=>{
      this.props.goHome();
    },500);
  }
  removePressedClass(){
    jquery('.btn-3d').removeClass('list-btn-pressed');
    jquery('.btn-3d').removeClass('map-btn-pressed');
  }
  pressed_toggle(e){
    e.preventDefault();
    let $item = jquery(e.target).closest('a');
    if($item.hasClass('btn-pressed')){
      $item.removeClass('btn-pressed');
    }else{
      // this.removeClass();
      $item.addClass('btn-pressed');
    }
  }
  listToggle(e){
    e.preventDefault();
    let $item = jquery(e.target).closest('a');
    if($item.hasClass('list-btn-pressed')){
      $item.removeClass('list-btn-pressed');
    }else{
      this.removePressedClass();
      $item.addClass('list-btn-pressed');
    }
    this.setState({
      display:'list'
    });
    hashHistory.push('/search/'+this.props.params.day+'/'+this.props.params.neighborhood+'/list');
  }
  mapBtnToggle(e){
    e.preventDefault();
    let $item = jquery(e.target).closest('a');
    if($item.hasClass('map-btn-pressed')){
      // console.log('item has the class');
      this.removePressedClass();
      $item.removeClass('map-btn-pressed');
    }else{
      // console.log('item doesnt have class');
      this.removePressedClass();
      $item.addClass('map-btn-pressed');
    }
    this.removePressedClass();
    this.setState({
      display:'map'
    });
    hashHistory.push('/search/'+this.props.params.day+'/'+this.props.params.neighborhood+'/map');
  }
  downBtnToggle(e){
    e.preventDefault();
    let $item = jquery(e.target).closest('a');
    if($item.hasClass('down-btn-pressed')){
      $item.removeClass('down-btn-pressed');
    }else{
      // this.removeClass();
      $item.addClass('down-btn-pressed');
    }
    this.setState({
      dropdown: !this.state.dropdown
    });
  }
  highlight(e){
    let index = '#'+e.target.id;
    jquery(index).addClass('highlighted');
  }
  highlight_off(e){
    let index = '#'+e.target.id;
    jquery(index).removeClass('highlighted');
  }
  viewTabListing(e){
    e.preventDefault();
    let id = e.target.id;
    // console.log('tab listing: ',id);
    if(id==='pause'){
      return;
    }
    this.viewListing(id);
  }
  viewListing(listing){
    let view = this.state.markers.filter((val)=>{
      // // console.log('marker: ',val.id, 'listing: ',listing);
      let list = parseInt(listing);
      return val.id == list;
    });
    // console.log('viewing the listing: ',view);
    this.props.viewListing(view,this.state.display);
  }
  sortTime(e){
    let $item = jquery('#down');
    $item.removeClass('down-btn-pressed');
    this.setState({
      dropdown: false
    });
    let listings = this.state.markers;
    let sortObjects = [];
    let sortedObjects = [];
    let results = [];
    listings.forEach((listing)=>{
      let result = {
        id:listing.id,
        time:listing.open_house_events[0].event_start
      }
      sortObjects.push(result);
    });
    // console.log('sort objects: ',sortObjects);
    //////////////
    // var times = document.getElementsByClassName("test-moment");

    var unsorted_times = new Array();
    // console.log("Converting");
    for(var i = 0; i < sortObjects.length; i++) {
      var moment_date = moment(sortObjects[i].time);
      var unsorted_time = {};
      unsorted_time.time = sortObjects[i].time;
      unsorted_time.id = sortObjects[i].id;
      unsorted_time.milli = moment_date.valueOf();
      unsorted_times.push(unsorted_time);
    }

    // Sort the times:
    unsorted_times.sort(compareMilli);
    let base_time = unsorted_times[0].milli;

    // take out all dates happening in the future:
    // base_time = parseInt(base_time/(1000*60*60));
    // // console.log('base time: ',base_time);
    // unsorted_times = unsorted_times.filter((time)=>{
    //   return (time.milli/(1000*60*60))-base_time<24;
    // });
    //**

    unsorted_times.forEach((time)=>{
      sortObjects.forEach((val)=>{
        if(val.id===time.id){
          sortedObjects.push(time);
        }
      });
    });
    // console.log('sorted times: ',unsorted_times);
    // console.log('sorted objects: ',sortedObjects);
    sortedObjects.forEach((time)=>{
      listings.forEach((val)=>{
        if(val.id===time.id){
          results.push(val);
        }
      });
    });
    if(this.state.sort_order==='ascending'){
      results.reverse();
    }
    this.setState({
      markers:results,
      sorting_spec:'time'
    });

    // Compare dates to sort
    function compareMilli(a,b) {
    	if(a.milli < b.milli) return -1;
    	if(a.milli > b.milli) return 1;
    	return 0;
    }
    ///////////////
  }
  sortTimeDesc(){
    this.setState({
      // sorting_spec:'time',
      sort_order:'descending'
    })
    setTimeout(()=>{this.sortTime();},15);
    // this.sortDesc();
  }
  sortTimeAsc(){
    this.setState({
      // sorting_spec:'time',
      sort_order:'ascending'
    })
    setTimeout(()=>{this.sortTime();},15);
    // this.sortAsc();
  }
  sortPrice(e){
    e.preventDefault();
    let $item = jquery('.results-option');

    $item.removeClass('down-btn-pressed');
    jquery('.list-view').addClass('list-btn-pressed');
    this.setState({
      dropdown: false,
      display:'loading'
    });
    if(this.state.markers){
      this.orderByPrice();
    }
  }
  unPress(){
    let $item = jquery('#down');
    $item.removeClass('down-btn-pressed');
  }
  sortByPrice(){
    this.unPress();
    this.setState({
      dropdown: false,
      sorting_spec:'price'
    });
    this.orderByPrice();
  }
  sortByPriceDesc(){
    this.unPress();
    this.setState({
      dropdown: false,
      sorting_spec:'price'
    });
    this.orderByPriceDesc();
  }
  orderByPrice(){
    let listings = this.state.markers;
    listings.sort((a,b)=>{
      return a.list_price - b.list_price
    })
    listings.forEach((val)=>{
      // console.log(val.list_price);
    });
    // console.log('price results: ',listings);
    // if(this.state.sort_order=="ascending"){
    //   listings.reverse();
    // }
    this.setState({
      markers:listings,
      sort_order:'descending'
    });
  }
  orderByPriceDesc(){
    let listings = this.state.markers;
    listings.sort((a,b)=>{
      return a.list_price - b.list_price
    })
    listings.forEach((val)=>{
      // console.log(val.list_price);
    });
    // console.log('price results: ',listings);
      listings.reverse();
    this.setState({
      markers:listings,
      sort_order:'ascending'
    });
  }
  sortBedAsc(){
    this.unPress();
    let listings = this.state.markers;
    listings.sort((a,b)=>{
      return a.num_bedrooms - b.num_bedrooms
    })
    listings.forEach((val)=>{
      // console.log('beds: ',val.num_bedrooms);
    });
    // console.log('bed results: ',listings);
      // listings.reverse();
    this.setState({
      markers:listings,
      sort_order:'ascending',
      sorting_spec:'beds',
      dropdown:false
    });
  }
  sortBedDesc(){
    this.unPress();
    let listings = this.state.markers;
    listings.sort((a,b)=>{
      return a.num_bedrooms - b.num_bedrooms
    })
    listings.forEach((val)=>{
      // console.log('beds: ',val.num_bedrooms);
    });
    // console.log('bed results: ',listings);
      listings.reverse();
    this.setState({
      markers:listings,
      sort_order:'ascending',
      sorting_spec:'beds',
      dropdown:false
    });
  }
  sortBathAsc(){
    this.unPress();
    let listings = this.state.markers;
    listings.sort((a,b)=>{
      return (a.full_baths+a.half_baths)-(b.full_baths+b.half_baths);
    })
    listings.forEach((val)=>{
      // console.log('baths: ',val.full_baths+val.half_baths);
    });
    // console.log('bath results: ',listings);
      // listings.reverse();
    this.setState({
      markers:listings,
      sort_order:'ascending',
      sorting_spec:'baths',
      dropdown:false
    });
  }
  sortBathDesc(){
    this.unPress();
    let listings = this.state.markers;
    listings.sort((a,b)=>{
      return (a.full_baths+a.half_baths)-(b.full_baths+b.half_baths);
    })
    listings.forEach((val)=>{
      // console.log('baths: ',val.full_baths+val.half_baths);
    });
    // console.log('bath results: ',listings);
      listings.reverse();
    this.setState({
      markers:listings,
      sort_order:'ascending',
      sorting_spec:'baths',
      dropdown:false
    });
  }
  sortAsc(){
    // console.log('asc');
    if(this.state.sorting_spec === 'time' && this.state.sort_order==='descending'){
      // this.sortTime();
      let markers=this.state.markers.reverse();
      this.setState({
        markers,
        sort_order:'ascending'
      })
    }else if(this.state.sorting_spec === 'price' && this.state.sort_order==='descending'){
      // this.sortTime();
      // let markers=this.state.markers;
      // this.setState({
      //   markers
      // })
      this.orderByPriceDesc();
    }

    // if(this.state.sort_order !=='ascending'){
    //     this.setState({
    //       sort_order:'ascending'
    //     });
    //   }
  }
  sortDesc(){
    // console.log('desc');
    if(this.state.sorting_spec === 'time' && this.state.sort_order==='ascending'){
      this.sortTime();
      // let markers=this.state.markers.reverse();
      this.setState({
        sort_order:'descending'
      })
    }else if(this.state.sorting_spec === 'price' && this.state.sort_order==='ascending'){
      // this.sortTime();
      // let markers=this.state.markers;
      // this.setState({
      //   sort_order'ascending'
      // })
      this.orderByPrice();
    }

  }
  sortByNewest(){
    let $item = jquery('#down');
    $item.removeClass('down-btn-pressed');
    let listings = this.state.markers;
    listings.sort((a,b)=>{
      return a.cdom - b.cdom
    })
    this.setState({
      markers:listings,
      dropdown:false,
      sorting_spec:'newest'
    });
  }


  // let ascending_arrow = (this.state.sort_order ==='descending') ? ( <i onClick={this.sortAsc.bind(this)} className="glyphicon glyphicon-triangle-top"></i> ) : '';
  // let descending_arrow = (this.state.sort_order ==='ascending') ? ( <i onClick={this.sortDesc.bind(this)} className="glyphicon glyphicon-triangle-bottom"></i> ) : '';

  updateResults(results){
    let updated = this.state.updated;
      // console.log('updating results - ',results,' - updated: ',updated,' neighborhood: ',this.state.neighborhood, 'display: ',this.state.display);
    if(this.state.display==='list' && updated==false && this.state.neighborhood !=='FullDCArea'){
      this.setState({
        markers:results,
        display:'list',
        updated:true
      });
    }else if(this.state.display==='map'){
      this.setState({
        markers:results,
        display:'map',
        updated:true
      });
    }
  }
  findOut(){
    this.setState({
      find_out:!this.state.find_out
    });
  }
  render(){
    let results = this.state.markers;
    // console.log('results in results render: ',results);
    let selected = this.state.selected;
    // console.log('sort order: ',this.state.sort_order);

        let display;
        // let map = (
        //   <ReactMap display={true} viewListing={this.viewListing.bind(this)} updateResults={this.updateResults.bind(this)} neighborhood={this.props.params.neighborhood} markers={results}/>
        //   // <Map markers={this.state.markers} />
        // );
        let subd = '';
        let nbhd = this.props.params.neighborhood.toLowerCase();
        switch(nbhd){
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
          case 'americanuniversitypark':
          subd = "American University Park";
          break;
          case 'brightwood':
          subd = "Brightwood";
          break;
          case 'cathedralheights':
          subd = "Cathedral Heights";
          break;
          case 'forttotten':
          subd = "Fort Totten";
          break;
          case 'kalorama':
          subd = "Kalorama";
          break;
          case 'tenleytown':
          subd = "Tenleytown";
          break;
          case 'americanuniversitypark':
          subd = "American University Park";
          break;
          case 'brightwood':
          subd = "Brightwood";
          break;
          case 'cathedralheights':
          subd = "Cathedral Heights";
          break;
          case 'forttotten':
          subd = "Fort Totten";
          break;
          case 'kalorama':
          subd = "Kalorama";
          break;
          case 'tenleytown':
          subd = "Tenleytown";
          break;
          default:
          subd=''
        }
        let today ='';
        switch(this.props.params.day){
          case 'saturday':
          today = ' on Saturday';
          break;
          case 'sunday':
          today = ' on Sunday';
          break;
          default:
          today = '.'
        }

    ///////////

//===================LOADING MAIN LISTING INFORMATION, TAKING IN PREVIOUSLY LOADED INFO=============//
    let markers=[];
    let params = this.props.params;
    let neighborhood = (this.state.neighborhood) ? this.state.neighborhood : '';
    // console.log('params: ',params);
    // let stored_results = this.props.stored_results;
    // let i = (stored_results) ? true: false;
    // // console.log('app has stored results: ',i, ', ',stored_results, ', and raw results: ',this.state.results);
    results = (results) ? results.filter((listing)=>{
      return listing !==null;
    }) : '';
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    results = (results) ? results.map((listing)=>{
      // console.log('listing in render: ',listing);
      let price = currency.format(listing.list_price,{ code: 'USD', decimalDigits: 0 });
      price = price.slice(0,price.length-3);
      //get day of the week:
      let date = (listing.open_house_events[0]) ? moment(listing.open_house_events[0].event_start) : '';
      let dow = (date) ? date.day() : '';
      // console.log('todays open house is: ',days[dow]);
      let time = (date) ? date.format('h:mmA') : '';
      let dowUC = (date) ? days[dow] : '';
      dow = (date) ? days[dow] : '';
      dow = (date) ? dow.toLowerCase() : '';


      let dir;
      switch(listing.street_pre_direction){
        case 'Northwest':
        dir = 'NW';
        break;
        case 'Southwest':
        dir = 'SW';
        break;
        case 'Southeast':
        dir = 'SE';
        break;
        case 'Northeast':
        dir = 'NE';
        break;
        default:
        dir = '';
      };
      //FILTER BY MLS SUBDIVISION:

      // if(params.neighborhood && params.neighborhood !=='Full DC Area'){
      //   // console.log('filtering by day and neighborhood :',params.day,' vs ',dow,', ','and ',params.neighborhood,' vs ',listing.subdivision);
      //   if( dow !==params.day || listing.subdivision !==params.neighborhood){
      //     // console.log('no match');
      //     return;
      //   }
      // }

      //FILTER DAY:

      if(params.day !=='none'){
        // console.log('filtering by day');
        // console.log(params.day,' vs ',dow);
        if(dow !==params.day){
          return;
        }
      }

      //map coordinates
      markers.push(
        listing
      );

      let style = {
        backgroundImage:'url('+listing.image_urls.all_thumb[0]+')',
        backgroundPosition:'center',
        backgroundSize:'cover',
        overlap:'hidden'
      };
      let indx = markers.indexOf(listing);
      // console.log('listing index: ',indx, ' neighborhood: ',neighborhood);
      // let reactMap = (neighborhood !== 'FullDCArea' && indx==0) ? ( <ReactMap display={false} viewListing={this.viewListing.bind(this)} updateResults={this.updateResults.bind(this)} neighborhood={this.props.params.neighborhood} markers={markers}/> ) : '';
      // if(neighborhood !=='FullDCArea'
      let result_subd = (<span className='result-subd'>{subd}</span>);
      return(
        <div id={listing.id} onClick={this.viewTabListing.bind(this)} className="results-item row">
          <div id={listing.id} style={style} className="results-div col-xs-4 results-item-pic">
            {/* <div id='pause' className="results-item-selector">
            </div> */}
            {/* <img src="./images/download-2.jpg" alt="listing image" /> */}
          </div>
          <div id={listing.id} className="results-div col-xs-4 results-item-info">
            <div className="item-info-container" id={listing.id}>
              { listing.street_number } { listing.street_name } { listing.street_post_dir } {dir} ({dowUC})<br/>
              { price }<br/>
              {result_subd}
            </div>
          </div>
          <div  id={listing.id} className="results-div col-xs-4 results-item-time">
            <div id={listing.id} className="results-item-time-box">
              <div id={listing.id}>{ time }</div>
            </div>
          </div>
          {/* {reactMap} */}
        </div>
      );
    }) : '';

    // let map = (markers.length) ? (
    //   <ReactMap display={true} viewListing={this.viewListing.bind(this)} updateResults={this.updateResults.bind(this)} neighborhood={this.props.params.neighborhood} markers={markers}/>
    // ) : '';

    let map = (
      <ReactMap display={true} viewListing={this.viewListing.bind(this)} updateResults={this.updateResults.bind(this)} neighborhood={this.props.params.neighborhood} markers={markers}/>
    );

///////////////////



    // let spinner = (<div className="no-results-msg">Searching for {subd} open houses{today}. Thanks for your patience.<br/><img className="spinner" src={require("../images/loadcontent.gif")} alt="please wait"/></div>);
    let spinner = (<div className="no-results-msg">({subd} open houses{today})<br/>Thanks for your patience while we load the latest DC open houses - all future searches will happen instantly.<br/><img className="spinner" src={require("../images/loadcontent.gif")} alt="please wait"/></div>);
    results = (results) ? results.filter((val)=>{
      if(val){
        return val;
      }
      return;
    }) : '';
    // console.log('the results in results render: ',results);

    let wkday = moment().day();
    wkday = days[wkday];
    // console.log('search is on: ',wkday);

    const reason = (this.state.find_out) ? (
      <div className="reason">Properties for the upcoming weekend for this neighborhood haven't been advertised yet. The search
results typically reset to zero on Sunday evening and increase as the weekend approaches.</div>
    ) : '';

    const no_listings_msg = (
      <div className="no-results-msg-wrapper">
        <div className="no-results-msg">We're sorry, your search for {subd} open houses {today} didn't return any results.</div>
        <div onClick={this.findOut.bind(this)} className="find-out">Find Out Why</div>
        { reason }
      </div>
    );



    // let no_listings_msg;
    // switch(wkday){
    //   case 'Monday':
    //   no_listings_msg = (<div className="no-results-msg">We're sorry, your search for {subd} open houses {today} didn't return any results - but it's only Monday. Try searching again at the end of the week when more have been scheduled.</div>);
    //   break;
    //   case 'Tuesday':
    //   no_listings_msg = (<div className="no-results-msg">We're sorry. Your search for {subd} open houses {today} didn't return any results - but it's only Tuesday. Try searching again at the end of the week when more have been scheduled.</div>);
    //   break;
    //   case 'Wednesday':
    //   no_listings_msg = (<div className="no-results-msg">We're sorry. Your search for {subd} open houses {today} didn't return any results - but it's only Wednesday. Try searching again at the end of the week when more have been scheduled.</div>);
    //   break;
    //   case 'Thursday':
    //   no_listings_msg = (<div className="no-results-msg">We're sorry. Your search for {subd} open houses {today} didn't return any results - but something may appear in the next couple of days. Meanwhile try a new search.</div>);
    //   break;
    //   case 'Friday':
    //   no_listings_msg = (<div className="no-results-msg">We're sorry. Your search for {subd} open houses {today} didn't return any results - but something could still appear Saturday or Sunday. Meanwhile try a new search.</div>);
    //   break;
    //   case 'Saturday':
    //   no_listings_msg = (<div className="no-results-msg">We're sorry. It looks like there probably won't be any open houses in {subd} {today}. Most agents would have announced their events by now. Try a new search, or check again in a few days.</div>);
    //   break;
    //   case 'Sunday':
    //   no_listings_msg = (<div className="no-results-msg">We're sorry. It looks like there probably won't be any open houses in {subd} {today}. Most agents would have announced their events by now. Try a new search, or check again in a few days.</div>);
    //   break;
    //   default:
    //   no_listings_msg = (<div className="no-results-msg">We're sorry. It looks like there probably won't be any open houses in {subd} {today}. Try a new search, or check again in a few days.</div>);
    //   break;
    // }

    switch(this.state.display){
      case 'list':
      display=(results.length) ? (
        <div>
          {results}
          <ReactMap display={false} viewListing={this.viewListing.bind(this)} updateResults={this.updateResults.bind(this)} neighborhood={this.props.params.neighborhood} markers={markers}/>
        </div>
    ) : no_listings_msg;
      break;
      case 'map':
      display=map;
      break;
      case 'loading':
      display=spinner;
      break;
      default:
      display=(<div>
        {results}
        <ReactMap display={true} viewListing={this.viewListing.bind(this)} updateResults={this.updateResults.bind(this)} neighborhood={this.props.params.neighborhood} markers={markers}/>
      </div>)
    }
    let drop = {
      onMouseEnter:this.highlight.bind(this),
      onMouseLeave:this.highlight_off.bind(this)
    }


    let dropdown = (this.state.dropdown) ? (
      <div>
        <div className="sort-dropdown-list clearfix">
        <div className="sort-dropdown-opacity">

        </div>
        </div>
        <div className="sort-text">
          <div id='time_dsc' {...drop} onClick={this.sortTimeDesc.bind(this)} className="sort-values subdivision">
            Time: Earliest to Latest
          </div>
          <div id='time_asc' {...drop} onClick={this.sortTimeAsc.bind(this)} className="sort-values subdivision">
            Time: Latest to Earliest
          </div>
          <div id='price_ase' {...drop} onClick={this.sortByPrice.bind(this)}  className="sort-values subdivision">
            Price: Lowest to Highest
          </div>
          <div id='price_dsc' {...drop} onClick={this.sortByPriceDesc.bind(this)}  className="sort-values subdivision">
            Price: Highest to Lowest
          </div>
          <div id='bed_asc' {...drop} onClick={this.sortBedAsc.bind(this)}  className="sort-values subdivision">
            Bedrooms: Lowest to Highest
          </div>
          <div id='bed_desc' {...drop} onClick={this.sortBedDesc.bind(this)}  className="sort-values subdivision">
            Bedrooms: Highest to Lowest
          </div>
          <div id='bath_asc' {...drop} onClick={this.sortBathAsc.bind(this)}  className="sort-values subdivision">
            Bathrooms: Lowest to Highest
          </div>
          <div id='bath_desc' {...drop} onClick={this.sortBathDesc.bind(this)}  className="sort-values subdivision">
            Bathrooms: Highest to Lowest
          </div>
          <div id='price' {...drop} onClick={this.sortByNewest.bind(this)}  className="sort-values subdivision">
            Newest
          </div>
          {/* PRICE SORTING OPTIONS */}
          {/* <div className="sort-subvalues">
            <div onClick={this.sortPrice.bind(this)} className="subdivision" id='3' {...drop}>- $0-$500,000</div>
            <div onClick={this.sortPrice.bind(this)} className="subdivision" id='4' {...drop}>- $500,000-$1,000,000</div>
            <div onClick={this.sortPrice.bind(this)} className="subdivision" id='5' {...drop}>- $1,000,000-$3,000,000</div>
            <div onClick={this.sortPrice.bind(this)} className="subdivision" id='6' {...drop}>- $3,000,000+</div>
          </div> */}
        </div>
      </div>
    ): '';
    let spec = this.state.sorting_spec.toUpperCase();
    let updownfilter = (this.state.display == 'list') ? (
      <div className="up-down-filter">
        {/* { ascending_arrow }
        { descending_arrow } */}
      </div>
  ) : ( <div className="up-down-placeholder"></div> );



    return(
      <div>
        <div className="results-search-options">

          <a onClick={this.arrowToggle.bind(this)} className="btn-3d results-option select-all btn-3d-blue-results" href="#"><div>NEW SEARCH</div></a>
          <a onClick={this.listToggle.bind(this)} className="btn-3d results-option list-view  btn-3d-blue-results" href="#"><div>LIST VIEW</div></a>
          <a onClick={this.mapBtnToggle.bind(this)} className="btn-3d results-option map-view btn-3d-blue-results" href="#"><div>MAP VIEW</div></a>
          <a className="btn-3d results-option sort-by  btn-3d-blue-results" href="#">
            <div>SORT BY {spec}</div>
            { dropdown }
          </a>
          <a id='down' onClick={this.downBtnToggle.bind(this)} className="btn-3d results-option sort-by-arrow  btn-3d-blue-results" href="#"><span className="glyphicon glyphicon-triangle-bottom"></span></a>

        </div>
        <div>
        { updownfilter }
      </div>
    <div className="results">
      { display }
    </div>

      </div>
    );
  }
}

export default Results;
