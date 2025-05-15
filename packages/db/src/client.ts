import { Prisma, PrismaClient } from '@prisma/client';

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
    console.log(PrismaService.instance)
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
  Passenger
} from '@prisma/client'

export type RideWithPoints = Prisma.RideGetPayload<{
  include: { departure_point: true, destination_point: true, createdBy: true }
}>

export type RideWhereInput = Prisma.RideWhereInput