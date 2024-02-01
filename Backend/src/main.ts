import express from "express";
import expressFileUpload from "express-fileupload";
import appConfig from "./4-utils/app-config";
import authRoutes from './6-routes/auth-routes';
import vacationRoutes from './6-routes/vacation-routes';
import followerRoutes from './6-routes/follower-routes';
import userRoutes from './6-routes/user-routes';
import consoleLogger from "./3-middleware/console.logger";
import fileLogger from "./3-middleware/file-logger";
import catchAll from "./3-middleware/catch-all";
import routeNotFound from "./3-middleware/route-not-found";
import cors from 'cors';
import preventXss from "./3-middleware/prevent-xss";
import expressRateLimit from 'express-rate-limit';
import socketIoService from "./5-services/socket.io-service";

const app = express();
const { SERVER_PORT, CLIENT_PORT } = appConfig;

app.use(expressRateLimit({
  windowMs: 1000,
  limit: 500,
  message: 'Bring Them Home Now!'
}))

app.use(cors({ origin: 'http://localhost:' + CLIENT_PORT }));
app.use(express.json());
app.use(expressFileUpload());

// Middleware
app.use(consoleLogger);
app.use(fileLogger);
app.use(preventXss);

// Routes
app.use('/api', authRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/followers', followerRoutes);
app.use('/api/users', userRoutes);
app.use('*', routeNotFound);

app.use(catchAll);

const httpServer = app.listen(SERVER_PORT, () => console.log(`Listening on http://localhost:${SERVER_PORT}`));
socketIoService.init(httpServer);