/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import fetch from '../../core/fetch';
import Layout from '../../components/Layout';
let parse = require('xml-parser');



export default {

  path: '/',

  async action() {
    return fetch('http://www.tsa.gov/data/apcp.xml')
      .then(response => response.text())
      .then(xmlString => {
        console.log("abc123");
        //console.log(xmlString);
        const jsonObj = parse(xmlString);
        console.dir(jsonObj);
        if (!jsonObj || !jsonObj.root.children) throw new Error('Failed to parse data.');
        return {
            title: 'When should I leave for the airport?',
            component: <Layout><Home airports={jsonObj.root.children}/></Layout>,
        };
      });
  },

};
