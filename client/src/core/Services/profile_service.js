// Handles all API calls related to hub_profiles table:
//   • GET  /hub/profile/:email   → fetch a single profile
//   • PATCH /hub/profile/status  → update presence_status for the logged-in user

import api from "./api.js";

const ProfileService = {
  /**
   * Fetch hub profile for a given email.
   * Returns: { email, name, role, presence_status, created_at, updated_at, last_seen_at }
   */
  getProfile: (email) => api.get(`/hub/profile/${encodeURIComponent(email)}`),

  /**
   * Update the presence_status of the logged-in user.
   * @param {"available"|"busy"|"offline"|"in_meeting"} status
   * Returns: { profile: { ...updated hub_profile row } }
   */
  updateStatus: (status) =>
    api.patch("/hub/profile/status", { presence_status: status }),

  /**
   * Update name and/or email for the logged-in user.
   * @param {{ name: string, email: string }} fields
   * Returns: { profile: { ...updated hub_profile row } }
   */
  updateProfile: ({ name, email }) =>
    api.patch("/hub/profile", { name, email }),

  /**
   * Change the logged-in user's password.
   * @param {{ currentPassword: string, newPassword: string }} payload
   * Returns: { message: string }
   */
  updatePassword: ({ currentPassword, newPassword }) =>
    api.patch("/auth/password", { currentPassword, newPassword }),

  /**
   * Permanently delete the logged-in user's account.
   * Returns: { message: string }
   */
  deleteAccount: () => api.delete("/hub/profile"),
};

export default ProfileService;
