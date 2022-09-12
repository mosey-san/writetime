import { NextFunction, Request, Response } from 'express';
import { user, yaToken } from '../api';
import { User } from '../database/User';
import { chipher } from '../crypto/chipher';
import { getENV } from '../utils/env';
import { dechipher } from '../crypto/dechipher';
import crypto from 'crypto';
import { JWT } from '../crypto/jwt';
import { writeError } from '@root/log';

interface IUserInfo {
  id: string;
  display_name: string;
  real_name: string;
  first_name: string;
  last_name: string;
  sex: string;
  default_avatar_id: string;
  iat?: number;
  exp?: number;
}

export async function rootPathMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.cookies.client_id) {
    res.cookie('client_id', getENV('CLIENT_ID_FILE'), {
      secure: true,
    });
  }

  if (req.query.code) {
    let data;
    try {
      const response = await yaToken.fromCode(
        String(req.query.code),
        req.headers.host ?? ''
      );
      data = response.data;
    } catch (error) {
      writeError(__dirname, JSON.stringify(error));
    }

    if (data) {
      let userInfo;
      try {
        const response = await user.info(data.access_token);
        userInfo = response.data;
      } catch (error) {
        writeError(__dirname, JSON.stringify(error));
      }
      let dbUser;
      try {
        dbUser = await User.findOne({
          id: Buffer.from(userInfo.id).toString('base64'),
        });
      } catch (error) {
        res.cookie('error', JSON.stringify(error));
      }

      const RT = crypto.randomBytes(16).toString('hex');
      const expires = Date.now() + data.expires_in * 1000;

      try {
        if (dbUser) {
          dbUser.refresh_tokens.push(chipher(RT));
          await User.updateOne({ id: dbUser.id }, dbUser);
        } else {
          const user = new User({
            id: Buffer.from(userInfo.id).toString('base64'),
            refresh_tokens: [chipher(RT)],
            app: {
              access_token: chipher(data.access_token),
              refresh_token: chipher(data.refresh_token),
              expires_in: expires,
            },
          });
          await user.save();
        }
      } catch (error) {
        res.cookie('error', JSON.stringify(error));
      }

      res.cookie(
        'JWT',
        JWT.sign(
          {
            id: userInfo.id,
            display_name: userInfo.display_name,
            real_name: userInfo.real_name,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            sex: userInfo.sex,
            default_avatar_id: userInfo.default_avatar_id,
          },
          {
            expiresIn: 30,
          }
        )
      );
      res.cookie('RT', JWT.sign({ refresh_token: chipher(RT) }), {
        maxAge: data.expires_in * 1000 * 2,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
    }
  } else if (req.cookies.JWT && req.cookies.RT) {
    const jwtVerify = JWT.verify(req.cookies.JWT);
    const rtVerify = JWT.verify(req.cookies.RT);
    if (
      jwtVerify.reason === 'expired' &&
      rtVerify.success &&
      jwtVerify.payload instanceof Object &&
      rtVerify.payload instanceof Object
    ) {
      const dbUser = await User.findOne({
        id: Buffer.from(jwtVerify.payload.id).toString('base64'),
      });
      if (dbUser) {
        const RT = dechipher(rtVerify.payload.refresh_token);
        const tokensCount = dbUser.refresh_tokens.length;
        dbUser.refresh_tokens = dbUser.refresh_tokens.filter(
          token => dechipher(token) !== RT
        );

        if (dbUser.refresh_tokens.length !== tokensCount) {
          const newRT = crypto.randomBytes(16).toString('hex');
          dbUser.refresh_tokens.push(chipher(newRT));
          await User.updateOne({ id: dbUser.id }, dbUser);
          delete jwtVerify.payload.iat;
          delete jwtVerify.payload.exp;
          res.cookie(
            'JWT',
            JWT.sign(jwtVerify.payload, {
              expiresIn: 30 * 60,
            }),
            {
              maxAge: Number(dbUser.app.expires_in),
              secure: true,
              sameSite: 'lax',
            }
          );
          res.cookie('RT', JWT.sign({ refresh_token: chipher(newRT) }), {
            maxAge: Number(dbUser.app.expires_in),
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
          });
        } else {
          res.clearCookie('JWT');
          res.clearCookie('RT');
        }
      }
    }
    if (jwtVerify.reason === 'error' || !rtVerify.success) {
      res.clearCookie('JWT');
      res.clearCookie('RT');
    }
  }
  next();
}
