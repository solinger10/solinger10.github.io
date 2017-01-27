import React from 'react';
import { Link } from 'react-router';

function Home() {

    let JXON = require('JXON');
    function getAirports() {
        let request = new XMLHttpRequest();
        request.open("GET", "/xml/apcp.xml", false);
        request.send();
        let xml = request.responseXML;
        const jsonObj = JXON.build(xml);
        return jsonObj.airports.airport;
    }
    function abbrState(input, to){

        const states = [
            ['Arizona', 'AZ'],
            ['Alabama', 'AL'],
            ['Alaska', 'AK'],
            ['Arizona', 'AZ'],
            ['Arkansas', 'AR'],
            ['California', 'CA'],
            ['Colorado', 'CO'],
            ['Connecticut', 'CT'],
            ['Delaware', 'DE'],
            ['Florida', 'FL'],
            ['Georgia', 'GA'],
            ['Hawaii', 'HI'],
            ['Idaho', 'ID'],
            ['Illinois', 'IL'],
            ['Indiana', 'IN'],
            ['Iowa', 'IA'],
            ['Kansas', 'KS'],
            ['Kentucky', 'KY'],
            ['Kentucky', 'KY'],
            ['Louisiana', 'LA'],
            ['Maine', 'ME'],
            ['Maryland', 'MD'],
            ['Massachusetts', 'MA'],
            ['Michigan', 'MI'],
            ['Minnesota', 'MN'],
            ['Mississippi', 'MS'],
            ['Missouri', 'MO'],
            ['Montana', 'MT'],
            ['Nebraska', 'NE'],
            ['Nevada', 'NV'],
            ['New Hampshire', 'NH'],
            ['New Jersey', 'NJ'],
            ['New Mexico', 'NM'],
            ['New York', 'NY'],
            ['North Carolina', 'NC'],
            ['North Dakota', 'ND'],
            ['Ohio', 'OH'],
            ['Oklahoma', 'OK'],
            ['Oregon', 'OR'],
            ['Pennsylvania', 'PA'],
            ['Rhode Island', 'RI'],
            ['South Carolina', 'SC'],
            ['South Dakota', 'SD'],
            ['Tennessee', 'TN'],
            ['Texas', 'TX'],
            ['Utah', 'UT'],
            ['Vermont', 'VT'],
            ['Virginia', 'VA'],
            ['Washington', 'WA'],
            ['West Virginia', 'WV'],
            ['Wisconsin', 'WI'],
            ['Wyoming', 'WY'],
        ];

        if (to == 'abbr'){
            input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            for(let i = 0; i < states.length; i++){
                if(states[i][0] == input){
                    return(states[i][1]);
                }
            }
        } else if (to == 'name'){
            input = input.toUpperCase();
            for(let i = 0; i < states.length; i++){
                if(states[i][1] == input){
                    return(states[i][0]);
                }
            }
        }
    }

    const airports = getAirports();
    const airportsStrings = airports.map(function(e){ return e.shortcode + " - " + e.name + ", " + e.city + ", " + abbrState(e.state, "name")});



    $(document).ready(function() {
        $('.typeahead').typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: 'airports',
                source: substringMatcher(airportsStrings),
                templates: {
                    empty: [
                        '<div class="list-group search-results-dropdown"><div class="list-group-item">Nothing found.</div></div>'
                    ],
                    header: [
                        '<div class="list-group search-results-dropdown">'
                    ],
                    suggestion: function (data) {
                        return '<div class="list-group search-results-dropdown"><div class="list-group-item">' + data + '</div></div>'
                    }
                }
            });
        //$("#travelMode :input").change();
    });

    let substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            // an array that will be populated with substring matches
            let matches = [];

            // regex used to determine if a string contains the substring `q`
            let substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
            });

            cb(matches);
        };
    };


    //TODO airport picker into select?
    //TODO make date time a dropdown
    //TODO location onClick="this.select();"
    //TODO bootstrapify autcomplete maps location
    //TODO duratoin picker out of datetimepicker?


  return (
    <div>
        <div>
            <form className="airport-form">
                <span className="label">Leaving From</span>
                <div className="form-group textola">
                    <input id="startInput" type="text" onClick={(e)=>{e.target.select()}} name="s" placeholder="Location or Address" className="form-control" defaultValue={"New York, NY, United States"}></input>
                </div>
                <span className="label">To Airport</span>
                <div className="form-group textola">
                    <input id="airportInput" type="text" name="a" onClick={(e)=>{e.target.select()}} className="form-control typeahead" placeholder="Airport Name or Code" autoComplete="off" defaultValue={"EWR - Newark International, Newark, New Jersey"}></input>
                </div>
                <span className="label">Travel By</span>
                <span className="label floatright">Arrive How Early</span>
                <div className="form-group"  style={{margin:"0"}}></div>
                <div>
                    <div id="radio1" className="floatleft" >
                        <div id="travelMode"  className="btn-group" data-toggle="buttons">
                            <label className="btn btn-default active">
                                <input type="radio" name="options2" id="option1" autoComplete="off" defaultChecked value="driving"></input>
                                Driving
                            </label>
                            <label className="btn btn-default">
                                <input type="radio" name="options2" id="option2" autoComplete="off" value="transit"></input>
                                Transit
                            </label>
                        </div>
                    </div>
                    <div style={{width:"170px", float: "right", marginRight:"5%"}}>
                        <div className="input-group hr"  style={{maxWidth:"1px", float: "left"}}>
                            <select className="form-control selectpicker" id="hr">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                            </select>
                            <span className="input-group-addon" id="basic-addon2">hr</span>
                        </div>
                        <div className="input-group min" style={{maxWidth:"1px", float: "right"}}>
                            <select defaultValue={30} className="form-control selectpicker" id="min">
                                <option>0</option>
                                <option>15</option>
                                <option >30</option>
                                <option>45</option>
                            </select>
                            <span className="input-group-addon" id="basic-addon2">min</span>
                        </div>
                    </div>
                </div>
                <div className="form-group"  style={{padding:"0"}}></div>
                <span className="label">Flight Time</span>
                <div className="form-group">
                    <div id="datetimepicker12"></div>
                    <input id="dateval" hidden></input>
                </div>
                <div className="submit">
                    <button type="submit" className="btn btn-default" >Go</button>
                </div>
            </form>
        </div>
        <div id="result"></div>
    </div>
  );
}

export default Home;
