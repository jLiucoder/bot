import supabase from "../db/supabase";
import { User } from "../model/user-model";

// Function to create a new user
async function createUser(userData: User): Promise<User | null> {
  try {
    const { data, error } = await supabase.from("user").insert(userData);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error("An error occurred while creating a user:", error);
    throw error;
  }
}

// Function to get all users
async function getUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase.from("user").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  } catch (error) {
    console.error("An error occurred while getting users:", error);
    throw error;
  }
}

// Function to get a user by ID
async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", userId);
    if (error) {
      throw new Error(error.message);
    }
    return data[0] || null;
  } catch (error) {
    console.error("An error occurred while getting a user by ID:", error);
    throw error;
  }
}



// Function to delete a user
async function deleteUser(userId: number): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("user")
      .delete()
      .eq("id", userId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error("An error occurred while deleting a user:", error);
    throw error;
  }
}

export const userService = {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
};
