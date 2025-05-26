import { NextAuthOptions, Session, SessionStrategy, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials"

interface CustomUser extends User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  profile_photo: string;
  accessToken: {
    token: string
    expiresIn: number
  }
}

interface CustomSession extends Session {
  accessToken: {
    token: string
    expiresIn: number
  }
}

const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : process.env.INTERNAL_API_URL

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing email or password");
        }
        try {
          const res = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify(credentials),
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
          }

          const { data: user, accessToken } = await res.json();
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            profile_photo: user.profile_photo,
            accessToken
          } as CustomUser;
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Login failed");
        }
      },
    }),
  ],
  session: { strategy: "jwt" as SessionStrategy },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        return {
          ...token,
          ...user
        }
      }
      return token;
    },
    async session({ session, token, user }: { session: any; token: any, user: any }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        phone_number: token.phone_number,
        profile_photo: token.profile_photo,
      };
      session.accessToken = token.accessToken;
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  pages: {
    signIn: "/auth/login",
  },
}