// controllers/authController.js
import { supabase } from "../config/supabaseClient.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Signup successful. Please verify email." });
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return res.status(400).json({ error: error.message });
  const accessToken = data.session.access_token;
  // 🔥 Store token in secure httpOnly cookie
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in prod
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.json({ user: data.user });
};


export const logout = (req, res) => {
  res.clearCookie("access_token");
  res.json({ message: "Logged out successfully" });
};