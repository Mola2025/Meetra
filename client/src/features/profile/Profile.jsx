import "./Profile.css";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../core/Services/auth_service.jsx";
import ProfileService from "../../core/Services/profile_service.js";

function getInitials(name) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join("") || "?"
  );
}

// Converts a BIGINT timestamp (ms since epoch) to a human-readable string. e.g. "Today at 3:42 PM"  /  "Yesterday at 10:00 AM"  /  "Jun 3 at 9:15 AM"

function formatLastSeen(timestampMs) {
  if (!timestampMs) return "Never";

  const date = new Date(Number(timestampMs));
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (isToday) return `Today at ${timeStr}`;
  if (isYesterday) return `Yesterday at ${timeStr}`;
  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} at ${timeStr}`;
}

// Status config 

const STATUS_OPTIONS = [
  { value: "available",  label: "Available",  color: "#22c55e" },
  { value: "busy",       label: "Busy",       color: "#f59e0b" },
  { value: "in_meeting", label: "In Meeting", color: "#6c63ff" },
  { value: "offline",    label: "Offline",    color: "#6b7280" },
];

function getStatusConfig(value) {
  return STATUS_OPTIONS.find((s) => s.value === value) ?? STATUS_OPTIONS[3];
}

// Sub-components

function Field({ label, value }) {
  return (
    <div>
      <label
        className="mb-2 block text-xs uppercase tracking-wider"
        style={{ color: "oklch(0.7 0.04 270)" }}
      >
        {label}
      </label>
      <div
        className="rounded-2xl px-4 py-3"
        style={{
          border: "1px solid oklch(0.35 0.08 275 / 0.35)",
          background: "oklch(0.22 0.04 270 / 0.6)",
          color: "oklch(0.97 0.01 280)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function EditableField({ label, value, onChange, type = "text", disabled }) {
  return (
    <div>
      <label
        className="mb-2 block text-xs uppercase tracking-wider"
        style={{ color: "oklch(0.7 0.04 270)" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:opacity-60"
        style={{
          border: "1px solid oklch(0.45 0.12 275 / 0.6)",
          background: "oklch(0.22 0.04 270 / 0.8)",
          color: "oklch(0.97 0.01 280)",
          "--tw-ring-color": "oklch(0.62 0.21 280 / 0.5)",
        }}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = getStatusConfig(status);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: cfg.color }}
      />
      <span className="text-sm" style={{ color: "oklch(0.87 0.03 280)" }}>
        {cfg.label}
      </span>
    </span>
  );
}

function StatusDropdown({ current, onSelect, onClose }) {
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl"
      style={{
        border: "1px solid oklch(0.35 0.08 275 / 0.35)",
        background: "oklch(0.17 0.035 270 / 0.97)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {STATUS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSelect(opt.value)}
          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition hover:opacity-90"
          style={{
            color: "oklch(0.87 0.03 280)",
            background: current === opt.value ? "oklch(0.22 0.04 270 / 0.8)" : "transparent",
          }}
        >
          <span
            className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: opt.color }}
          />
          {opt.label}
          {current === opt.value && (
            <span className="ml-auto text-xs" style={{ color: "oklch(0.62 0.21 280)" }}>
              ✓
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
//  Toggle switch
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none"
      style={{
        background: checked
          ? "linear-gradient(135deg, oklch(0.62 0.21 280), oklch(0.62 0.22 305))"
          : "oklch(0.28 0.04 270)",
        border: "1px solid oklch(0.35 0.08 275 / 0.4)",
      }}
    >
      <span
        className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
        style={{
          transform: checked ? "translateX(20px)" : "translateX(1px)",
          marginTop: "1px",
        }}
      />
    </button>
  );
}

//  Settings Tab

function SettingsTab({ profile, onProfileUpdated }) {
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState(null); // { type: "ok"|"err", text }
  const [form, setForm]         = useState({ name: "", email: "" });

  // Sync form when profile loads or editing starts
  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name ?? "", email: profile.email ?? "" });
    }
  }, [profile]);

  function handleEdit() {
    setMsg(null);
    setForm({ name: profile?.name ?? "", email: profile?.email ?? "" });
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
    setMsg(null);
  }

  async function handleSave() {
    const name  = form.name.trim();
    const email = form.email.trim();

    if (!name)  return setMsg({ type: "err", text: "Name cannot be empty." });
    if (!email) return setMsg({ type: "err", text: "Email cannot be empty." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setMsg({ type: "err", text: "Please enter a valid email." });

    setSaving(true);
    setMsg(null);
    try {
      const { profile: updated } = await ProfileService.updateProfile({ name, email });
      onProfileUpdated(updated);
      setEditing(false);
      setMsg({ type: "ok", text: "Profile updated successfully." });
    } catch (err) {
      setMsg({ type: "err", text: err.message ?? "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  }

  const displayRole      = profile?.role ?? "—";
  const displayCreatedAt = profile?.created_at
    ? new Date(Number(profile.created_at)).toLocaleDateString([], {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <section
      className="rounded-3xl p-8 backdrop-blur-xl"
      style={{
        border: "1px solid oklch(0.35 0.08 275 / 0.35)",
        background: "oklch(0.17 0.035 270 / 0.6)",
      }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="text-xl font-semibold"
          style={{ fontFamily: "Syne, system-ui, sans-serif", color: "oklch(0.97 0.01 280)" }}
        >
          Account Information
        </h2>

        {!editing ? (
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition hover:opacity-90"
            style={{
              border: "1px solid oklch(0.62 0.21 280 / 0.5)",
              background: "oklch(0.62 0.21 280 / 0.12)",
              color: "oklch(0.78 0.14 280)",
            }}
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition hover:opacity-80 disabled:opacity-50"
              style={{
                border: "1px solid oklch(0.35 0.08 275 / 0.35)",
                background: "transparent",
                color: "oklch(0.7 0.04 270)",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition hover:opacity-90 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.21 280), oklch(0.62 0.22 305))",
                color: "oklch(0.98 0.01 280)",
              }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-5">
        {editing ? (
          <>
            <EditableField
              label="Name"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              disabled={saving}
            />
            <EditableField
              label="Email"
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              type="email"
              disabled={saving}
            />
          </>
        ) : (
          <>
            <Field label="Name"  value={profile?.name  ?? "—"} />
            <Field label="Email" value={profile?.email ?? "—"} />
          </>
        )}

        {/* Read-only fields — always shown */}
        <Field label="Role" value={displayRole} />
        {displayCreatedAt && <Field label="Member Since" value={displayCreatedAt} />}
      </div>

      {/* Status message */}
      {msg && (
        <p
          className="mt-4 text-sm"
          style={{ color: msg.type === "ok" ? "#22c55e" : "oklch(0.65 0.22 25)" }}
        >
          {msg.text}
        </p>
      )}
    </section>
  );
}

//  Preferences Tab

function PreferencesTab() {
  const [prefs, setPrefs] = useState({ videoDefault: false, audioDefault: false });
  function toggle(key) { setPrefs((p) => ({ ...p, [key]: !p[key] })); }
  const prefItems = [
    { key: "videoDefault", label: "Join with video enabled by default" },
    { key: "audioDefault", label: "Join with audio enabled by default" },
  ];
  return (
    <section
      className="rounded-3xl p-8 backdrop-blur-xl"
      style={{
        border: "1px solid oklch(0.35 0.08 275 / 0.35)",
        background: "oklch(0.17 0.035 270 / 0.6)",
      }}
    >
      <h2
        className="mb-6 text-xl font-semibold"
        style={{ fontFamily: "Syne, system-ui, sans-serif", color: "oklch(0.97 0.01 280)" }}
      >
        Meeting Preferences
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 mt-8">
        {prefItems.map(({ key, label }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3"
            style={{
              border: "1px solid oklch(0.35 0.08 275 / 0.35)",
              background: "oklch(0.22 0.04 270 / 0.6)",
            }}
          >
            <span className="text-sm" style={{ color: "oklch(0.87 0.03 280)" }}>{label}</span>
            <Toggle checked={prefs[key]} onChange={() => toggle(key)} />
          </div>
        ))}
      </div>
    </section>
  );
}

//  Security Tab

function SecurityTab({ onAccountDeleted }) {
  const { logout } = useAuth();

  const [passwords, setPasswords]           = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving]             = useState(false);
  const [pwMsg, setPwMsg]                   = useState(null);
  const [showDeleteConfirm, setShowDelete]  = useState(false);
  const [deleting, setDeleting]             = useState(false);
  const [deleteMsg, setDeleteMsg]           = useState(null);

  async function handleUpdatePassword() {
    if (!passwords.current || !passwords.next || !passwords.confirm)
      return setPwMsg({ type: "err", text: "Please fill in all fields." });
    if (passwords.next !== passwords.confirm)
      return setPwMsg({ type: "err", text: "New passwords do not match." });
    if (passwords.next.length < 6)
      return setPwMsg({ type: "err", text: "New password must be at least 6 characters." });

    setPwSaving(true);
    setPwMsg(null);
    try {
      await ProfileService.updatePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      setPwMsg({ type: "ok", text: "Password updated successfully." });
      setPasswords({ current: "", next: "", confirm: "" });
    } catch (err) {
      setPwMsg({ type: "err", text: err.message ?? "Failed to update password. Please try again." });
    } finally {
      setPwSaving(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteMsg(null);
    try {
      await ProfileService.deleteAccount();
      logout();
      onAccountDeleted?.();
    } catch (err) {
      setDeleteMsg(err.message ?? "Failed to delete account. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Change Password */}
      <section
        className="rounded-3xl p-8 backdrop-blur-xl"
        style={{
          border: "1px solid oklch(0.35 0.08 275 / 0.35)",
          background: "oklch(0.17 0.035 270 / 0.6)",
        }}
      >
        <h2
          className="mb-6 text-xl font-semibold"
          style={{ fontFamily: "Syne, system-ui, sans-serif", color: "oklch(0.97 0.01 280)" }}
        >
          Change Password
        </h2>

        <div className="flex flex-col gap-4 mt-4">
          {[
            { key: "current", label: "Current Password",    placeholder: "Enter current password" },
            { key: "next",    label: "New Password",         placeholder: "Enter new password" },
            { key: "confirm", label: "Confirm New Password", placeholder: "Confirm new password" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label
                className="mb-2 block text-xs uppercase tracking-wider"
                style={{ color: "oklch(0.7 0.04 270)" }}
              >
                {label}
              </label>
              <input
                type="password"
                placeholder={placeholder}
                value={passwords[key]}
                onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition focus:ring-2"
                style={{
                  border: "1px solid oklch(0.35 0.08 275 / 0.35)",
                  background: "oklch(0.22 0.04 270 / 0.6)",
                  color: "oklch(0.97 0.01 280)",
                  "--tw-ring-color": "oklch(0.62 0.21 280 / 0.5)",
                }}
              />
            </div>
          ))}

          {pwMsg && (
            <p className="text-sm" style={{ color: pwMsg.type === "ok" ? "#22c55e" : "oklch(0.65 0.22 25)" }}>
              {pwMsg.text}
            </p>
          )}

          <button
            type="button"
            disabled={pwSaving}
            onClick={handleUpdatePassword}
            className="mt-1 self-start rounded-2xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition hover:opacity-90 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, oklch(0.62 0.21 280), oklch(0.62 0.22 305))",
              color: "oklch(0.98 0.01 280)",
            }}
          >
            {pwSaving ? "Updating…" : "Update Password"}
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section
        className="rounded-3xl p-8 backdrop-blur-xl"
        style={{
          border: "1px solid oklch(0.55 0.18 25 / 0.35)",
          background: "oklch(0.15 0.04 20 / 0.5)",
        }}
      >
        <h2
          className="mb-2 text-xl font-semibold"
          style={{ fontFamily: "Syne, system-ui, sans-serif", color: "oklch(0.7 0.2 25)" }}
        >
          Danger Zone
        </h2>
        <p className="mb-6 text-sm mt-4" style={{ color: "oklch(0.7 0.04 270)" }}>
          Once you delete your account, there is no going back. Please be certain.
        </p>

        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="rounded-2xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition hover:opacity-90"
            style={{
              border: "1px solid oklch(0.65 0.22 25 / 0.6)",
              background: "transparent",
              color: "oklch(0.65 0.22 25)",
            }}
          >
            Delete Account
          </button>
        ) : (
          <div
            className="rounded-2xl p-4"
            style={{
              border: "1px solid oklch(0.65 0.22 25 / 0.4)",
              background: "oklch(0.18 0.04 20 / 0.6)",
            }}
          >
            <p className="mb-4 text-sm font-medium" style={{ color: "oklch(0.87 0.03 280)" }}>
              Are you absolutely sure? This action cannot be undone.
            </p>
            {deleteMsg && (
              <p className="mb-3 text-sm" style={{ color: "oklch(0.65 0.22 25)" }}>
                {deleteMsg}
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="rounded-2xl px-5 py-2 text-xs font-bold uppercase tracking-widest transition hover:opacity-90 disabled:opacity-50"
                style={{ background: "oklch(0.65 0.22 25)", color: "#fff" }}
              >
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => { setShowDelete(false); setDeleteMsg(null); }}
                className="rounded-2xl px-5 py-2 text-xs font-bold uppercase tracking-widest transition hover:opacity-90 disabled:opacity-50"
                style={{
                  border: "1px solid oklch(0.35 0.08 275 / 0.35)",
                  background: "transparent",
                  color: "oklch(0.7 0.04 270)",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// Main page
const TABS = [
  { id: "settings",    label: "Settings",    icon: "👤" },
  { id: "preferences", label: "Preferences", icon: "🔔" },
  { id: "security",    label: "Security",    icon: "🔒" },
];

export default function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile]               = useState(null);
  const [loadingProfile, setLoading]        = useState(true);
  const [error, setError]                   = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [showDropdown, setShowDropdown]     = useState(false);
  const [activeTab, setActiveTab]           = useState("settings");

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);
    ProfileService
      .getProfile(user.email)
      .then(({ profile }) => setProfile(profile))
      .catch((err) => setError(err.message ?? "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [user?.email]);

  async function handleStatusChange(newStatus) {
    setShowDropdown(false);
    if (newStatus === profile?.presence_status) return;
    setStatusUpdating(true);
    try {
      const { profile: updated } = await ProfileService.updateStatus(newStatus);
      setProfile(updated);
    } catch (err) {
      console.error("[Profile] updateStatus error:", err);
    } finally {
      setStatusUpdating(false);
    }
  }

  function handleProfileUpdated(updated) {
    setProfile(updated);
  }

  const displayName  = profile?.name  ?? user?.name  ?? "—";
  const displayEmail = profile?.email ?? user?.email ?? "—";
  const displayRole  = profile?.role  ?? "—";

  if (loadingProfile) {
    return (
      <div className="profile-root relative flex min-h-screen items-center justify-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 15% 20%, oklch(0.62 0.21 280 / 0.18) 0%, transparent 60%)",
          }}
        />
        <p className="relative z-10 text-sm" style={{ color: "oklch(0.7 0.04 270)" }}>
          Loading profile…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-root relative flex min-h-screen items-center justify-center overflow-hidden">
        <p className="relative z-10 text-sm" style={{ color: "oklch(0.65 0.22 25)" }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="profile-root relative min-h-screen overflow-hidden">

      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 15% 20%, oklch(0.62 0.21 280 / 0.18) 0%, transparent 60%), radial-gradient(ellipse 55% 50% at 85% 75%, oklch(0.62 0.22 305 / 0.16) 0%, transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 40px, oklch(0.62 0.21 280 / 0.04) 40px, oklch(0.62 0.21 280 / 0.04) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, oklch(0.62 0.21 280 / 0.04) 40px, oklch(0.62 0.21 280 / 0.04) 41px)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col px-6 pt-[60px] pb-10">

        {/* Header */}
        <header className="mb-10 flex items-center justify-between pt-6">
          <a
            href="/"
            style={{ color: "oklch(0.7 0.04 270)" }}
            className="text-sm transition hover:opacity-80"
          >
            ← Go Back
          </a>
          <span
            className="text-sm uppercase tracking-[0.3em]"
            style={{ fontFamily: "Syne, system-ui, sans-serif", color: "oklch(0.7 0.04 270)" }}
          >
            Profile
          </span>
        </header>

        <main className="grid flex-1 gap-8 md:grid-cols-[320px_1fr]">

          {/*  Left card: avatar + status  */}
          <section
            className="flex flex-col items-center gap-6 rounded-3xl p-8 backdrop-blur-xl"
            style={{
              border: "1px solid oklch(0.35 0.08 275 / 0.35)",
              background: "oklch(0.17 0.035 270 / 0.6)",
              alignSelf: "start",
            }}
          >
            {/* Avatar */}
            <div className="relative">
              <div
                className="absolute -inset-2 rounded-full opacity-70 blur-2xl"
                style={{ background: "var(--gradient-primary)" }}
              />
              <div
                className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-full"
                style={{
                  border: "2px solid oklch(0.35 0.08 275 / 0.35)",
                  background: "oklch(0.22 0.035 270)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                <span
                  className="text-6xl font-bold"
                  style={{
                    fontFamily: "Syne, system-ui, sans-serif",
                    color: "oklch(0.97 0.01 280)",
                  }}
                >
                  {getInitials(displayName)}
                </span>
              </div>
            </div>

            {/* Name + email */}
            <div className="text-center">
              <h1
                className="text-2xl font-bold"
                style={{
                  fontFamily: "Syne, system-ui, sans-serif",
                  color: "oklch(0.97 0.01 280)",
                }}
              >
                {displayName}
              </h1>
              <p className="mt-1 text-sm" style={{ color: "oklch(0.7 0.04 270)" }}>
                {displayEmail}
              </p>
            </div>

            {/* Status selector */}
            <div className="relative w-full">
              <label
                className="mb-2 block text-xs uppercase tracking-wider"
                style={{ color: "oklch(0.7 0.04 270)" }}
              >
                Presence Status
              </label>
              <button
                type="button"
                disabled={statusUpdating}
                onClick={() => setShowDropdown((v) => !v)}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition hover:opacity-90 disabled:opacity-50"
                style={{
                  border: "1px solid oklch(0.35 0.08 275 / 0.35)",
                  background: "oklch(0.22 0.04 270 / 0.6)",
                }}
              >
                <StatusBadge status={profile?.presence_status ?? "offline"} />
                <span style={{ color: "oklch(0.6 0.04 270)" }}>
                  {statusUpdating ? "…" : "▾"}
                </span>
              </button>
              {showDropdown && (
                <StatusDropdown
                  current={profile?.presence_status}
                  onSelect={handleStatusChange}
                  onClose={() => setShowDropdown(false)}
                />
              )}
            </div>

            {/* Last seen */}
            <div className="w-full">
              <label
                className="mb-2 block text-xs uppercase tracking-wider"
                style={{ color: "oklch(0.7 0.04 270)" }}
              >
                Last Seen
              </label>
              <div
                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm"
                style={{
                  border: "1px solid oklch(0.35 0.08 275 / 0.35)",
                  background: "oklch(0.22 0.04 270 / 0.6)",
                  color: "oklch(0.87 0.03 280)",
                }}
              >
                <span style={{ color: "oklch(0.62 0.21 280)" }}>◷</span>
                {formatLastSeen(profile?.last_seen_at)}
              </div>
            </div>
          </section>

          {/*  Right panel: tabs + content  */}
          <div className="flex flex-col gap-6">

            {/* Tab bar */}
            <nav
              className="flex gap-1 rounded-2xl p-1"
              style={{
                border: "1px solid oklch(0.35 0.08 275 / 0.35)",
                background: "oklch(0.17 0.035 270 / 0.6)",
              }}
            >
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition"
                    style={{
                      background: active
                        ? "linear-gradient(135deg, oklch(0.62 0.21 280 / 0.25), oklch(0.62 0.22 305 / 0.2))"
                        : "transparent",
                      color: active ? "oklch(0.97 0.01 280)" : "oklch(0.7 0.04 270)",
                      borderBottom: active
                        ? "2px solid oklch(0.62 0.21 280)"
                        : "2px solid transparent",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Tab content */}
            {activeTab === "settings" && (
              <SettingsTab
                profile={profile}
                onProfileUpdated={handleProfileUpdated}
              />
            )}
            {activeTab === "preferences" && <PreferencesTab />}
            {activeTab === "security" && (
              <SecurityTab
                onAccountDeleted={() => window.location.href = "/"}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}