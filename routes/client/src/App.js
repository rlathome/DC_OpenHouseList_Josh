import React, { Component } from 'react';
import Header from './components/Header';
import './App.css';

class App extends Component {
  render() {
    let children = this.props.children;
    return (
      <div>
        { children }
      </div>
    );
  }
}

export default App;
