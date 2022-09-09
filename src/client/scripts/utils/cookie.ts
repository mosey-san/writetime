export interface ICookie {
  [key: string]: string
}

export const cookie = ((): ICookie => {
  const result:ICookie = {};

  if (document.cookie) {
    const pairs = document.cookie.split('; ');
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      if (key && value) {
        result[key] = value;
      }
    });
  }

  return result;
})();
