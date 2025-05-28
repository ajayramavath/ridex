export * from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
export { searchRides, createPoint, createRide } from '@prisma/client/sql'

class PrismaService {
  private static instance: PrismaClient

  private constructor() { }

  public static getClient(): PrismaClient {
    if (!PrismaService.instance) {
      if (typeof window !== 'undefined') {
        throw new Error('PrismaClient is not available in browser environment')
      }
      PrismaService.instance = new PrismaClient()
    }
    PrismaService.instance.$connect().then(() => {
      console.log("✅ Prisma connected successfully!")
    }).catch((error) => {
      console.error("❌ Prisma connection failed:", error)
    })
    return PrismaService.instance
  }
}

export const client = PrismaService.getClient();
export type PrismaClientType = typeof client;

export { Prisma };

export type {
} from '@prisma/client'

export type {
  User,
  Point,
  Ride,
  Passenger,
  Vehicle
} from '@prisma/client'

export type RideWhereInput = Prisma.RideWhereInput

export type RideWithPoints = Prisma.RideGetPayload<{
  include: {
    departure_point: true;
    destination_point: true;
    createdBy: {
      select: {
        name: true;
        email: true;
        profile_photo: true;
      }
    }
  }
}>

export type ReviewWithAuthor = Prisma.ReviewGetPayload<{
  include: {
    ride: true;
    author: {
      select: {
        id: true;
        name: true;
        profile_photo: true;
      }
    }
  }
}>

export type PassengerWithRide = Prisma.PassengerGetPayload<{
  include: {
    ride: {
      include: {
        departure_point: true;
        destination_point: true;
        createdBy: {
          select: {
            name: true;
            profile_photo: true;
            id: true;
          }
        }
      }
    }
  }
}>

export type GetRideResult = Prisma.RideGetPayload<{
  include: {
    departure_point: true;
    destination_point: true;
    createdBy: {
      select: {
        name: true;
        profile_photo: true;
        id: true;
        ratingsGot: true;
        vehicles: true;
      }
    };
    passenger: {
      include: {
        user: {
          select: {
            name: true;
            profile_photo: true;
            id: true;
          }
        };
      }
    }
  }
}>