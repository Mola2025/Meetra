export default function ControlBarButton({
  icon,
  label,
  onClick,
  active = true,
  danger = false,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`
        flex items-center justify-center
        w-11 h-11 rounded-full
        transition-all duration-200 active:scale-95
        ${danger
          ? "bg-red-500 hover:bg-red-400 text-white"
          : active
            ? "bg-white/10 hover:bg-white/20 text-white"
            : "bg-white/5 hover:bg-white/10 text-meetra-muted"
        }
        ${className}
      `}
    >
      {icon}
    </button>
  );
}