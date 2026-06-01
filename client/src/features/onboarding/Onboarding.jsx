import { useState } from "react";
import "./Onboarding.css";
import UsersIconPurple from "../../assets/users-icon-purple.svg";
import CalendarDashboardIcon from "../../assets/calendar-dashboard-icon.svg";
import StarIcon from "../../assets/star-icon.svg";
import CheckedIcon from "../../assets/checked-icon.svg";

const steps = [
  {
    id: 1,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="15" height="12" rx="2" />
        <path d="M17 9l5-3v12l-5-3V9z" />
      </svg>
    ),
    visual: <VideoVisual />,
    title: "Welcome to Meetra",
    desc: "The easiest way to connect with your team through high-quality video meetings.",
    isLast: false,
  },
  {
    id: 2,
    icon: <img src={UsersIconPurple} alt="Collaborate" style={{ width: 26, height: 26 }} />,
    visual: <CollaborateVisual />,
    title: "Collaborate Seamlessly",
    desc: "Share screens, chat in real-time, and work together with built-in whiteboard and collaboration tools.",
    isLast: false,
  },
  {
    id: 3,
    icon: <img src={CalendarDashboardIcon} alt="Schedule" style={{ width: 26, height: 26 }} />,
    visual: <ScheduleVisual />,
    title: "Schedule & Organize",
    desc: "Schedule meetings, set up recurring sessions, and manage your calendar all in one place.",
    isLast: false,
  },
  {
    id: 4,
    icon: <img src={StarIcon} alt="AI Features" style={{ width: 26, height: 26 }} />,
    visual: <AIVisual />,
    title: "AI-Powered Features",
    desc: "Get automatic transcriptions, meeting summaries, and smart insights powered by AI.",
    isLast: false,
  },
  {
    id: 5,
    icon: <img src={CheckedIcon} alt="Done" style={{ width: 26, height: 26 }} />,
    visual: <DoneVisual />,
    title: "You're All Set!",
    desc: "Start your first meeting or explore your dashboard to get familiar with all features.",
    isLast: true,
  },
];

/* ─── Step visuals ─── */

function VideoVisual() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <svg className="video-icon-main" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="15" height="12" rx="2" />
        <path d="M17 9l5-3v12l-5-3V9z" />
      </svg>
    </div>
  );
}
function CollaborateVisual() {
  const avatars = [
    { initials: "JD", bg: "#6c63ff" },
    { initials: "SJ", bg: "#9c4dcc" },
    { initials: "MC", bg: "#7c3aed" },
    { initials: "ER", bg: "#3d3a7c" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      {avatars.map((a) => (
        <div
          key={a.initials}
          className="avatar-circle flex items-center justify-center text-white font-semibold text-base"
          style={{ backgroundColor: a.bg }}
        >
          {a.initials}
        </div>
      ))}
    </div>
  );
}

function ScheduleVisual() {
  const items = [
    { lineW: "100px" },
    { lineW: "80px" },
    { lineW: "90px" },
  ];
  return (
    <div className="flex flex-col gap-3 p-5 w-full">
      {items.map((item, i) => (
        <div key={i} className="cal-item flex items-center gap-3 rounded-xl px-4 py-3">
          <div className="cal-icon-wrap flex items-center justify-center rounded-lg flex-shrink-0">
            <img src={CalendarDashboardIcon} alt="Calendar" width="14" height="14" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="line-placeholder rounded" style={{ width: item.lineW, height: "5px" }} />
            <div className="line-placeholder rounded" style={{ width: "60px", height: "5px", opacity: 0.5 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AIVisual() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <div className="dot-float dot-1" />
      <div className="dot-float dot-2" />
      <div className="dot-float dot-3" />
      <img src={StarIcon} alt="AI Features" className="ai-icon-main" />
    </div>
  );
}

function DoneVisual() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <img src={CheckedIcon} alt="Done" className="done-icon-main" />
    </div>
  );
}

/* ─── Main component ─── */

export default function Onboarding({ onFinish }) {
  
  // States to handle navigation and animations
    const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next");

  // Get current step
  const step = steps[current];
  const isFirst = current === 0;
  const isLast = current === steps.length - 1;


  // Go to step with animation 
  const goTo = (index, dir = "next") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 220);
  };

  // Handlers
  // Handle next step or finish onboarding
  const handleNext = () => {
    if (isLast) {
      onFinish?.();
      return;
    }
    goTo(current + 1, "next");
  };

  // Handle previous step navigation 
  const handleBack = () => {
    if (isFirst) return;
    goTo(current - 1, "back");
  };

  // Handle skip to end of onboarding
  const handleSkip = () => {
    goTo(steps.length - 1, "next");
  };

  return (
    <div className="onboarding-root flex flex-col items-center min-h-screen w-full">
      <div className="onboarding-card flex flex-col items-center w-full max-w-lg mx-auto px-8 py-10 relative">

        {/* Progress bar */}
        <div className="flex gap-2 mb-8 w-full max-w-xs justify-center">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`progress-seg flex-1 h-1 rounded-full transition-all duration-300 ${i <= current ? "active" : ""}`}
            />
          ))}
        </div>

        {/* Step icon */}
        <div className="step-icon-wrap flex items-center justify-center rounded-2xl mb-6">
          {step.icon}
        </div>

        {/* Visual card */}
        <div className={`visual-card flex items-center justify-center w-full rounded-2xl mb-8 overflow-hidden ${animating ? (direction === "next" ? "slide-out-left" : "slide-out-right") : "slide-in"}`}>
          {step.visual}
        </div>

        {/* Text */}
        <h1 className="step-title text-center font-bold mb-3">{step.title}</h1>
        <p className="step-desc text-center leading-relaxed mb-8">{step.desc}</p>

        {/* Navigation */}
        <div className="flex items-center w-full justify-between mb-5">
          <button
            onClick={handleBack}
            className={`btn-back flex items-center gap-2 text-sm transition-all duration-200 ${isFirst ? "invisible" : ""}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>

          {!isLast && (
            <button onClick={handleSkip} className="btn-skip text-sm transition-all duration-200">
              Skip tour
            </button>
          )}

          <button onClick={handleNext} className="btn-next flex items-center gap-2 text-sm font-bold tracking-widest rounded-xl px-6 py-3 transition-all duration-200">
            {isLast ? "GET STARTED" : "NEXT"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        <span className="step-counter text-sm">Step {current + 1} of {steps.length}</span>
      </div>
    </div>
  );
}