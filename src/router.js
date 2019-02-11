import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TableExample from './TableExample'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/table' component={TableExample} /> 
        </Switch> 
      </Router>
    );
  }
}

export default App;