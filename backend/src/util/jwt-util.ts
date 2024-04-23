import { expressjwt as jwt } from "express-jwt";
import dotenv from "dotenv";
dotenv.config();

// jwt middleware and exclude certain routes
// add path to unless array to exclude routes from jwt
const authenticateJwt = jwt({
  secret: process.env.SUPABASE_SECRET!,
  algorithms: ["HS256"],
}).unless({ path: ["/api/unprotected",] });

export default authenticateJwt;
