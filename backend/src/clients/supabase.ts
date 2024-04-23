import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();
// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabaseClient;
