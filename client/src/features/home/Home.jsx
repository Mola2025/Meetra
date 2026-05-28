import React from 'react';
import './Home.css';
import FeatureCard from '../../components/home-cards/FeatureCard';

// const Home = () => {
//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       minHeight: 'calc(100vh - 64px)',
//       backgroundColor: '#0a0b14',
//       color: '#f0f0ff'
//     }}>
//       <h1>🏠 Home Page Working!</h1>
//     </div>
//   );
// };

// export default Home;


/* ── SVG Icons ─────────────────────────────────────────── */
const IconVideo = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <path d="M16 10l6-4v12l-6-4V10z" />
  </svg>
);
 
const IconPeople = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="7" r="3" />
    <path d="M3 20c0-4 2.7-6 6-6s6 2 6 6" />
    <circle cx="17" cy="8" r="2.5" />
    <path d="M17 14c2.5 0 4 1.5 4 4" />
  </svg>
);
 
const IconShield = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3l8 3.5v5C20 16 16.5 20 12 21 7.5 20 4 16 4 11.5v-5L12 3z" />
  </svg>
);
 
const IconBolt = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
);
 
/* ── Feature data ───────────────────────────────────────── */
const FEATURES = [
  {
    icon: <IconVideo />,
    title: 'HD Video & Audio',
    desc: 'Crystal-clear video quality and noise-canceling audio for professional meetings.',
  },
  {
    icon: <IconPeople />,
    title: 'Unlimited Participants',
    desc: 'Host meetings with unlimited participants without compromising quality.',
  },
  {
    icon: <IconShield />,
    title: 'Secure & Private',
    desc: 'End-to-end encryption and advanced security features to protect your meetings.',
  },
  {
    icon: <IconBolt />,
    title: 'AI-Powered',
    desc: 'Real-time transcription, summaries, and smart meeting assistance.',
  },
];
 
/* ── Component ──────────────────────────────────────────── */
const Home = () => {
  return (
    <div className="home">
      {/* Background ambient blobs */}
      <div className="home__bg-blob home__bg-blob--left" />
      <div className="home__bg-blob home__bg-blob--right" />
 
      {/* ── Hero ── */}
      <section className="home__hero flex flex-col items-center text-center pt-28 pb-24 px-6">
        <h1 className="home__heading mb-6">
          Video Conferencing Made Simple
        </h1>
 
        <p className="home__subtext mb-10">
          Professional video meetings with AI-powered features, crystal-clear audio,
          and seamless collaboration tools. Built for teams of all sizes.
        </p>
 
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button className="home__btn-primary">Start a Meeting</button>
          <button className="home__btn-secondary">Join a Meeting</button>
        </div>
      </section>
 
      {/* ── Features grid ── */}
      <section className="home__features px-6 pb-24 max-w-6xl mx-auto">
        <div className="home__features-grid">
          {FEATURES.map((f) => (
            <FeatureCard
              key={f.title}
              icon={f.icon}
              title={f.title}
              desc={f.desc}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
 
export default Home;