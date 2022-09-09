import { ITokenRes } from '../../common/types';
import axios from 'axios';
import { getENV } from '../utils/env';

const prefix =
  getENV('IS_DEV') === 'true' ? 'https://cors-anywhere.herokuapp.com/' : '';

export const yaToken = {
  fromCode(code: string, host: string) {
    const client_id = getENV('CLIENT_ID_FILE');
    const client_secret = getENV('CLIENT_SECRET_FILE');
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    return axios.post<ITokenRes>(
      prefix + 'https://oauth.yandex.ru/token',
      params,
      {
        headers: {
          Origin: host,
          'Content-type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${client_id}:${client_secret}`
          ).toString('base64')}`,
        },
      }
    );
  },
  fromToken(token: string, host: string) {
    const client_id = getENV('CLIENT_ID_FILE');
    const client_secret = getENV('CLIENT_SECRET_FILE');
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', token);
    return axios.post<ITokenRes>(
      prefix + 'https://oauth.yandex.ru/token',
      params,
      {
        headers: {
          Origin: host,
          'Content-type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${client_id}:${client_secret}`
          ).toString('base64')}`,
        },
      }
    );
  },
};

export const user = {
  info(token: string) {
    return axios.get('https://login.yandex.ru/info?format=json', {
      headers: {
        Authorization: `OAuth ${token}`,
      },
    });
  },
};
