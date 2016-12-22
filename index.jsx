import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import 'current-input';

import App from './components/App';
import Home from './components/Home';
import Test from './components/Test';
import PageNotFound from './components/PageNotFound';


const routes = (
  <Route path="/" mapMenuTitle="Home" component={App}>
      <IndexRoute component={Test} />
      <Route path="test" mapMenuTitle="Test" component={Home} />
      <Route path="*" mapMenuTitle="Page Not Found" component={PageNotFound} />
  </Route>
);


render(
  <Router
    history={browserHistory}
    routes={routes}
  />,
  document.getElementById('root')
);
