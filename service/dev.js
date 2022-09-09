const nodemon = require('nodemon');
const babelify = require('./babelify');

babelify();

nodemon({
  watch: ['./src/server'],
  ext: '.ts,.js',
  exec: 'node ./service/empty.js',
  legacyWatch: true
});

nodemon.on('restart', babelify);
