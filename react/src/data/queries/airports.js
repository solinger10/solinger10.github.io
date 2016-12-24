
import { GraphQLList as List } from 'graphql';
import fetch from '../../core/fetch';
import AirportType from '../types/AirportType';

const url = 'http://www.tsa.gov/data/apcp.xml';

let items = [];
let lastFetchTask;
let lastFetchTime = new Date(1970, 0, 1);

const airports = {
    type: new List(AirportType),
    resolve() {
        if (lastFetchTask) {
            return lastFetchTask;
        }

        //if ((new Date() - lastFetchTime) > 1000 * 60 * 10 /* 10 mins */) {
            lastFetchTime = new Date();
            console.log("testing");
            lastFetchTask = fetch(url)
                .then(response => response)
                .then(data => {
                    if (data.responseStatus === 200) {
                        items = data.responseData.feed.entries;
                    }

                    return items;
                })
                .finally(() => {
                    lastFetchTask = null;
                });

            if (items.length) {
                return items;
            }

            return lastFetchTask;
        //}

        //return items;
    },
};

export default airports;
