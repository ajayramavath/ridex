import NextAuth, { DefaultSession, DefaultUser, JWT } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name: string;
//       email: string;
//     } & DefaultSession["user"];
//     accessToken?: string;
//     error?: string;
//   }

//   interface User extends DefaultUser {
//     id: string;
//     accessToken: string;
//     refreshToken?: string;
//     expiresAt: number;
//   }

//   interface JWT {
//     id: string;
//     name: string;
//     email: string;
//     accessToken: string;
//     expiresAt: number;
//     error?: string;
//   }
// }