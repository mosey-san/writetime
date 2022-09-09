import { AxiosError } from "axios";
import { Response } from "express";

export function createResolver(res: Response) {
  return function (status: number, data: object | string) {
    res
      .status(status)
      .send({ success: true, data });
  };
}

export function createRejecter(res: Response) {
  return function (status: number, error: any) {
    if (error instanceof AxiosError) {
      res
        .status(status)
        .send({ success: false, error });
      } else {
        res
          .status(status)
          .send({ success: false, error: new AxiosError(error, String(status)) });
    }
  };
}
