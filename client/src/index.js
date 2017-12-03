import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Search from './components/Search';
import Listing from './components/Listing';
import AddAgents from './components/AddAgents';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';
import dotenv from 'dotenv';
dotenv.config({ silent:true });

ReactDOM.render(
  <Router history= { hashHistory }>
    <Route path = "/" component = { App }>
      <IndexRoute component = { Search } />
      <Route path="listing/:mls/:day/:neighborhood/:view" component = { Listing } />
      <Route path="search/:day/:neighborhood/:view" component = { Search } />
      <Route path="admin" component = { AddAgents } />
    </Route>
  </Router>,
  document.getElementById('root')
);
