import express, { Request, Response } from "express";
import { userService } from "../service/user-service";
import { User } from "../model/user-model";
const userRouter = express.Router();

// user is not needed for supabase, contoller here is an example of how to use the service
// GET /users
const getUsers = (req: Request, res: Response) => {
  try {
    const users = userService.getUsers();
    if (users == null) {
      res.status(404).send("User not found");
      return;
    }
    res.json(users);
  } catch (error) {
    console.error("Failed to get users:", error);
    res.status(500).send("Internal server error");
  }
};

// GET /users/:id
const getUserById = (req: Request, res: Response) => {
  const { id } = req.params;
  if (id == null) {
    res.status(400).send("ID is required");
    return;
  }
  try {
    const user = userService.getUserById(id);
    if (user == null) {
      res.status(404).send("User not found");
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Failed to get user by ID:", error);
    res.status(500).send("Internal server error");
  }
};

// POST /users
const createUser = async (req: Request, res: Response) => {
  const { username, email, password, dob } = req.body;

  if (!username || !email || !password || !dob) {
    res.status(400).send("Missing input(s)");
    return;
  }
  const newUser: User = { username, email, password, dob };

  try {
    const createdUser = await userService.createUser(newUser);

    if (!createdUser) {
      res.status(500).send("Failed to create user");
      return;
    }
    res.status(201).json(createdUser);
  } catch (error) {
    console.error("Failed to create user:", error);
    res.status(500).send("Internal server error");
  }
};

// DELETE /users/:id
const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;
  if (id == null) {
    res.status(400).send("ID is required");
    return;
  }
  try {
    const user = userService.getUserById(id);
    if (user == null) {
      res.status(404).send("User not found");
      return;
    }
    userService.deleteUser(parseInt(id));
    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete user:", error);
    res.status(500).send("Internal server error");
  }
};

userRouter.get("/users", getUsers);
userRouter.get("/users/:id", getUserById);
userRouter.post("/users", createUser);

export default userRouter;
