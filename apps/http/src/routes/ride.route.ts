import { CreatePointSchema, CreateRideSchema, GetRideSchema, GetUserRidesSchema, Routes, SearchPayloadSchema } from "@ridex/common";
import express, { Router } from "express";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { RideController } from "../contollers/ride.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class RideRoute implements Routes {
  public path = "/rides";
  public router: Router = express.Router();
  public ride = new RideController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create-ride`, AuthMiddleware, ValidationMiddleware(CreateRideSchema), this.ride.createRide);
    this.router.post(`${this.path}/create-point`, ValidationMiddleware(CreatePointSchema), this.ride.createPoint);
    this.router.get(`${this.path}/user-rides`, AuthMiddleware, ValidationMiddleware(GetUserRidesSchema), this.ride.getRidesByUserId);
    this.router.get(`${this.path}/:rideId`, ValidationMiddleware(GetRideSchema, "params"), this.ride.getRideById);
    this.router.post(`${this.path}/search`, ValidationMiddleware(SearchPayloadSchema), this.ride.searchRides);
    this.router.get(`${this.path}/getRideById/:id`, ValidationMiddleware(GetRideSchema, "params"), this.ride.getRideById);
  }
}