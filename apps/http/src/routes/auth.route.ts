import express, { Router } from 'express';
import { AuthController } from '../contollers/auth.controller';
import { CreateUserSchema, SigninSchema, RefreshTokenSchema } from '@ridex/common';
import { Routes } from '@ridex/common';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ValidationMiddleware } from '../middlewares/validation.middleware';

export class AuthRoute implements Routes {
  public path = '/';
  public router: Router = express.Router();
  public auth = new AuthController();

  constructor() {
    console.log("Auth route initializing...");
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, ValidationMiddleware(CreateUserSchema), this.auth.signUp);
    this.router.post(`${this.path}login`, ValidationMiddleware(SigninSchema), this.auth.logIn);
    this.router.post(`${this.path}logout`, AuthMiddleware, this.auth.logOut);
    this.router.post(`${this.path}refresh`, ValidationMiddleware(RefreshTokenSchema, 'cookies'), this.auth.refresh);
  }
}