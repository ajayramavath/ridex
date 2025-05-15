import { client, GetRideResult, PrismaClientType } from "@ridex/db";
import type { RideWhereInput, User } from '@ridex/common'
import { CreateRideInput, Point, Ride, RideSearchResult, SearchPayload, RideWithPoints, RideResult } from "@ridex/common"
import Container, { Inject, Service } from "typedi";
import { ApiError } from "../error/ApiError";
import geohash from 'ngeohash';
import { logger } from "../utils/logger";

@Service()
export class RideService {
  private client: PrismaClientType;

  constructor() {
    this.client = Container.get("client");
    if (!this.client) {
      throw new Error("Prisma client not available");
    }
  }

  public async createPoint(pointData: Partial<Point>): Promise<Point> {
    const { latitude, longitude, place_id, short_address, full_address, city } = pointData;
    if (latitude === undefined || longitude === undefined || place_id === undefined || short_address === undefined || full_address === undefined || city === undefined)
      throw new ApiError(409, "Invalid point data");
    logger.info(geohash.encode(latitude, longitude, 12))
    const geohashes = this.generateGeohashes(latitude, longitude);

    const existingPoint = await this.findExistingPoint({
      place_id,
      latitude,
      longitude,
      geohashes
    });

    // const existingPoint = await this.point.findFirst({ where: { geohash: geohashData } });
    if (existingPoint) return existingPoint;

    const createPointData = await this.client.point.create({
      data: {
        latitude,
        longitude,
        place_id,
        short_address,
        full_address,
        city,
        geohash6: geohashes.geohash6,
        geohash7: geohashes.geohash7,
        geohash8: geohashes.geohash8,
        geohash_full: geohashes.geohash_full,
        ...pointData,
      }
    });
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

  private async findExistingPoint(params: {
    place_id?: string;
    latitude: number;
    longitude: number;
    geohashes: {
      geohash6: string;
      geohash7: string;
      geohash8: string;
      geohash_full: string;
    }
  }): Promise<Point | null> {
    const { place_id, geohashes } = params;
    if (place_id) {
      const byPlaceId = await this.client.point.findFirst({ where: { place_id } })
      if (byPlaceId) return byPlaceId;
    }
    const nearby = await this.client.point.findFirst({
      where: {
        OR: [
          { geohash8: geohashes.geohash8 },
          { geohash7: geohashes.geohash7 },
        ]
      }
    });
    return nearby;
  }

  public async createRide({ rideData, createdBy_id }: { rideData: CreateRideInput, createdBy_id: string }): Promise<Ride> {
    const {
      departurePointId,
      destinationPointId,
      departureTime,
      availableSeats,
      price
    } = rideData;
    const createRideData = await this.client.ride.create({
      data: {
        departure_point_id: departurePointId,
        destination_point_id: destinationPointId,
        departure_time: departureTime,
        available_seats: availableSeats,
        price,
        createdBy_id
      }
    });
    return createRideData;
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
            vehicles: true,
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

  public async searchRides(searchPayload: SearchPayload): Promise<RideSearchResult> {
    const { from, to } = searchPayload;
    if (!from || !to) throw new ApiError(409, "Invalid search payload");

    const departure_point = await this.client.point.findUnique({ where: { id: from } });
    const destination_point = await this.client.point.findUnique({ where: { id: to } });

    if (!departure_point || !destination_point) throw new ApiError(409, `Points with ids ${from} and ${to} doesn't exist`);

    return this.multiStageRideSearch({
      departure_point,
      destination_point,
      filters: searchPayload
    })
  }

  private async multiStageRideSearch(params: {
    departure_point: Point;
    destination_point: Point;
    filters: Omit<SearchPayload, 'departurePointId' | 'destinationPointId'>;
  }): Promise<RideSearchResult> {
    const candidateRides = await this.client.ride.findMany({
      where: this.buildInitialWhereClause(params),
      include: { departure_point: true, destination_point: true, createdBy: { select: { name: true, email: true, profile_photo: true } } },
    })

    const filteredRides = this.filterByExactDistance({
      rides: candidateRides,
      departure_point: params.departure_point,
      destination_point: params.destination_point,
      maxDistanceKm: params.filters.maxDistanceKm * 1000 || 20000
    })

    //sort and filter here

    return {
      results: filteredRides,
      total: filteredRides.length,
      page: params.filters.page || 1,
      limit: params.filters.limit || 10
    }
  }

  private buildInitialWhereClause(params: {
    departure_point: Point;
    destination_point: Point;
    filters: Partial<SearchPayload>;
  }): RideWhereInput {
    const searchPrecision = 4;
    const departureDateOnly = params.filters.departureTime
      ? new Date(params.filters.departureTime).toISOString().split('T')[0]
      : undefined;
    return {
      departure_point: {
        geohash_full: {
          startsWith: params.departure_point.geohash_full.substring(0, searchPrecision)
        }
      },
      destination_point: {
        geohash_full: {
          startsWith: params.destination_point.geohash_full.substring(0, searchPrecision)
        }
      },
      // departure_time: params.filters.departureTime
      //   ? {
      //     gte: new Date(`${departureDateOnly}T00:00:00.000Z`),
      //     lte: new Date(`${departureDateOnly}T23:59:59.999Z`)
      //   }
      //   : undefined
    }
  }

  private filterByExactDistance(params: {
    rides: RideWithPoints[];
    departure_point: Point;
    destination_point: Point;
    maxDistanceKm: number;
  }): RideResult[] {
    const filteredRides = params.rides.map((ride) => {
      const originDistance = this.calculateDistance({
        point1: params.departure_point,
        point2: ride.departure_point
      })

      const destinationDistance = this.calculateDistance({
        point1: params.destination_point,
        point2: ride.destination_point
      })
      logger.info(`Origin Distance: ${originDistance}, Destination Distance: ${destinationDistance}`);

      if (originDistance <= params.maxDistanceKm &&
        destinationDistance <= params.maxDistanceKm) {
        return { ...ride, origin_distance: originDistance, destination_distance: destinationDistance }
      }
    })
    const results = filteredRides.filter((ride) => {
      return ride !== undefined
    })
    return results
  }

  private calculateDistance(params: {
    point1: Point;
    point2: Point;
  }): number {
    const { latitude: lat1, longitude: lon1 } = params.point1;
    const { latitude: lat2, longitude: lon2 } = params.point2;

    return this.harvesineDistance(lat1, lon1, lat2, lon2);
  }

  private harvesineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;

    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}