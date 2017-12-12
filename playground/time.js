// 00:00:00 Jan 1st 1970 - unix epoch
// - pre epoch 0 + post epoch
// stored in ms

const moment = require('moment');

// const date = new Date();
// const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// console.log(months[date.getMonth()]);

const date = moment();
// console.log(date.format('MMM YYYY'));

// date.add(100, 'year').subtract(9, 'months');
// console.log(date.format('MMM Do, YYYY'));

// challenge: 10:35 am
console.log(date.format('h:mm a'));

const timestamp = moment().valueOf();
console.log(`timestamp: ${timestamp}`);