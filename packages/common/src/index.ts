export type {
  Point,
  Ride,
  RideWhereInput,
  Passenger,
  User,
  RideWithPoints,
  Vehicle,
  PreferenceOption,
  PassengerWithRide,
  GetRideResult,
  Rating
} from '@ridex/db';
import { z } from 'zod'
import { Router } from "express";
import { Rating, Review, Ride, RideWithPoints, User, Vehicle, ReviewWithAuthor, PassengerWithRide } from '@ridex/db'

export interface RideResult extends RideWithPoints {
  origin_distance: number;
  destination_distance: number;
}

export const CreateUserSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters"
  }),
  email: z.string().email({
    message: "Email is invalid"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters"
  })
})

export const CreateUserSchemaClient = CreateUserSchema.merge(
  z.object({
    confirmPassword: z.string().min(8),
  })
).refine(
  (data) => data.password === data.confirmPassword,
  { message: "Passwords do not match", path: ["confirmPassword"] }
);

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export type Signin = z.infer<typeof SigninSchema>

export const RefreshTokenSchema = z.object({
  refreshToken: z.string()
})

export const CreatePointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  place_id: z.string().min(1),
  city: z.string().min(1),
  short_address: z.string().optional(),
  full_address: z.string().min(1),
  premise: z.string().optional(),
  postal_code: z.string().optional()
})

export const CreatePointResponseSchema = CreatePointSchema.extend({
  id: z.string().uuid()
});

export type CreatePointInput = z.infer<typeof CreatePointSchema>;

export const CreateRideSchema = z.object({
  departurePointId: z.string().uuid(),
  destinationPointId: z.string().uuid(),
  departureTime: z.coerce.date(),
  availableSeats: z.number().min(1).max(4),
  price: z.coerce.number().min(0),
})

export type CreateRideInput = z.infer<typeof CreateRideSchema>

export const createPassengerSchema = z.object({
  ride_id: z.string().uuid(),
  user_id: z.string().uuid(),
  joinedAt: z.coerce.date().default(new Date()),
});

export const GetUserRidesSchema = z.object({
  userId: z.string().uuid()
})

export const SearchFiltersSchema = z.object({
  sort: z.enum(["departure", "destination", "price", "time"]).default("departure"),
  amenities: z.array(z.enum(["pets", "smoking"])).default([]),
})
export type SearchFilters = z.infer<typeof SearchFiltersSchema>

export const SearchPayloadSchema = z.object({
  from: z.string().uuid(),
  to: z.string().uuid(),
  departureTime: z.coerce.date(),
  availableSeats: z.number().min(1).max(4),
  maxDistanceKm: z.number().min(0).default(20),
  page: z.number().optional(),
  limit: z.number().optional()
})

export type SearchPayload = z.infer<typeof SearchPayloadSchema>

export interface RideSearchResult {
  results: RideResult[];
  total: number;
  page: number;
  limit: number;
}

export const UpdateUserPreferenceSchema = z.object({
  chatPreference: z.enum(["GOOD", "NEUTRAL", "AGAINST"]),
  musicPreference: z.enum(["GOOD", "NEUTRAL", "AGAINST"]),
  smokingPreference: z.enum(["GOOD", "NEUTRAL", "AGAINST"]),
  petPreference: z.enum(["GOOD", "NEUTRAL", "AGAINST"]),
})
export type UpdateUserPreference = z.infer<typeof UpdateUserPreferenceSchema>

export const GetRideSchema = z.object({
  rideId: z.string().uuid()
})
export type CreateUserDto = z.infer<typeof CreateUserSchema>
export type SigninDto = z.infer<typeof SigninSchema>

export const DataStoredInToken = z.object({
  id: z.string()
})

export const TokenData = z.object({
  token: z.string(),
  expiresIn: z.number()
})

export type DataStoredInTokenType = z.infer<typeof DataStoredInToken>
export type TokenDataType = z.infer<typeof TokenData>

export interface Routes {
  path?: string;
  router: Router;
}

export const PredictionSchema = z.object({
  description: z.string(),
  place_id: z.string(),
})

export const AutoCompleteResponse = z.object({
  predictions: z.array(PredictionSchema),
  status: z.string(),
})

export const GetUploadUrlSchema = z.object({
  type: z.enum(['profile-photo', 'vehicle-photo']),
  fileType: z.string()
})
export type UploadUrlType = z.infer<typeof GetUploadUrlSchema>

export const GetViewUrlSchema = z.object({
  key: z.string()
})
export type GetViewUrlType = z.infer<typeof GetViewUrlSchema>

export type GetUserResponse = Partial<User> & {
  vehicles: Vehicle[],
  posted_rides: RideWithPoints[],
  joined_rides: PassengerWithRide[],
  ratingsGiven: Rating[],
  ratingsGot: Rating[],
  reviewsGiven: Review[],
  reviewsGot: ReviewWithAuthor[],
}

export const GetUserSchema = z.object({
  id: z.string()
})
export const UpdateProfileInfoSchema = z.object({
  name: z.string().min(3),
  bio: z.string().optional()
})

export type UpdateProfileInfo = z.infer<typeof UpdateProfileInfoSchema>

export const UpdateProfilePhotoSchema = z.object({
  url: z.string()
})
export type UpdateProfilePhoto = z.infer<typeof UpdateProfilePhotoSchema>

export const AddVehicleSchema = z.object({
  name: z.string(),
  brand: z.string(),
  color: z.string(),
  photo1: z.string().optional(),
  photo2: z.string().optional(),
})
export type AddVehicle = z.infer<typeof AddVehicleSchema>

export const UpdateVehicleSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  brand: z.string().optional(),
  color: z.string().optional(),
  photo1: z.string().optional(),
  photo2: z.string().optional(),
})
export type UpdateVehicle = z.infer<typeof UpdateVehicleSchema>

export type CarBrands =
  | "Maruti Suzuki"
  | "Hyundai"
  | "Tata Motors"
  | "Mahindra"
  | "Toyota"
  | "Kia"
  | "Honda"
  | "MG"
  | "Volkswagen"
  | "Renault";

export type CarData = {
  [brand in CarBrands]: string[];
};

export type CarColour = {
  name: string;
  hex: string;
};

export type CarColours = CarColour[]