import { App } from './app';
import 'dotenv/config';
import { AuthRoute } from './routes/auth.route';
import { RideRoute } from './routes/ride.route';

const app = new App();

app.listen();

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});