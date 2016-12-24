/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';

class Home extends React.Component {
  static propTypes = {
      airports: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  render() {
    console.log("test123");
    console.log(this.props.airports);
    return (
      <div className={s.root}>
        <div className={s.container}>
          <form method="post">
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="airport">
                Airport:
              </label>
              <input
                className={s.input}
                id="airport"
                type="text"
                name="airport"
                autoFocus
              />
            </div>
            <div className={s.formGroup}>
              <button className={s.button} type="submit">
                Go
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
