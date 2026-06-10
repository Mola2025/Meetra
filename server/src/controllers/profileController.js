import db from "../db/connection.js";
import bcrypt from "bcryptjs";

/**
 * GET /hub/profile/:email
 * Fetches a single hub_profile row by email.
 * Auth: any authenticated user can read any profile (adjust if you want self-only).
 */
export async function getProfile(req, res) {
  const { email } = req.params;

  try {
    const result = await db.query(
      `SELECT email, name, role, presence_status, created_at, updated_at, last_seen_at
       FROM hub_profiles
       WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({ profile: result.rows[0] });
  } catch (err) {
    console.error("[hubProfile] getProfile error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * PATCH /hub/profile/status
 * Updates the presence_status of the currently authenticated user.
 * Also bumps updated_at and last_seen_at to now.
 */
export async function updateStatus(req, res) {
  const { presence_status } = req.body;
  const userEmail = req.user.email; // set by authMiddleware

  const VALID_STATUSES = ["available", "busy", "offline", "in_meeting"];
  if (!VALID_STATUSES.includes(presence_status)) {
    return res.status(400).json({
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  try {
    const now = Date.now();

    const result = await db.query(
      `UPDATE hub_profiles
       SET presence_status = $1,
           updated_at      = $2,
           last_seen_at    = $3
       WHERE email = $4
       RETURNING email, name, role, presence_status, created_at, updated_at, last_seen_at`,
      [presence_status, now, now, userEmail],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({ profile: result.rows[0] });
  } catch (err) {
    console.error("[hubProfile] updateStatus error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * PATCH /hub/profile
 * Updates name and/or email for the currently authenticated user.
 * - If email changes, updates both hub_profiles and users tables.
 * - Rejects if the new email is already taken by another user.
 */
export async function updateProfile(req, res) {
  const { name, email } = req.body;
  const userEmail = req.user.email;

  if (!name && !email) {
    return res
      .status(400)
      .json({ message: "Provide at least one field to update (name, email)." });
  }

  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim().toLowerCase();

  if (trimmedName !== undefined && trimmedName.length === 0) {
    return res.status(400).json({ message: "Name cannot be empty." });
  }

  if (trimmedEmail !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // If email is changing, make sure it's not already taken
    if (trimmedEmail && trimmedEmail !== userEmail) {
      const conflict = await client.query(
        `SELECT 1 FROM users WHERE email = $1`,
        [trimmedEmail],
      );
      if (conflict.rows.length > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: "Email is already in use." });
      }
    }

    const now = Date.now();

    // Build dynamic SET clause for hub_profiles
    const hubSets = [];
    const hubValues = [];
    let hubIdx = 1;

    if (trimmedName) {
      hubSets.push(`name = $${hubIdx++}`);
      hubValues.push(trimmedName);
    }
    if (trimmedEmail) {
      hubSets.push(`email = $${hubIdx++}`);
      hubValues.push(trimmedEmail);
    }
    hubSets.push(`updated_at = $${hubIdx++}`);
    hubValues.push(now);
    hubValues.push(userEmail); // WHERE clause

    const hubResult = await client.query(
      `UPDATE hub_profiles
       SET ${hubSets.join(", ")}
       WHERE email = $${hubIdx}
       RETURNING email, name, role, presence_status, created_at, updated_at, last_seen_at`,
      hubValues,
    );

    if (hubResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Profile not found." });
    }

    // Mirror changes to users table
    const userSets = [];
    const userValues = [];
    let userIdx = 1;

    if (trimmedName) {
      userSets.push(`name = $${userIdx++}`);
      userValues.push(trimmedName);
    }
    if (trimmedEmail) {
      userSets.push(`email = $${userIdx++}`);
      userValues.push(trimmedEmail);
    }
    userSets.push(`updated_at = $${userIdx++}`);
    userValues.push(now);
    userValues.push(userEmail); // WHERE clause

    await client.query(
      `UPDATE users SET ${userSets.join(", ")} WHERE email = $${userIdx}`,
      userValues,
    );

    await client.query("COMMIT");

    return res.status(200).json({ profile: hubResult.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[hubProfile] updateProfile error:", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
}

/**
 * DELETE /hub/profile
 * Permanently deletes the authenticated user's account.
 * Cascades to hub_profiles, meetings, messages, activities via FK ON DELETE CASCADE.
 */
export async function deleteAccount(req, res) {
  const userEmail = req.user.email;

  try {
    await db.query(`DELETE FROM users WHERE email = $1`, [userEmail]);
    // hub_profiles row is deleted via FK cascade from users (if you add that FK),
    // OR delete it explicitly:
    await db.query(`DELETE FROM hub_profiles WHERE email = $1`, [userEmail]);

    return res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("[hubProfile] deleteAccount error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * PATCH /auth/password
 * Changes the authenticated user's password.
 */
export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const userEmail = req.user.email;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Both currentPassword and newPassword are required." });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "New password must be at least 6 characters." });
  }

  try {
    const result = await db.query(
      `SELECT password_hash FROM users WHERE email = $1`,
      [userEmail],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const valid = await bcrypt.compare(
      currentPassword,
      result.rows[0].password_hash,
    );
    if (!valid) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    const now = Date.now();

    await db.query(
      `UPDATE users SET password_hash = $1, updated_at = $2 WHERE email = $3`,
      [newHash, now, userEmail],
    );

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("[hubProfile] updatePassword error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
