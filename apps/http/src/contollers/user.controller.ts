import { AddVehicle, UpdateUserPreference, UploadUrlType, User, Vehicle } from '@ridex/common';
import Container from "typedi";
import { UserService } from "../services/user.service";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../error/ApiError";

export class UserController {
  public user = Container.get(UserService);

  public getMyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized')
      const userId: string = req.user.id;
      const user = await this.user.getUserById(userId);
      res.status(200).json({ message: 'User Found', data: user });
    } catch (error) {
      next(error);
    }
  }

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.params.id) throw new ApiError(400, 'Invalid user id')
      const userId: string = req.params.id;
      const user = await this.user.getUserById(userId);
      res.status(200).json({ message: 'User Found', data: user });
    } catch (error) {
      next(error)
    }
  }

  public getUploadUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      if (!req.query.type || !req.query.fileType) throw new ApiError(400, 'Invalid file metadata');
      const { type, fileType }: UploadUrlType = req.query as { type: "profile-photo" | "vehicle-photo"; fileType: string };
      const userId: string = req.user.id;
      const data = await this.user.getUploadUrl({ type, fileType }, userId);
      res.status(200).json({ message: 'success', data });
    } catch (error) {
      next(error);
    }
  }

  public getViewUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.params.key) throw new ApiError(500, 'Invalid key');
      const key: string = req.params.key;
      const url = await this.user.getViewUrl(key);
      res.status(200).json({ message: 'success', data: url });
    } catch (error) {
      next(error)
    }
  }

  public updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      const id: string = req.user.id;
      const data = req.body as Pick<User, "bio" | 'name'>;
      if (!data.name) throw new ApiError(400, 'Name is required');
      const updatedUser = await this.user.updateUserProfile({ data: { id, name: data.name, bio: data.bio } });
      res.status(200).json({ message: 'success', data: updatedUser });
    } catch (error) {
      next(error)
    }
  }

  public uploadProfilePhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      const url: string = req.body.url;
      const id: string = req.user.id;
      await this.user.uploadProfilePhoto(url, id);
      res.status(200).json({ message: 'Profile photo uploaded successfully', data: null });
    } catch (error) {
      next(error)
    }
  }

  public deleteProfilePhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      const id: string = req.user.id;
      await this.user.deleteProfilePhoto(id);
      res.status(200).json({ message: 'Profile photo deleted successfully', data: null });
    } catch (error) {
      next(error)
    }
  }

  public deleteVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      const id: string = req.body.id;
      await this.user.deleteVehicle(id, req.user.id);
      res.status(200).json({ message: 'Vehicle deleted successfully', data: null });
    } catch (error) {
      next(error)
    }
  }

  public saveVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      const data = req.body as AddVehicle
      const vehicle = await this.user.saveVehicle(data, req.user.id);
      res.status(200).json({ message: 'Vehicle added successfully', data: vehicle });
    } catch (error) {
      next(error)
    }
  }

  public updateUserPreference = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      const id: string = req.user.id;
      const data = req.body as Partial<UpdateUserPreference>;
      const updatedUser = await this.user.updateUserPreference(data, id);
      res.status(200).json({ message: 'User preference updated successfully', data: updatedUser });
    } catch (error) {
      next(error)
    }
  }

}