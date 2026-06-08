import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../db/connection.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

// Helpers

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function sanitizeUser(user) {
  const { password_hash, ...safe } = user;
  return safe;
}

// Register

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required." });
    }
    if (name.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "Name must be at least 2 characters." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    // Check if email already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);
    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    const now = Date.now();
    const id = uuidv4();

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (id, email, name, role, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, email.toLowerCase(), name.trim(), "member", password_hash, now, now],
    );

    const user = result.rows[0];

    // Also insert hub profile so the user appears in the hub
    await pool.query(
      `INSERT INTO hub_profiles (email, name, role, presence_status, created_at, updated_at, last_seen_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING`,
      [user.email, user.name, user.role, "available", now, now, now],
    );

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("[register]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

// Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);

    if (result.rows.length === 0) {
      // Vague message on purpose — don't reveal if email exists
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = result.rows[0];

    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Update last login
    const now = Date.now();
    await pool.query(
      "UPDATE users SET last_login_at = $1, updated_at = $2 WHERE id = $3",
      [now, now, user.id],
    );

    // Update hub presence
    await pool.query(
      `UPDATE hub_profiles SET presence_status = 'available', last_seen_at = $1, updated_at = $2
       WHERE email = $3`,
      [now, now, user.email],
    );

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: "Signed in successfully.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("[login]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

// Get current user (me)
export async function getMe(req, res) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user: sanitizeUser(result.rows[0]) });
  } catch (error) {
    console.error("[getMe]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
