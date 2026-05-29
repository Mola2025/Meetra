import { useState } from 'react';
import './Auth.css';

export default function Auth({ mode: initialMode = 'login', onLogin, onRegister }) {

  const [mode, setMode] = useState(initialMode);

//   States
  const [fields, setFields] = useState({
    name: '', email: '', password: '',
  });
  const [touched,      setTouched]      = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

//   Helpers
  const set   = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));
  const touch = (key) => ()  => setTouched((t) => ({ ...t, [key]: true }));

//   Validations
  const errors = (() => {
    const e = {};
    if (mode === 'register') {
      if (fields.name.trim().length < 2) e.name = 'At least 2 characters';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Valid email required';
    } else {
      if (!fields.email.trim()) e.email = 'Email required';
    }
    if (fields.password.length < 6) e.password = 'At least 6 characters';
    return e;
  })();

  const isValid = Object.keys(errors).length === 0;
  const err     = (key) => touched[key] && errors[key];

//  Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const relevantFields = mode === 'register'
      ? ['name', 'email', 'password']
      : ['email', 'password'];
    setTouched(Object.fromEntries(relevantFields.map((k) => [k, true])));

    if (!isValid) return;

    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        await onRegister?.({ name: fields.name, email: fields.email, password: fields.password });
      } else {
        await onLogin?.({ email: fields.email, password: fields.password });
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ?? error?.message ??
        (mode === 'register' ? 'Could not complete registration.' : 'Could not sign in.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

//  Switch mode function
  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setFields({ name: '', email: '', password: '' });
    setTouched({});
    setErrorMessage('');
  };

// Hero little info points
  const heroPoints = [
    { icon: '🎥', label: 'HD Video'      },
    { icon: '🔒', label: 'End-to-End'    },
    { icon: '🤖', label: 'Trasciptions'  },
    { icon: '🖥️', label: 'Screen Share' },
    { icon: '💬', label: 'Live Chat'     },
  ];

  return (
    <div className="auth-shell">

      {/* LEFT – Hero card */}
      <div className="hero-card">

        {/* Brand */}
        <div className="hero-brand">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black" style={{ margin: 0, lineHeight: 1 }}>
            Meet<span className="brand-accent">ra</span>
          </h1>
        </div>

        {/* Hero text */}
        <div className="hero-text">
          <h1 className="description" style={{ margin: 0 }}>
            Meet anyone, anywhere — instantly.
          </h1>

          <p className="hero-copy">
            Crystal-clear video conferences,
            real-time transcription, collaborative whiteboard, and host
            controls — all in one place.
          </p>
        </div>

        {/* Feature points */}
        <div className="hero-points">
          {heroPoints.map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-2">
              <span aria-hidden="true">{icon}</span>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ════ RIGHT – Form card ════ */}
      <div className="form-card">

        {/* Header */}
        <div className="form-header">
          <p className="eyebrow">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </p>
          <h2 className="text-3xl font-bold">
            {mode === 'login' ? 'Access your account' : 'Register your account'}
          </h2>
        </div>

        {/* Form */}
        <form className="auth-form flex flex-col gap-4" onSubmit={handleSubmit} noValidate>

          {/* ── Register-only fields ── */}
          {mode === 'register' && (
            <>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Full Name</span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fields.name}
                  onChange={set('name')}
                  onBlur={touch('name')}
                  className={err('name') ? 'input-error' : ''}
                  autoComplete="name"
                />
                {err('name') && <span className="field-error text-xs text-[var(--error-text)] pl-1">{err('name')}</span>}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Email</span>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={fields.email}
                  onChange={set('email')}
                  onBlur={touch('email')}
                  className={err('email') ? 'input-error' : ''}
                  autoComplete="email"
                />
                {err('email') && <span className="field-error text-xs text-[var(--error-text)] pl-1">{err('email')}</span>}
              </label>
            </>
          )}

          {/* ── Login-only field ── */}
          {mode === 'login' && (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Email</span>
              <input
                type="email"
                placeholder="example@email.com"
                value={fields.email}
                onChange={set('email')}
                onBlur={touch('email')}
                className={err('email') ? 'input-error' : ''}
                autoComplete="email"
              />
              {err('email') && <span className="field-error text-xs text-[var(--error-text)] pl-1">{err('email')}</span>}
            </label>
          )}

          {/* ── Password (both modes) ── */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Password</span>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={fields.password}
              onChange={set('password')}
              onBlur={touch('password')}
              className={err('password') ? 'input-error' : ''}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />
            {err('password') && <span className="field-error text-xs text-[var(--error-text)] pl-1">{err('password')}</span>}
          </label>

          {/* ── Global error banner ── */}
          {errorMessage && (
            <p className="feedback error" role="alert">{errorMessage}</p>
          )}

          {/* ── Submit ── */}
          <button type="submit" disabled={isSubmitting} className="mt-1.5 w-full">
            {isSubmitting
              ? 'Processing…'
              : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        {/* ── Mode switch ── */}
        <p className="switch-link mt-6 text-sm text-center text-[var(--muted)]">
          {mode === 'login' ? (
            <>Don&apos;t have an account?{' '}<a onClick={switchMode}>Create one now</a></>
          ) : (
            <>Already registered?{' '}<a onClick={switchMode}>Back to sign in</a></>
          )}
        </p>
      </div>

    </div>
  );
}