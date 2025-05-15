import { Request } from 'express';
import { User } from '@ridex/db/client';

export interface RequestWithUser extends Request {
  user: User
}

declare module 'express' {
  interface Request {
    user?: User;
  }
}