const fs = require('fs');
const process = require('node:process');
const path = require('path');

const pathToTextFile = path.join(__dirname, 'text.txt');

const { stdin } = process;
const stream = fs.createWriteStream(pathToTextFile, 'utf-8');
console.log('Hi! Enter the text \n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    stream.write(data, 'utf-8');
  }
});
process.on('SIGINT', () => {
  process.exit();
});
process.on('exit', () => {
  console.log('Bye! \n');
});
