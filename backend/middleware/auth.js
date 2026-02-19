import { supabase } from "../config/supabaseClient.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
  // attach user to request
  req.user = data.user;
  next(); // move to next function
};
