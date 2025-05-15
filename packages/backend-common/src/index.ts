import { config } from "dotenv";

config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;

export const JWT_SECRET = process.env.JWT_SECRET ?? "qwef634736mnasv7597642783mbsajchs459824ahsgvcdghe"

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? "02a423250e8a08b48064c1cd75c6c0640e48f9144aeeb4d9ab9b62bd0a24e0dbc47fb6a2c714ed0be90b793c467e5e09c809ab5a12c0d8d922c1bc90e93812d5";

const JWT_EXPIRES_IN_ENV = parseInt(process.env.JWT_EXPIRES_IN || '');
export const JWT_EXPIRES_IN = Number.isInteger(JWT_EXPIRES_IN_ENV) ? JWT_EXPIRES_IN_ENV : 60 * 60 * 24 * 30; // 30 days

const REFRESH_TOKEN_EXPIRES_IN_ENV = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || '');
export const REFRESH_TOKEN_EXPIRES_IN = Number.isInteger(REFRESH_TOKEN_EXPIRES_IN_ENV) ? REFRESH_TOKEN_EXPIRES_IN_ENV : 60 * 60 * 24 * 7; // 7 days
