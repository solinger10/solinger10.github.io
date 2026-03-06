import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import 'current-input';

import App from './components/App';
import Home from './components/Home';
import PageNotFound from './components/PageNotFound';

const routes = (
  <Route path="/" mapMenuTitle="Home" component={App}>
      <IndexRoute component={Home} />
      <Route path="*" mapMenuTitle="Page Not Found" component={PageNotFound} />
  </Route>
);

function loadMapsAndRender() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
  script.onload = () => {
    render(
      <Router history={browserHistory} routes={routes} />,
      document.getElementById('root')
    );
  };
  document.head.appendChild(script);
}

loadMapsAndRender();
