import { Routes, GetUploadUrlSchema, GetViewUrlSchema, UpdateProfileInfoSchema, UpdateProfilePhotoSchema, AddVehicleSchema, UpdateVehicleSchema, GetUserSchema, UpdateUserPreferenceSchema } from "@ridex/common";
import express, { Router } from "express";
import { UserController } from "../contollers/user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";

export class UserRoute implements Routes {
  public path = "/user"
  public router: Router = express.Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/get-user`, AuthMiddleware, this.user.getMyUser);
    this.router.get(`${this.path}/upload-url/`, AuthMiddleware, ValidationMiddleware(GetUploadUrlSchema, "query"), this.user.getUploadUrl);
    this.router.get(`${this.path}/view-url/:key`, ValidationMiddleware(GetViewUrlSchema, "params"), this.user.getViewUrl);
    this.router.patch(`${this.path}/update-profile-info`, AuthMiddleware, ValidationMiddleware(UpdateProfileInfoSchema), this.user.updateUserProfile);
    this.router.patch(`${this.path}/update-profile-photo`, AuthMiddleware, ValidationMiddleware(UpdateProfilePhotoSchema), this.user.uploadProfilePhoto);
    this.router.delete(`${this.path}/delete-profile-photo`, AuthMiddleware, this.user.deleteProfilePhoto);
    this.router.post(`${this.path}/save-vehicle`, AuthMiddleware, ValidationMiddleware(AddVehicleSchema), this.user.saveVehicle);
    this.router.get(`${this.path}/getUserById/:id`, ValidationMiddleware(GetUserSchema, "params"), this.user.getUserById);
    this.router.patch(`${this.path}/update-preference`, AuthMiddleware, ValidationMiddleware(UpdateUserPreferenceSchema), this.user.updateUserPreference);
  }
}