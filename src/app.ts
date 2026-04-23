import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { apiRateLimiter } from "./middlewares/rate-limit.middleware";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import routes from "./routes";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: ["http://your-frontend-domain.com", "http://localhost:3000"], // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(apiRateLimiter);
app.use("/api", routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
