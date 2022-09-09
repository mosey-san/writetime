import fs from 'fs';

export function getENV(name: string): string {
  let result = '';
  if (name.endsWith('_FILE')) {
    const path = String(process.env[name]);
    result += fs.readFileSync(path).toString('utf-8');
    if (result.length) {
      result = result.replace('\n', '');
    }
  } else {
    result += process.env[name];
  }
  return result;
}
