import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { NODE_ENV, PORT } from '@ridex/backend-common/config'
import { Routes } from '@ridex/common';
import morgan from 'morgan';
import { logger, stream } from './utils/logger';
import { LOG_FORMAT } from '@ridex/backend-common/config';
import { PrismaClient } from '@ridex/db';
import Container from 'typedi';
import { AuthRoute } from './routes/auth.route';
import { RideRoute } from './routes/ride.route';
import { UserRoute } from './routes/user.route';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor() {
    console.log("Server starting...1");
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 8080;

    this.initializeDatabase()
      .then(() => {
        this.initializeMiddlewares();
        this.initializeRoutes([new AuthRoute(), new RideRoute(), new UserRoute()]);
        this.initializeErrorHandling();
      })
      .catch((error) => {
        logger.error('Application initialization failed:', error);
        process.exit(1);
      });
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`============== App Listening on port ${this.port} =================`);
    });
  }

  private async initializeDatabase() {
    logger.info('Initializing database connection...');
    try {
      const client = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });
      await client.$connect().then(() => {
        logger.info('✅ Database connected successfully');
        Container.set('client', client);
      }).catch((error) => {
        throw error;
      })
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  public getServer() {
    console.log("Server getting...");
    return this.app;
  }

  private initializeMiddlewares() {
    console.log("Middlewares initializing...");
    this.app.use(morgan(LOG_FORMAT || "dev", { stream }));
    this.app.use(cors({
      origin: ["http://localhost", "http://localhost:3000"],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With'
      ]
    }));
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]) {
    console.log("Routes initializing...");
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    console.log("Error handling initializing...");
    this.app.use(ErrorMiddleware);
  }
}