import React from 'react';
import { Link } from 'react-router';
let JXON = require('JXON');

function Home() {
    $.ajax({
        url: '/xml/apcp.xml',
        type: 'GET',
        dataType: 'xml',
        timeout: 1000,
        error: function(){
            console.error('Error loading XML document');
        },
        success: function(xml){
            //console.dir(xml);
            const jsonObj = JXON.build(xml);
            let airports = jsonObj.airports.airport;
            let strings = airports.map(function(e){ return e.shortcode + " - " + e.name + ", " + e.city + ", " + abbrState(e.state, "name")});
            setUpAirportsTypeAhead(strings)
        }
    });


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

    //const airports = getAirports();
    //const airportsStrings = airports.map(function(e){ return e.shortcode + " - " + e.name + ", " + e.city + ", " + abbrState(e.state, "name")});


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

    function setUpAirportsTypeAhead(airportsStrings) {
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
    }



    $(document).ready(function() {

        //$("#travelMode :input").change();
        function displayError() {
            $('#result').html("Uh oh, there was an error. Please reload the page and try again.");
        }

        function displayResult(timeToArrive, duration, startLocation, airport, isDriving, durationText){
            let leaveTime = new Date(timeToArrive - duration);



            let resultText="";
            //let resultText = "You should arrive at the airport by <span class='highlight'>" + new Date(timeToArrive).toTimeString() + "</span><br/>";
            //resultText += "Duration of travel in milliseconds is <span class='highlight'>" + duration + "</span><br/>";
            //resultText += "Duration of travel in english is <span class='highlight'>" + durationText + "</span><br/>";
            //let flightTimeObj = new Date(flightTime);
            let timeToLeave = dateFormat(leaveTime, "shortTime");
            let dayText = dateFormat(leaveTime, "isoDate") == dateFormat(new Date(), "isoDate") ? "today" : "on " + dateFormat(leaveTime, "dddd");

            resultText += "You should leave by<span class='highlight'> " + timeToLeave + " </span>" + dayText + "<br/>";
            //let msUntil = timeToLeave - Date.now();
            //let minUntil = msUntil / 60000;
            //resultText += "It's going to take " + minUntil + " minutes of travel time<br/>";
            /*if (minUntil < 0) {
                resultText += "<span class='small'>You should probably hurry</span><br/>";
            }*/



            let arrivalDateStr = dateFormat(new Date(timeToArrive), "mm/dd/yyyy");
            let arrivalTimeStr = dateFormat(new Date(timeToArrive), "HH:MM");
            let startStr = encodeURIComponent(startLocation);
            let destStr = encodeURIComponent(airport);
            let travelTypeFlag = isDriving ? 'd' : 'r';
            let travelText = isDriving ? 'drive' : 'take public transit';
            let directionsUrl = "https://www.google.com/maps?saddr=" + startStr + "&daddr=" + destStr + "&dirflg=" + travelTypeFlag + "&ttype=arr&date=" + arrivalDateStr + "&time=" + arrivalTimeStr;

            //resultText += '<br/><span class="small">It will take ' + durationText + ' to ' + travelText + ' to the airport.</span><br/>';
            resultText += '<br/><a target="_blank" class="small" href="' + directionsUrl + '">View directions on Google Maps</a><br/>';

            //console.dir(resultText);
            $('#result').html(resultText);
            $(window).scrollTo(document.getElementById('result'),1000);
        }

        function calculateDistances(timeToArrive, estimatedDeparture, transitMode, round, startLocation, airport) {
            let service = new google.maps.DistanceMatrixService();
            let travelMode = transitMode == "transit" ? google.maps.TravelMode.TRANSIT : google.maps.TravelMode.DRIVING;

            let departureTime = (estimatedDeparture < Date.now()) ? (Date.now() + 10000) : estimatedDeparture;

            let config = {
                origins: [startLocation], //array of origins
                destinations: [airport], //array of destinations
                travelMode: travelMode,
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                avoidHighways: false,
                avoidTolls: false,
                transitOptions: {
                    arrivalTime: new Date(timeToArrive)
                },
                drivingOptions: {
                    departureTime: new Date(departureTime),
                    trafficModel: 'pessimistic'
                }
            };
            //console.dir(config);
            service.getDistanceMatrix(config, function(response, status){callback(timeToArrive, estimatedDeparture, transitMode, round, response, status, startLocation, airport)});
        }

        function callback(timeToArrive, estimatedDeparture, transitMode, round, response, status, startLocation, airport) {

            if (status == google.maps.DistanceMatrixStatus.OK) {
                //console.log(response);
                let isDriving = (transitMode + '' == "driving");
                let durationObj = isDriving ? response.rows[0].elements[0].duration_in_traffic : response.rows[0].elements[0].duration;
                let duration = durationObj.value * 1000;
                let durationText = durationObj.text;
                //console.log(response);
                //console.log(durationText);
                //console.log(new Date(estimatedDeparture + duration));
                //console.log(round);
                if (round < 2 && isDriving) {
                    calculateDistances(timeToArrive, timeToArrive - duration, transitMode, round + 1, startLocation, airport)
                } else {
                    displayResult(timeToArrive, duration, startLocation, airport, isDriving, durationText)
                }
            } else {
                //console.log(status);
                displayError()
            }
        }

        let handleSubmit = function (e) {
            let airport = document.getElementById("airportInput").value;
            let startLocation = document.getElementById("startInput").value;
            let flightTime = document.getElementById("dateval").value;
            let transitMode = $('input[name="options2"]:checked').val();
            let hour = document.getElementById("hr").value;
            let minute = document.getElementById("min").value;
            let airportTimeModifier = hour * 60 + parseInt(minute);
            //console.dir(airport);
            //console.dir(startLocation);
            //console.dir(flightTime);
            //console.dir(transitMode);
            //console.dir(airportTimeModifier);

            let flightTimeObj = new Date(flightTime);
            let timeToArrive = flightTimeObj - airportTimeModifier * 60000;

            calculateDistances(timeToArrive, timeToArrive, transitMode, 1, startLocation, airport);
        };

        let form = $('.airport-form');
        form.on('submit', function(e){
            e.preventDefault();
            try{
                handleSubmit(e);
            } catch(e) {
                //console.log("exception caught");
                console.log(e);
                displayError();
            }
        });

        function initialize() {
            let input = document.getElementById('startInput');
            new google.maps.places.Autocomplete(input);
        }

        google.maps.event.addDomListener(window, 'load', initialize);

        $( "#locationButton" ).click(function() {
            //let infoWindow = new google.maps.InfoWindow;
            let geocoder = new google.maps.Geocoder;
            //let input = document.getElementById('startInput');
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    let pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    geocoder.geocode({'location': pos}, function(results, status) {
                        if (status === 'OK') {
                            if (results[0]) {
                                console.log(results);
                                $('#startInput').val(results[0].formatted_address);
                            } else {
                                window.alert('No results found');
                            }
                        } else {
                            window.alert('Geocoder failed due to: ' + status);
                        }
                    });
                }, function() {
                    handleLocationError(true);
                });
            } else {
                handleLocationError(false);
            }

            function handleLocationError(browserHasGeolocation) {
                let txt = browserHasGeolocation ?
                    'Error: The Geolocation service failed.' :
                    'Error: Your browser doesn\'t support geolocation.';
                $('#startInput').val(txt)
            }
        });



        $(function () {
            let now = new Date();
            let tomorrow = new Date(now.valueOf());
            tomorrow.setDate(tomorrow.getDate()+1);
            const dateStr = dateFormat(tomorrow, "isoDate") + " 18:30";
            //console.dir(tomorrow);
            //console.dir(dateStr);
            $('#datetimepicker12').datetimepicker({
                inline: true,
                sideBySide: true,
                minDate: "now",
                defaultDate: dateStr,
                stepping: 5
            }).on('dp.change', function(e) {
                $('#dateval').val(e.date);
            });
            $('#dateval').val(new Date(dateStr));
        });
    });


  return (
    <div>
        <div id="message"></div>
        <div>
            <form className="airport-form">
                <span className="label">Leaving From</span>
                <div className="form-group textola side-button">
                    <input id="startInput" type="text" name="s"  onClick={(e)=>{e.target.setSelectionRange(0, 1000)}} placeholder="New York, NY, United States" className="form-control"></input>
                    <span className="input-group-btn">
                        <button id="locationButton" className="btn btn-secondary" type="button"><span className="glyphicon glyphicon-map-marker"> </span></button>
                      </span>
                </div>
                <hr />
                <span className="label">To Airport</span>
                <div className="form-group textola">
                    <input id="airportInput" type="text" name="a"  onClick={(e)=>{e.target.setSelectionRange(0, 1000)}} className="form-control typeahead" placeholder="JFK - John F. Kennedy International, Jamaica, New York" autoComplete="off"></input>
                </div>
                <hr />
                <span className="label">Travel Mode</span>
                <span className="label floatright">Arrive How Early</span>
                <div className="form-group"  style={{margin:"0"}}></div>
                <div className="inputs">
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
                    <div style={{width:"144px", float: "right", marginRight:"5%"}}>
                        <div className="input-group hr"  style={{width:"60px", float: "left"}}>
                            <select className="form-control selectpicker" id="hr">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                            </select>
                            <span className="input-group-addon" id="basic-addon2">hr</span>
                        </div>
                        <div className="input-group min" style={{width:"79px", float: "right"}}>
                            <select defaultValue={30} className="form-control selectpicker" id="min">
                                <option>0</option>
                                <option>15</option>
                                <option>30</option>
                                <option>45</option>
                            </select>
                            <span className="input-group-addon" id="basic-addon2">min</span>
                        </div>
                    </div>
                </div>
                <div className="form-group"  style={{padding:"0"}}></div>
                <hr />
                <span className="label">Flight Departure Time</span>
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
