import { client, PrismaClientType } from '@ridex/db';
import { compare, hash } from 'bcryptjs';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import Container, { Service } from 'typedi';
import { JWT_SECRET, REFRESH_TOKEN_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '@ridex/backend-common/config';
import { ApiError } from '../error/ApiError';
import { DataStoredInTokenType, SigninDto, TokenDataType, User } from '@ridex/common';
import { logger } from '../utils/logger';

@Service()
export class AuthService {
  private client: PrismaClientType;

  constructor() {
    this.client = Container.get("client");
    if (!this.client) {
      throw new Error("Prisma client not available");
    }
  }

  public async signup(userData: User): Promise<Partial<User>> {
    const findUser = await this.client.user.findFirst({ where: { email: userData.email } });
    if (findUser) throw new ApiError(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    Reflect.deleteProperty(userData, 'confirmPassword');
    const createUserData: Promise<Partial<User>> = this.client.user.create({
      data: {
        ...userData,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        profile_photo: true,
      }
    });

    Reflect.deleteProperty(createUserData, 'password');
    Reflect.deleteProperty(createUserData, 'refresh_token');

    return createUserData;
  }

  public async login(userData: SigninDto): Promise<{ findUser: Partial<User>, accessToken: TokenDataType; refreshToken: TokenDataType; }> {
    logger.info(userData)
    const findUser = await this.client.user.findUnique({ where: { email: userData.email } });
    console.log(findUser)
    if (!findUser) throw new ApiError(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new ApiError(409, "Incorrect Password!");

    const accessToken = this.createToken(findUser);
    const refreshToken = this.createRefreshToken(findUser);

    await this.client.user.update({
      where: { id: findUser.id },
      data: {
        refresh_token: refreshToken.token
      }
    })

    Reflect.deleteProperty(findUser, 'password');
    Reflect.deleteProperty(findUser, 'refresh_token');

    return { accessToken, findUser, refreshToken };
  }

  public async logout(userData: User): Promise<User> {
    const findUser = await this.client.user.findFirst({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new ApiError(409, "User doesn't exist");

    await this.client.user.update({
      where: { id: findUser.id },
      data: {
        refresh_token: null
      }
    })
    Reflect.deleteProperty(findUser, 'password');
    Reflect.deleteProperty(findUser, 'refresh_token');

    return findUser;
  }

  public async refresh(refreshToken: string): Promise<{ findUser: Partial<User>, accessToken: TokenDataType; refreshToken: TokenDataType; }> {
    const decodedToken = verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload;

    const { id } = decodedToken;
    const findUser = await client.user.findUnique({ where: { id } });
    if (!findUser) throw new ApiError(409, `Invalid Refresh Token. User doesn't exist`);

    if (findUser.refresh_token !== refreshToken) throw new ApiError(409, `Invalid Refresh Token. Refresh Token doesn't match`);

    const accessToken = this.createToken(findUser);
    const newRefreshToken = this.createRefreshToken(findUser);
    Reflect.deleteProperty(findUser, 'password');
    Reflect.deleteProperty(findUser, 'refresh_token');

    return { findUser, accessToken, refreshToken: newRefreshToken };
  }

  public createToken(user: User): TokenDataType {
    const dataStoredInToken: DataStoredInTokenType = { id: user.id };
    const secretKey: string = JWT_SECRET;
    const expiresIn: number = JWT_EXPIRES_IN; // 30 days

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createRefreshToken(user: User): TokenDataType {
    const dataStoredInToken: DataStoredInTokenType = { id: user.id };
    const secretKey: string = REFRESH_TOKEN_SECRET;
    const expiresIn: number = REFRESH_TOKEN_EXPIRES_IN;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }
}
