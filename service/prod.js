const { execSync, spawn } = require('child_process');
const { writeLog, writeError } = require('../log');
const babelify = require('./babelify');

execSync('./node_modules/webpack-cli/bin/cli.js --mode production');
execSync(
  './node_modules/@babel/cli/bin/babel.js src/server -d build/server --presets=@babel/preset-typescript --extensions .ts'
);
execSync(
  './node_modules/@babel/cli/bin/babel.js src/common -d build/common --presets=@babel/preset-typescript --extensions .ts'
);

const child = spawn('node', ['./build/server/index.js']);
child.stdout.on('data', data => {
  writeLog(data.toString('utf-8'));
});
child.stderr.on('data', data => {
  writeError(__dirname, data.toString('utf-8'));
});
