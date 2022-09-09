const { execSync } = require('child_process');

module.exports =  function babelify() {
  execSync(
    './node_modules/@babel/cli/bin/babel.js src/server -d build/server --presets=@babel/preset-typescript --extensions .ts'
  );
  execSync(
    './node_modules/@babel/cli/bin/babel.js src/common -d build/common --presets=@babel/preset-typescript --extensions .ts'
  );
  console.log('Babelified successfully!');
}
