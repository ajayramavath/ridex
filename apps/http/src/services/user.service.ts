import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaClientType } from "@ridex/db";
import Container, { Service } from "typedi";
import { ApiError } from "../error/ApiError";
import s3Client from "../utils/s3Client";
import { UploadUrlType, User, Vehicle, UpdateUserPreference, AddVehicle } from '@ridex/common'
import { logger } from "../utils/logger";

@Service()
export class UserService {
  private client: PrismaClientType;

  constructor() {
    this.client = Container.get("client");
    if (!this.client) {
      throw new Error("Prisma client not available");
    }
  }

  public async getUserById(userId: string): Promise<Partial<User>> {
    const findUser = await this.client.user.findUnique({
      where: { id: userId },
      include: {
        vehicle: true,
        joined_rides: {
          include: {
            ride: {
              include: {
                departure_point: true,
                destination_point: true,
                createdBy: {
                  select: {
                    id: true,
                    name: true,
                    profile_photo: true
                  }
                }
              }
            }
          }
        },
        posted_rides: {
          include: {
            departure_point: true,
            destination_point: true
          }
        },
        ratingsGiven: true,
        ratingsGot: true,
        reviewsGiven: true,
        reviewsGot: {
          include: {
            ride: true,
            author: {
              select: {
                name: true,
                profile_photo: true,
                id: true,
              }
            },
          }
        },
      },
      omit: {
        password: true,
        refresh_token: true,
      }
    });
    if (!findUser) throw new Error("User not found");
    return findUser;
  }

  private getFileKey(fileMetadata: Pick<UploadUrlType, 'type'>, userId: string): string {
    const fileType = fileMetadata.type === "profile-photo" ? 'profile' : 'vehicle'
    const key = `user-uploads/${userId}/${fileType}/${Date.now()}/${crypto.randomUUID()}`;
    return key;
  }

  public async getUploadUrl({ type, fileType }: UploadUrlType, userId: string): Promise<{ url: string, key: string }> {
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(fileType)) {
      throw new ApiError(400, 'Invalid file type');
    }

    const key = this.getFileKey({ type }, userId);
    logger.info(key, fileType, process.env.AWS_S3_BUCKET_NAME)

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      Metadata: { uploadedBy: userId }
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn: 180 })

    return { url, key };
  }

  public async getViewUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    })
    const url = await getSignedUrl(s3Client, command);
    return url;
  }

  public async updateUserProfile({ data }: { data: Pick<User, 'id' | "bio" | 'name'> }): Promise<Omit<User, 'password' | 'refresh_token'>> {
    const { id, bio, name } = data;
    const user = await this.client.user.update({
      where: { id },
      data: {
        name,
        bio
      },
      omit: {
        password: true,
        refresh_token: true
      },
      include: {
        vehicle: true,
      }
    })
    return user;
  }

  public async uploadProfilePhoto(url: string, id: string): Promise<void> {
    await this.client.user.update({
      where: { id },
      data: {
        profile_photo: url
      }
    })
  }

  public async deleteProfilePhoto(id: string): Promise<void> {
    await this.client.user.update({
      where: { id },
      data: {
        profile_photo: null
      }
    })
  }

  public async deleteVehicle(id: string, userId: string): Promise<void> {
    await this.client.user.delete({
      where: { id: userId, vehicleId: id }
    })
  }

  public async saveVehicle(data: AddVehicle, userId: string): Promise<Vehicle> {
    const user = await this.client.user.update({
      where: { id: userId },
      data: {
        vehicle: {
          upsert: {
            create: {
              name: data.name,
              brand: data.brand,
              color: data.color,
              photo1: data.photo1,
              photo2: data.photo2,
            },
            update: {
              name: data.name,
              brand: data.brand,
              color: data.color,
              photo1: data.photo1,
              photo2: data.photo2,
            }
          }
        }
      },
      include: {
        vehicle: true
      }
    })
    if (!user.vehicle) throw new ApiError(409, 'Failed to create or update vehicle')
    return user.vehicle
  }

  public async updateUserPreference(data: Partial<UpdateUserPreference>, userId: string): Promise<Omit<User, 'password' | 'refresh_token'>> {
    const user = await this.client.user.update({
      where: { id: userId },
      data: {
        chatPreference: data.chatPreference,
        musicPreference: data.musicPreference,
        smokingPreference: data.smokingPreference,
        petPreference: data.petPreference,
      }
    })
    return user
  }
}