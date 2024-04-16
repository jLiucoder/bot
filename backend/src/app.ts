import express, { Express, Request, Response, Router } from "express";
import dotenv from "dotenv";
import authenticateJwt from "./util/jwt-util";

dotenv.config();

const app: Express = express();
const router: Router = express.Router();

const port = process.env.PORT;
app.use(express.json());

// turn on auth
// app.use(authenticateJwt);
app.use("/api", router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

router.get("/unprotected", (req: Request, res: Response) => {
  res.send("Unprotected route");
});
