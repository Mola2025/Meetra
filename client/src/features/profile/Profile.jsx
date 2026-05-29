import "./Profile.css";

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

const PLACEHOLDER = {
  name: "Tu Nombre",
  email: "tu@email.com",
  avatar: null,
};

export default function ProfilePage() {
  const current = PLACEHOLDER;

  return (
    <div
      className="profile-root relative min-h-screen overflow-hidden"
    >
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

      <div className="relative z-10 mx-auto flex h-[700px] max-w-5xl flex-col px-6 pt-[60px] pb-10">
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
          {/* Avatar card */}
          <section
            className="flex flex-col items-center gap-6 rounded-3xl p-8 backdrop-blur-xl"
            style={{
              border: "1px solid oklch(0.35 0.08 275 / 0.35)",
              background: "oklch(0.17 0.035 270 / 0.6)",
            }}
          >
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
                {current.avatar ? (
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span
                    className="text-6xl font-bold"
                    style={{
                      fontFamily: "Syne, system-ui, sans-serif",
                      color: "oklch(0.97 0.01 280)",
                    }}
                  >
                    {getInitials(current.name)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-center">
              <h1
                className="text-2xl font-bold"
                style={{
                  fontFamily: "Syne, system-ui, sans-serif",
                  color: "oklch(0.97 0.01 280)",
                }}
              >
                {current.name}
              </h1>
              <p className="mt-1 text-sm" style={{ color: "oklch(0.7 0.04 270)" }}>
                {current.email}
              </p>
            </div>
          </section>

          {/* Details */}
          <section
            className="rounded-3xl p-8 backdrop-blur-xl"
            style={{
              border: "1px solid oklch(0.35 0.08 275 / 0.35)",
              background: "oklch(0.17 0.035 270 / 0.6)",
            }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2
                className="text-xl font-semibold"
                style={{
                  fontFamily: "Syne, system-ui, sans-serif",
                  color: "oklch(0.97 0.01 280)",
                }}
              >
                Account Information
              </h2>
              <button
                type="button"
                className="rounded-full px-5 py-2 text-sm font-semibold transition hover:opacity-90"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-glow)",
                  color: "oklch(0.98 0.01 280)",
                }}
              >
                Edit
              </button>
            </div>

            <div className="space-y-5">
              <Field label="Name" value={current.name} />
              <Field label="Email" value={current.email} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

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