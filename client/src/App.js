import React, { Component } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

class App extends Component {
  render() {
    let children = this.props.children;

    return (
      <div>
        { children }
        <Footer />
      </div>
    );
  }
}

export default App;
