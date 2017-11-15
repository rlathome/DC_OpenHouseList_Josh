import React, { Component } from 'react';
import { hashHistory } from 'react-router';

class Header extends Component{
  pickDay(e){
    let day = e.target.id;
    console.log('picking ',day);
  }
  reload(e){
    e.preventDefault();
    this.props.reload();
  }
  goHome(e){
    e.preventDefault();
    console.log('yick')
    hashHistory.push('/');
  }
  neighborhood(){
    // this.props.reload();
    // this.props.toNeigh();
    // let day = this.props.day.toLowerCase();
  }
  render(){
    let day = (this.props.day && this.props.day !=='NONE') ? (<li onClick={()=>this.props.reload()}><i className="glyphicon glyphicon-play"></i><a href="#" alt="day">{this.props.day}</a></li>) : '';
    let neighborhood = (this.props.neighborhood) ? (<li onClick={this.neighborhood.bind(this)}><i className="glyphicon glyphicon-play"></i><a href="#" alt="neighborhood">{this.props.neighborhood}</a></li>) : '';
    return(
      <header>
        <div className="grey-bar">
        </div>
        <div className="lightgrey-bar">
        </div>

        <div id="header-nav">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse" name="button">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li onClick={this.reload.bind(this)}><i className="glyphicon glyphicon-play"></i><a href="/index.html">HOME</a></li>
              { day }
              { neighborhood }
              {/* <li id="saturday" onClick={this.pickDay.bind(this)}><i className="glyphicon glyphicon-play"></i>SATURDAY</li>
              <li id="sunday" onClick={this.pickDay.bind(this)}><i className="glyphicon glyphicon-play"></i>SUNDAY</li> */}
            </ul>
          </div>
        </div>
        <div id="header-image">
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
