import { AxiosError } from "axios"

export interface ITokenRes {
  access_token: string,
  expires_in: number,
  refresh_token: string,
  token_type: 'bearer'
}

export interface RESTresponse<T> {
  success: boolean,
  data: T | undefined,
  error: AxiosError | undefined
}
