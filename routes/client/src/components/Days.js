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
  render(){
    let btn_style = 'day-btn btn-3d btn-3d-blue';
    return(
      <div>
        <div className="options-title" >PICK A DAY</div>
        <div className="search-options">
          <span id="saturday" onClick={this.saturday.bind(this)} className={btn_style}>
            <div className="day-text">
              <div>
                <div className="day-text-1">
                  This
                </div>
                <div className="day-text-2">
                  Saturday
                </div>
              </div>
            </div>
          </span>
            <span id="sunday" onClick={this.sunday.bind(this)} className={btn_style}>
              <div className="day-text">
                  <div>
                  <div className="day-text-1">
                    This
                  </div>
                  <div className="day-text-2">
                    Sunday
                  </div>
                </div>
              </div>
            </span>
          </div>
        </div>
      );
    }
}

export default Days;
