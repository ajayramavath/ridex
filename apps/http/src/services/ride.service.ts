import { client, GetRideResult, PrismaClientType, PrismaPromise } from "@ridex/db";
import { createRide, searchRides, createPoint } from '@prisma/client/sql'
import type { RideWhereInput, User } from '@ridex/common'
import { CreateRideInput, Point, Ride, RideSearchResult, SearchPayload, RideWithPoints, RideResult } from "@ridex/common"
import Container, { Inject, Service } from "typedi";
import { ApiError } from "../error/ApiError";
import geohash from 'ngeohash';
import { logger } from "../utils/logger";
import { Result } from "@prisma/client/runtime/client";
import polyline from "@mapbox/polyline";
import { randomUUID } from 'crypto'
@Service()
export class RideService {
  private client: PrismaClientType;

  constructor() {
    this.client = Container.get("client");
    if (!this.client) {
      throw new Error("Prisma client not available");
    }
  }

  public async createPoint({
    latitude,
    longitude,
    place_id,
    city,
    full_address,
    short_address,
    premise,
    postal_code
  }: {
    latitude: number,
    longitude: number,
    place_id: string,
    city: string,
    full_address: string,
    short_address?: string,
    premise?: string,
    postal_code?: string
  }): Promise<PrismaPromise<createPoint.Result[]>> {
    if (latitude === undefined || longitude === undefined || place_id === undefined || short_address === undefined || full_address === undefined || city === undefined)
      throw new ApiError(409, "Invalid point data");
    logger.info(geohash.encode(latitude, longitude, 12))
    const geohashes = this.generateGeohashes(latitude, longitude);
    const uuid = randomUUID();
    const createPointData = this.client.$queryRawTyped(createPoint(
      longitude,
      latitude,
      geohashes.geohash6, geohashes.geohash7, geohashes.geohash8, geohashes.geohash_full,
      place_id, city, short_address, full_address, "", "", uuid
    ))
    return createPointData;
  }

  private generateGeohashes(lat: number, lng: number): {
    geohash6: string;
    geohash7: string;
    geohash8: string;
    geohash_full: string;
  } {
    return {
      geohash6: geohash.encode(lat, lng, 6),
      geohash7: geohash.encode(lat, lng, 7),
      geohash8: geohash.encode(lat, lng, 8),
      geohash_full: geohash.encode(lat, lng, 12)
    };
  }

  public async createRide({ rideData, createdBy_id }: { rideData: CreateRideInput, createdBy_id: string }):
    Promise<PrismaPromise<createRide.Result[]>> {
    const user = await this.client.user.findUnique({ where: { id: createdBy_id }, select: { vehicleId: true } })
    if (!user) throw new Error("User not found")
    if (!user.vehicleId) throw new Error("User doesn't have a vehicle")
    const {
      from,
      to,
      polyline: routePolyline,
      departureTime,
      availableSeats,
      price,
      rideDistance_m,
      rideDuration_s
    } = rideData;

    const departureResult = await this.createPoint(from);
    const destinationResult = await this.createPoint(to);

    const departurePointId = departureResult[0]?.id;
    const destinationPointId = destinationResult[0]?.id;

    if (!departurePointId || !destinationPointId) throw new ApiError(409, `Error in Point Creation`);

    const coords = polyline.decode(routePolyline);
    const decoded = 'LINESTRING(' +
      coords
        .map(([lat, lng]) => `${lng} ${lat}`)
        .join(',') +
      ')'

    const rideDuration = rideDuration_s.endsWith('s') ? parseInt(rideDuration_s.slice(0, -1)) : parseInt(rideDuration_s);

    const pricePerKm = price / (rideDistance_m / 1000);
    const uuid = randomUUID();
    const createRideData = await this.client.$queryRawTyped(createRide(
      departurePointId,
      destinationPointId,
      decoded,
      routePolyline,
      new Date(departureTime),
      availableSeats,
      price,
      createdBy_id,
      rideDistance_m,
      rideDuration,
      pricePerKm,
      uuid
    ))
    return createRideData;
  }

  public async searchRides(searchPayload: SearchPayload): Promise<PrismaPromise<searchRides.Result[]>> {
    const { from_lat, from_lng, to_lat, to_lng, maxDistanceKm } = searchPayload;
    const searchResults = await this.client.$queryRawTyped(searchRides(from_lng, from_lat, maxDistanceKm * 1000, to_lng, to_lat));
    return searchResults;
  }


  public async getRideById(rideId: string): Promise<GetRideResult> {
    const findRide = await this.client.ride.findUnique({
      where: { id: rideId },
      include: {
        departure_point: true,
        destination_point: true,
        createdBy: {
          select: {
            name: true,
            profile_photo: true,
            id: true,
            ratingsGot: true,
            vehicle: true,
          }
        },
        passenger: {
          include: {
            user: {
              select: {
                name: true,
                profile_photo: true,
                id: true,
              }
            }
          }
        }
      }
    });
    if (!findRide) throw new ApiError(409, `Ride with id ${rideId} doesn't exist`);
    return findRide;
  }

  public async getRidesByUserId(userId: string): Promise<Ride[]> {
    const dbUser = await this.client.ride.findUnique({ where: { id: userId } });
    if (!dbUser) throw new ApiError(409, `User with id ${userId} doesn't exist`);

    const findRides = await this.client.ride.findMany({ where: { createdBy_id: userId } });
    if (!findRides) throw new ApiError(409, `No rides found for user with id ${userId}`);

    return findRides;
  }
}