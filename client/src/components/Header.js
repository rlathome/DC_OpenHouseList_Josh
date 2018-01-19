import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import $ from 'jquery';
import axios from 'axios';
let apiKey="http://www.dcopenhouselist.com/";

class Header extends Component{
  constructor(props){
    super(props);
    this.state={
      open:false,
      pics: ''
    }
  }
  componentWillMount(){
    this.getHeaderPhoto();
  }
  reload(e){
    e.preventDefault();
    this.props.reload();
  }
  goHome(e){
    e.preventDefault();
    console.log('going home');
    this.props.reload();
  }
  neighborhood(){
    // const day = this.props.day.toLowerCase();
    // hashHistory.push('/search/'+day+'/none');
  }
  toggleNav(){
    // this.setState({
    //   open: !this.state.open
    // })
    // const toggle = (!this.state.open) ? 'block' : 'none';
    // console.log('toggling');
    // $('.collapse').css('display',toggle);
    // $('.collapse').removeClass('flat')
  }
  getHeaderPhoto(){
    let url = apiKey+"info/getheaders";
    axios.get(url).then((response)=>{
      let pics = response.data;
      console.log('pics: ',pics);
      this.setState({
        pics
      });
    }).catch((err)=>{
      console.log('err - ',err);
    })
  }
  render(){
    console.log('params in header: ',this.props.params);
    let day = (this.props.day && this.props.day !=='NONE') ? (<li onClick={()=>this.props.reload()}><i className="glyphicon glyphicon-play"></i>{this.props.day}</li>) : '';
    let neighborhood = (this.props.neighborhood) ? (<li onClick={this.neighborhood.bind(this)}><i className="glyphicon glyphicon-play"></i>{this.props.neighborhood}</li>) : '';
    let photoURL = (this.state.pics[0]) ? this.state.pics[0].url : '';
    console.log('photourl: ',photoURL)
    const headerStyle={backgroundImage:'url('+ photoURL+')'};
    return(
      <header>
        <div className="grey-bar">
        </div>
        <div className="lightgrey-bar">
        </div>

        <div id="header-nav">
          <button onClick={this.toggleNav.bind(this)} type="button" className="navbar-toggle" data-toggle="collapse" data-target=".collapse" name="button">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li onClick={this.reload.bind(this)}><i className="glyphicon glyphicon-play"></i>HOME</li>
              { day }
              { neighborhood }
              {/* <li id="saturday" onClick={this.pickDay.bind(this)}><i className="glyphicon glyphicon-play"></i>SATURDAY</li>
              <li id="sunday" onClick={this.pickDay.bind(this)}><i className="glyphicon glyphicon-play"></i>SUNDAY</li> */}
            </ul>
          </div>
        </div>
        <div id="header-image" style={headerStyle}>
          <div id="header-transition">
          </div>
          <div className="header-title-container">
            <img onClick={this.goHome.bind(this)} className="img-responsive" src="./images/DC_open House_sm-10.svg" alt="title" />
          </div>
        </div>
        <div className="yellow-bar"></div>
        <div className="red-bar"></div>
      </header>
    );
  }
}

export default Header;
