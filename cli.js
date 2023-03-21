#!/usr/bin/env node

import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

const args = minimist(process.argv)
// console.log(args)
if(args["h"]){
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

// if((args["s"]||args["n"]) && (args["e"] || args["w"])){
//     throw Error("missing a longitude or latitude");
// }

function coordinatesValidate(coordinate) {
    // console.log(parseFloat(coordinate))
    if(isNaN(parseFloat(coordinate))){
        process.exit(0);
    }
}

// console.log((args.hasOwnProperty("n") || args.hasOwnProperty("s")) && (args.hasOwnProperty("e") || args.hasOwnProperty("w")))
if(!((args["n"] || args["s"]) && (args["e"] || args["w"]))){
    process.exit(0);
}

if(args.hasOwnProperty("n")){
    coordinatesValidate(args["n"]);
    longitude = parseFloat(args["n"]);
}else if(args.hasOwnProperty("s")){
    coordinatesValidate(args["s"]);
    longitude = -1 * parseFloat(args["s"]);
}
if(args.hasOwnProperty("e")){
    coordinatesValidate(args["e"]);
    latitude = parseFloat(args["e"]);
}else if(args.hasOwnProperty("w")){
    coordinatesValidate(args["w"]);
    latitude = -1 * parseInt(args["w"]);
}
var timezone = moment.tz.guess()
if (args.z) {
	timezone = args.z;
} else {
	timezone = timezone;
}
// var days;
// if(args.hasOwnProperty("d")){
//     coordinatesValidate(args["d"]);
//     days = parseInt(args["d"]);
//     if(days < 0 || days > 6){
//         process.exit(0);
//     }
// } else{
//     days = 1;
// }
var url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_hours&timezone=${timezone}&current_weather=true`
// var url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&elevation=127&current_weather=true&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,rain.json`;
// console.log(url)
var response = await fetch(url);
// Get the data from the request
const data = await response.json();


const days = args.d 

if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}

if (args.j) {
    console.log(data);
    process.exit(0);
}