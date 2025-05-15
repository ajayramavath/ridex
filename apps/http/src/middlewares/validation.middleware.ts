import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../error/ApiError';
import { AnyZodObject, z } from 'zod';
import { logger } from '../utils/logger';

export const ValidationMiddleware = (schema: AnyZodObject, location: "body" | "query" | "params" | "cookies" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(req[location])
      schema.parse(req[location]);
      logger.info(`Request body is valid. Calling next middleware`);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map((error: z.ZodIssue) => error.message).join(', ');
        next(new ApiError(400, message));
      } else {
        next(new ApiError(400, `Request body is invalid. Error not instance of zod: ${error}`));
      }
    }
  };
};