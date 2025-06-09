import { PrismaClientType } from '@ridex/db';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@ridex/backend-common/config';
import { ApiError } from '../error/ApiError';
import { logger } from '../utils/logger';
import Container from 'typedi';

const getAuthorization = (req: Request) => {
  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];
  return null;
}

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);
    if (Authorization) {
      const { id } = verify(Authorization, JWT_SECRET) as JwtPayload;
      logger.info(`Authorization: ${Authorization} \n id: ${id}`);
      const client = Container.get("client") as PrismaClientType;
      const findUser = await client.user.findUnique({ where: { id } });

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new ApiError(401, 'Wrong authentication token'));
      }
    } else {
      next(new ApiError(401, 'NOT AUTHENTICATED'));
    }
  } catch (error) {
    logger.error(`Authorization Error: ${error}`);
    next(new ApiError(401, `${error}`));
  }
};