const { execSync } = require('child_process');

module.exports =  function babelify() {
  execSync(
    'babel src/server -d build/server --presets=@babel/preset-typescript --extensions .ts'
  );
  execSync(
    'babel src/common -d build/common --presets=@babel/preset-typescript --extensions .ts'
  );
  console.log('Babelified successfully!');
}
