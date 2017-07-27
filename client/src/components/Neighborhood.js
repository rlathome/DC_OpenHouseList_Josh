import React, { Component } from 'react';
import axios from 'axios'
// let apiKey = (process.env.REACT_APP_STATUS == 'development') ? "http://localhost:8080" : "http://vast-shore-14133.herokuapp.com";

let apiKey="http://vast-shore-14133.herokuapp.com";

// let apiKey = "http://localhost:8080";


class Neighborhood extends Component{
  constructor(props){
    super(props);
    this.state={
      dropdown:false,
      neighborhoods:[],
      selected:''
    }
  }
  componentWillMount(){
    //temporary - loading neighborhoods from DB while API key is for Columbia
    let neighborhoods = ["Full DC Area", "Adams Morgan", "Anacostia", "Brookland", "Capitol Hill", "Columbia Heights", "Deanwood", "duPont Circle", "Eckington", "Friendship Heights", "Georgetown", "Logan Circle", "Petworth", "Southwest Waterfront", "Westend"];
    // axios.get(apiKey + '/info/neighborhoods').then(
    //   (neighborhoods)=>{
    //     console.log('neighborhoods: ',neighborhoods.data);
    //     neighborhoods = neighborhoods.data;
    //     // this.setState({
    //     //   neighborhoods,
    //     //   selected:neighborhoods[0]
    //     // });
    //   }
    // ).catch((err)=>{
    //   console.log('error -',err);
    // });
    this.setState({
      neighborhoods,
      selected:neighborhoods[0]
    });
  }
  arrowToggle(e){
    e.preventDefault();
    this.props.arrowToggle(e);
    this.setState({
      dropdown: !this.state.dropdown
    });
  }
  highlight(e){
    let item = e.target;
    item.className+=" highlighted";
  }
  highlight_off(e){
    let item = e.target;
    item.className-=" highlighted";
    item.className+=" subdivision";
  }
  select(e){
    let item = e.target;
    this.setState({
      selected:item.id
    });
    setTimeout(()=>{
      this.props.selectNeighborhood(e,item.id);
    },250);
  }
  render(){
    let neighborhoods = this.state.neighborhoods;
    let selected = ( <span> {this.state.selected} </span> );
    neighborhoods = neighborhoods.map((subd)=>{
      let id = '';
      switch(subd){
        case 'Full DC Area':
        id='FullDCArea';
        break;
        case 'Adams Morgan':
        id='adamsmorgan';
        break;
        case 'Anacostia':
        id='anacostia';
        break;
        case 'Brookland':
        id='brookland';
        break;
        case 'Capitol Hill':
        id='capitolhill';
        break;
        case 'Columbia Heights':
        id='columbiaheights';
        break;
        case 'Deanwood':
        id='deanwood';
        break;
        case 'duPont Circle':
        id='dupontcircle';
        break;
        case 'Eckington':
        id='eckington';
        break;
        case 'Friendship Heights':
        id='friendshipheights';
        break;
        case 'Georgetown':
        id='georgetown';
        break;
        case 'Logan Circle':
        id='logancircle';
        break;
        case 'Petworth':
        id='petworth';
        break;
        case 'Southwest Waterfront':
        id='southwestwaterfront';
        break;
        case 'Westend':
        id='westend';
        break;
        default:
        id=''
      }
      return(
        <div id={id} onMouseEnter={this.highlight.bind(this)} onMouseLeave={this.highlight_off.bind(this)} onClick={this.select.bind(this)} className="subdivision">
          {subd}
        </div>
      );
    });
    let dropdown = (this.state.dropdown) ? (
        <div className="neighborhood-dropdown-container">
          <div className="neighborhood-dropdown-opacity"></div>
          <div className="neighborhood-text">
            { neighborhoods }
          </div>
        </div>
    ): '';
    return(
      <div>
        <div className="options-title" >PICK A NEIGHBORHOOD</div>
        <div className="options-comment">(More custom neighborhoods coming soon!)</div>
        <div className="search-options">
          <span ref="neighborhood-list" className="btn-3d results-option-neigh neigh-button btn-3d-blue-results-neigh">
            <div className="neigh-selected">{ selected }</div>
            { dropdown }
          </span>
          <span  onClick={this.arrowToggle.bind(this)} className="btn-3d btn-3d-blue-results results-option-neigh sort-by-arrow-neigh" href="#"><div className="glyphicon glyphicon-triangle-bottom"></div></span>
        </div>
      </div>
    );
  }
}

export default Neighborhood;
