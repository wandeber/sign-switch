const DateTime = require('luxon').DateTime;
const fs = require('fs');
const execSync = require('child_process').execSync;

let data = {};
try {
  data = require('./data.json');
  if (data.lastSignIn) {data.lastSignIn = DateTime.fromISO(data.lastSignIn);}
}
catch (e) {
  console.log('Error reading file', e);
}

let currentDate = DateTime.now();
let days;
if (!data.lastSignIn || (days = currentDate.diff(data.lastSignIn, ['days']).days) > 0) {
  try {
    execSync('yarn run cypress:run:sign-in');
    data.lastSignIn = DateTime.now().toISO();
    fs.writeFileSync('./data.json', JSON.stringify(data));
  }
  catch {
    console.log('Error during sign in, check the video in ./videos/sign-in.js.mp4');
  }
  console.log('Finish');
}
else {
  console.log('Already done today.');
}
