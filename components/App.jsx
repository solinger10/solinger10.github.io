import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const propTypes = {
  children: PropTypes.element.isRequired,
  routes: PropTypes.array.isRequired,
};
/*
 <header>
 <h1>When should I leave for the airport?</h1>
 </header>
 */

function App({ children, routes }) {
  return (
    <div>
      {children}
      <div style={{ color: '#A0A0A0', fontSize: '14px', marginTop: '50px', textAlign: 'center'}}>
          © 2017 whenshouldileavefortheairport
      </div>
    </div>
  );
}

App.propTypes = propTypes;

export default App;
