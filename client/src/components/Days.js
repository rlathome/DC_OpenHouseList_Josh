import React, { Component } from 'react';

class Days extends Component{
  saturday(e){
    e.preventDefault();
    this.props.saturday(e);
  }
  sunday(e){
    e.preventDefault();
    this.props.sunday(e);
  }
  skipAhead(e){
    e.preventDefault();
    this.props.skipAhead();
  }
  render(){
    let btn_style = 'day-btn btn-3d btn-3d-blue';
    return(
      <div>
        <div className="options-title" >PICK A DAY</div>
        <div className="search-options">
          <span id="saturday" onClick={this.saturday.bind(this)} className={btn_style}>
            <div className="day-text">
              <span className="day-holder">
                <span className="day-text-1">
                  This
                </span><br/>
                <span className="day-text-2">
                  Saturday
                </span>
              </span>
            </div>
          </span>
            <span id="sunday" onClick={this.sunday.bind(this)} className={btn_style}>
              <div className="day-text">
                  <span className="day-holder">
                  <span className="day-text-1">
                    This
                  </span><br/>
                  <span className="day-text-2">
                    Sunday
                  </span>
                </span>
              </div>
            </span>
          </div>
          <div className="skip-ahead" onClick={this.skipAhead.bind(this)}>Click here to search by neighborhood</div>
        </div>
      );
    }
}

export default Days;
