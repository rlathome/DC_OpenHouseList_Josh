import React, { Component } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      listings:''
    }
  }
  updateListings(listings){
    this.setState({
      listings
    })
  }
  render() {
    let children = this.props.children;

    return (
      <div>
        {/* { children } */}
        { React.cloneElement(children, { global_listings:this.state.listings, updateListings:this.updateListings.bind(this) })}
        <Footer />
      </div>
    );
  }
}

export default App;
