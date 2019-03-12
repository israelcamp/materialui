import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TableExample from './TableExample';
import Uploader from './UploaderPreview';

function App(props) {
  return (
    <Router>
      <Switch>
        <Route exact path="/table" component={TableExample} />
        <Route exact path="/uploader" component={Uploader} />
      </Switch>
    </Router>
  );
}

export default App;
