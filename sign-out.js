const DateTime = require('luxon').DateTime;
const fs = require('fs');
const execSync = require('child_process').execSync;

let data = {};
try {
  data = require('./data.json');
  if (data.lastSignOut) {data.lastSignOut = DateTime.fromISO(data.lastSignOut);}
}
catch (e) {
  console.log('Error reading file', e);
}

let currentDate = DateTime.now();
let days;
if (!data.lastSignOut || (days = currentDate.diff(data.lastSignOut, ['seconds']).seconds) > 0) {
  try {
    execSync('yarn run cypress:run:sign-out');
    data.lastSignOut = DateTime.now().toISO();
    fs.writeFileSync('./data.json', JSON.stringify(data));
  }
  catch {
    console.log('Error during sign out, check the video in ./videos/sign-out.js.mp4');
  }
  console.log('Finish');
}
