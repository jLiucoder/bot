import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import dotenv from "dotenv";
import authenticateJwt from "./util/jwt-util";
import langchangRouter from "./controller/langchain-controller";
import { sendResponse } from "./config/response-config";
dotenv.config();

const app: Express = express();
const router: Router = express.Router();

const port = process.env.PORT!;
app.use(express.json());

// turn on auth
// app.use(authenticateJwt);

// handles error globally
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "UnauthorizedError") {
    sendResponse(res, {}, 401, "Invalid token or Unauthorized access", err);
  } else {
    sendResponse(res, {}, 500, "Internal server error", err);
  }
});

// add global prefix /api to all routes
app.use("/api", router);
router.use("/chat", langchangRouter);

router.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

// testcase for jwt, this route is unprotected
router.get("/unprotected", (req: Request, res: Response) => {
  res.send("Unprotected route");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
