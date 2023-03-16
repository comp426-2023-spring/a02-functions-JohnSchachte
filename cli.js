#!/usr/bin/env node

import minimist from "minimist";
import moment from "moment-timezone";

const foo = minimist(process.argv)
// console.log(foo)
if(foo["h"]){
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`)
    process.exit(0);
}
var longitude;
var latitude;

// if((foo["s"]||foo["n"]) && (foo["e"] || foo["w"])){
//     throw Error("missing a longitude or latitude");
// }

function coordinatesValidate(coordinate) {
    // console.log(parseFloat(coordinate))
    if(isNaN(parseFloat(coordinate))){
        throw new Error("This was supposed to a number but you gave me shit.");
    }
}

// console.log((foo.hasOwnProperty("n") || foo.hasOwnProperty("s")) && (foo.hasOwnProperty("e") || foo.hasOwnProperty("w")))
if(!((foo.hasOwnProperty("n") || foo.hasOwnProperty("s")) && (foo.hasOwnProperty("e") || foo.hasOwnProperty("w")))){
    throw new Error("no latitude and no longitude set")
}

if(foo.hasOwnProperty("n")){
    coordinatesValidate(foo["n"]);
    longitude = parseFloat(foo["n"]);
}else if(foo.hasOwnProperty("s")){
    coordinatesValidate(foo["s"]);
    longitude = -1 * parseFloat(foo["s"]);
}
if(foo.hasOwnProperty("e")){
    coordinatesValidate(foo["e"]);
    latitude = parseFloat(foo["e"]);
}else if(foo.hasOwnProperty("w")){
    coordinatesValidate(foo["w"]);
    latitude = -1 * parseInt(foo["w"]);
}
var tz = foo["z"] ? foo["z"] : moment.tz.guess();
var days;
if(foo.hasOwnProperty("d")){
    coordinatesValidate(foo["d"]);
    days = parseInt(foo["d"]);
    if(days < 0 || days > 6){
        throw new Error("days should be in range of 0-6");
    }
} else{
    days = 1;
}

var url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_hours&timezone=${tz}&elevation=127&current_weather=true`
// var url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&elevation=127&current_weather=true&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,rain.json`;
// console.log(url)
var response = await fetch(url,{
    method : "GET",
    headers : {
        "Content-Type" : "application/json"
    }
});
// console.log(response)
const data = await response.json();
// console.log(data)

if(foo.hasOwnProperty("j")){
    console.log(data)
    process.exit(0);
}
console.log(data.daily.precipitation_hours)
var isGalosh = data.daily.precipitation_hours[days] >= 1 ? "You might need your galoshes " : "You will not need your galoshes";
if (days == 0) {
    console.log(isGalosh + " today.");
} else if (days == 1) {
    console.log(isGalosh + " tomorrow.");
} else {
    console.log(isGalosh + ` in ${days} days.`);
}
process.exit(0);