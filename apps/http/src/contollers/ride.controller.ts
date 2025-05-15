import Container from "typedi";
import { RideService } from "../services/ride.service";
import { NextFunction, Request, Response } from "express";
import { CreateRideInput, Point, Ride, SearchPayload } from "@ridex/common";
import { ApiError } from "../error/ApiError";

export class RideController {
  public ride = Container.get(RideService);

  public createRide = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized')
      const ride: CreateRideInput = req.body;
      const user_id = req.user.id;
      const rideData: Ride = await this.ride.createRide({ rideData: ride, createdBy_id: user_id });

      res.status(201).json({ message: 'Ride Created', data: rideData });
    } catch (error) {
      next(error);
    }
  }

  public createPoint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const point: Partial<Point> = req.body;
      const pointData = await this.ride.createPoint(point);

      res.status(201).json({ message: 'Point Created', data: pointData });
    } catch (error) {
      next(error);
    }
  }

  public getRidesByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.body;
      const rides: Ride[] = await this.ride.getRidesByUserId(userId);

      res.status(200).json({ message: 'Rides Found', data: rides });
    } catch (error) {
      next(error);
    }
  }

  public getRideById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rideId: string = req.params.rideId || "";
      const ride: Ride = await this.ride.getRideById(rideId);

      res.status(200).json({ message: 'Ride Found', data: ride });
    } catch (error) {
      next(error);
    }
  }

  public searchRides = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: SearchPayload = req.body;
      const result = await this.ride.searchRides(payload);
      res.status(200).json({ message: 'Rides Found', data: result });
    } catch (error) {
      next(error)
    }
  }
}