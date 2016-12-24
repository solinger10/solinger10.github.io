
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.css';
import Link from '../Link';

class Footer extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <span className={s.text}>© When should I leave for the airport</span>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Footer);
