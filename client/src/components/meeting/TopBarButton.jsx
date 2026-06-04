export default function TopBarButton({
  icon,
  label,
  onClick,
  active = false,
  badge = null,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`
        relative flex items-center justify-center
        w-9 h-9 rounded-lg
        transition-all duration-200
        ${active
          ? "bg-meetra-purple text-white"
          : "text-meetra-muted hover:bg-white/10 hover:text-white"
        }
        ${className}
      `}
    >
      {icon}

      {badge !== null && (
        <span className="
          absolute -top-1 -right-1
          min-w-[16px] h-4 px-1
          flex items-center justify-center
          rounded-full text-[10px] font-bold
          bg-meetra-purple text-white
        ">
          {badge}
        </span>
      )}
    </button>
  );
}