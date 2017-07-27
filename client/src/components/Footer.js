import React, { Component } from 'react';

class Footer extends Component{
  render(){
    return(

    <div className="wrapper">
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
      );
    }
}

export default Footer;
