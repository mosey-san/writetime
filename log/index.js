const fs = require('fs');
const path = require('path');

function writeLog(msg) {
  const data = {
    date: new Date(),
    msg,
  };
  fs.writeFileSync(
    path.join(__dirname, 'app.log'),
    JSON.stringify(data) + '\n',
    {
      flag: 'a',
    }
  );
}

function writeError(errorPath, error) {
  const data = {
    date: new Date(),
    errorPath,
    error,
  };
  fs.writeFileSync(
    path.join(__dirname, 'error.log'),
    JSON.stringify(data) + '\n',
    {
      flag: 'a',
    }
  );
}

module.exports = {
  writeLog,
  writeError
}
