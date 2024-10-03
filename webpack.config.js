const path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    path: path.resolve('./build', ''),
    filename: 'script.js',
    },
  watch:true
};