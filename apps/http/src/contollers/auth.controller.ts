import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { SigninDto, User } from '@ridex/common';
import { AuthService } from '../services/auth.service';
import { TokenExpiredError } from 'jsonwebtoken';
import { ApiError } from '../error/ApiError';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const signUpUserData: Partial<User> = await this.auth.signup(userData);

      res.status(201).json({ message: 'Signup Successfull', data: signUpUserData, });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: SigninDto = req.body;
      const { findUser, accessToken, refreshToken } = await this.auth.login(userData);

      res.cookie('refreshToken', refreshToken.token, {
        httpOnly: true,
        expires: new Date(Date.now() + refreshToken.expiresIn * 1000),
        domain: 'localhost',
        sameSite: 'none',
        secure: false
      });
      res.status(200).json({ message: 'Login Successful', data: findUser, accessToken });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user as User;
      const logOutUserData: User = await this.auth.logout(userData);

      res.clearCookie('refreshToken', { httpOnly: true });
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.cookies;
      const { findUser, accessToken, refreshToken: newRefreshToken } = await this.auth.refresh(refreshToken);

      res.cookie('refreshToken', newRefreshToken.token, {
        httpOnly: true,
        expires: new Date(newRefreshToken.expiresIn * 1000)
      });
      res.status(200).json({ message: 'Refresh Successful', data: findUser, accessToken });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        res.clearCookie('refreshToken', { httpOnly: true });
        next(new ApiError(401, 'Refresh Token Expired. Please Login Again'));
      }
      next(error);
    }
  }
}