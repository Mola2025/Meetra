import React from "react";
import FeatureCard from "../../components/home-cards/FeatureCard";
import {useNavigate} from "react-router-dom";
import "./Dashboard.css";

//  SVG Icons 
import PlusIcon from "../../assets/plus-icon.svg";
import UsersIcon from "../../assets/users-icon.svg";
import ClockIcon from "../../assets/clock-icon.svg";
import CalendarIcon from "../../assets/calendar-dashboard-icon.svg";

//  Mock Data
// TODO: Replace with real API calls once endpoints are available

const UPCOMING_MEETINGS = [
  { id: 1, title: "Team Meeting", time: "10:00 AM", participants: 8 },
  { id: 2, title: "Client Presentation", time: "2:00 PM", participants: 5 },
  { id: 3, title: "Product Review", time: "4:30 PM", participants: 12 },
];

const RECENT_MEETINGS = [
  { id: 1, title: "Meeting 1", date: "May 20, 2026", duration: "45 min" },
  { id: 2, title: "Meeting 2", date: "May 19, 2026", duration: "1h 20min" },
  { id: 3, title: "Meeting 3", date: "May 18, 2026", duration: "30 min" },
];

//  SVG Icons - The one i couldnt find in svg repos so i made them myself, feel free to replace with better ones :)

const VideoIcon = () => (
  <svg viewBox="0 0 22 22" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 10l4.553-2.277A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.898L15 14v-4z" />
    <rect x="3" y="8" width="12" height="8" rx="2" ry="2" />
  </svg>
);


// const MenuIcon = () => (
//   <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none"
//     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="3" y1="12" x2="21" y2="12" />
//     <line x1="3" y1="6" x2="21" y2="6" />
//     <line x1="3" y1="18" x2="21" y2="18" />
//   </svg>
// );

// Component 

const Dashboard = () => {
  const navigate = useNavigate();
  // TODO: Replace with real user data from auth context / API
  const userName = "Username";

  // TODO: Wire these handlers to real navigation / modal logic
const handleNewMeeting = () => {
    navigate("/create-room");
  };
  const handleJoinMeeting = () => navigate("/lobby-waiting-room");
  const handleSchedule = () => navigate("/create-room");
  const handleJoin = (id) => navigate(`/lobby-waiting-room?room=${id}`);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#12131f] px-8 pt-10 pb-24 relative">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-10">

        {/* ── Header ── */}
        <h1 className="text-[1.75rem] font-bold text-[#f0f0ff] tracking-tight m-0">
          Welcome back, {userName}
        </h1>

        {/* ── Action Cards ── */}
        <section
          className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1"
          aria-label="Quick actions"
        >
          {/* New Meeting — primary purple variant */}
          <div
            className="dashboard__action-primary rounded-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff] max-[900px]:col-span-2 max-[600px]:col-span-1"
            onClick={handleNewMeeting}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleNewMeeting()}
            aria-label="Start a new meeting"
          >
            <FeatureCard
              icon={    
                  <img
                    src={PlusIcon}
                    alt=""
                    className="w-[40px] h-[40px]"
                  />}
              title="New Meeting"
              desc="Start an instant meeting"
              className="feature-card--primary"
            />
          </div>

          <div
            className="rounded-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff]"
            onClick={handleJoinMeeting}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleJoinMeeting()}
            aria-label="Join a meeting"
          >
            <FeatureCard
              icon={<VideoIcon />}
              title="Join Meeting"
              desc="Enter a meeting code"
            />
          </div>

          <div
            className="rounded-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff]"
            onClick={handleSchedule}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleSchedule()}
            aria-label="Schedule a meeting"
          >
            <FeatureCard
              icon={
                <img
                  src={CalendarIcon}
                  alt=""
                  className="w-[40px] h-[40px]"
                />
              }
              title="Schedule"
              desc="Plan a meeting for later"
            />
          </div>
        </section>

        {/* ── Upcoming Meetings ── */}
        <section className="flex flex-col gap-4" aria-label="Upcoming meetings">
          <h2 className="text-[1.1rem] font-bold text-[#f0f0ff] tracking-tight m-0">
            Upcoming Meetings
          </h2>

          <ul className="list-none m-0 p-0 flex flex-col gap-[0.6rem]">
            {/* TODO: map over data fetched from GET /api/meetings/upcoming */}
            {UPCOMING_MEETINGS.map((meeting) => (
              <li
                key={meeting.id}
                className="flex items-center gap-4 px-5 py-4 bg-white/[0.04] border border-white/[0.07] rounded-xl transition-colors duration-200 hover:bg-white/[0.06] hover:border-[#6d56ea]/30"
              >
                {/* Icon */}
                <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-[#6c63ff]/15 rounded-[10px] text-[#7c6ff7]">
                  <span className="w-[18px] h-[18px]"><VideoIcon /></span>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col gap-[0.3rem] min-w-0">
                  <span className="text-[0.95rem] font-bold text-[#f0f0ff] truncate">
                    {meeting.title}
                  </span>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-[0.3rem] text-[0.78rem] text-[rgba(200,200,230,0.55)]">
                      <img src={ClockIcon} alt="Clock" className="w-[13px] h-[13px] shrink-0" /> {meeting.time}
                    </span>
                    <span className="flex items-center gap-[0.3rem] text-[0.78rem] text-[rgba(200,200,230,0.55)]">
                      <img src={UsersIcon} alt="Users" className="w-[13px] h-[13px] shrink-0" /> {meeting.participants} participants
                    </span>
                  </div>
                </div>

                {/* JOIN */}
                <button
                  className="shrink-0 px-[1.1rem] py-[0.45rem] bg-[#6c63ff]/[0.18] border border-[#6c63ff]/40 rounded-lg text-[#a89fff] text-[0.75rem] font-bold tracking-widest cursor-pointer transition-all duration-200 hover:bg-[#6c63ff]/[0.32] hover:border-[#6c63ff]/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff]/50 font-[Inter,_'Segoe_UI',_sans-serif]"
                  onClick={() => handleJoin(meeting.id)}
                  aria-label={`Join ${meeting.title}`}
                >
                  JOIN
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Recent Meetings ── */}
        <section className="flex flex-col gap-4" aria-label="Recent meetings">
          <h2 className="text-[1.1rem] font-bold text-[#f0f0ff] tracking-tight m-0">
            Recent Meetings
          </h2>

          <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {/* TODO: map over data fetched from GET /api/meetings/recent */}
            {RECENT_MEETINGS.map((meeting) => (
              <div
                key={meeting.id}
                className="flex flex-col gap-[0.4rem] px-6 py-5 bg-white/[0.04] border border-white/[0.07] rounded-[14px] transition-all duration-200 hover:bg-white/[0.07] hover:border-[#6d56ea]/30 hover:-translate-y-0.5"
              >
                <span className="text-[0.95rem] font-bold text-[#f0f0ff]">{meeting.title}</span>
                <span className="text-[0.78rem] text-[rgba(200,200,230,0.5)]">{meeting.date}</span>
                <span className="text-[0.78rem] text-[rgba(200,200,230,0.45)]">{meeting.duration}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── FAB ── */}
      {/* TODO: wire this to a quick-action sheet or chat */}
      {/* <button
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full border-none flex items-center justify-center cursor-pointer z-[100] transition-all duration-200 hover:scale-[1.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff]/50 dashboard__fab"
        aria-label="Quick actions"
      >
        <MenuIcon />
      </button> */}
    </div>
  );
};

export default Dashboard;