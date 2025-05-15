import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    name: string;
    email: string;
    phone_number: string;
    profile_photo: string;
    accessToken: {
      token: string;
      expiresIn: number;
    } & DefaultSession["user"]
  }
}