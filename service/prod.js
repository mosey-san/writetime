const { execSync, spawn } = require('child_process');
const { writeLog, writeError } = require('../log');
const babelify = require('./babelify');

execSync('./node_modules/webpack-cli/bin/cli.js --mode production');
babelify();

const child = spawn('node', ['./build/server/index.js']);
child.stdout.on('data', data => {
  writeLog(data.toString('utf-8'));
});
child.stderr.on('data', data => {
  writeError(__dirname, data.toString('utf-8'));
});
