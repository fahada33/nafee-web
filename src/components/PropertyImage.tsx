const gradients = [
  "from-[#1a4a2e] to-[#2d7b33]",
  "from-[#1a3a4a] to-[#2d5f7b]",
  "from-[#3a2d1a] to-[#7b5a2d]",
  "from-[#2d1a3a] to-[#5a2d7b]",
  "from-[#1a2d3a] to-[#2d5a7b]",
];

const icons = [
  // Office tower
  <svg key="office" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="15" width="40" height="55" rx="2" fill="white" fillOpacity="0.15"/>
    <rect x="26" y="22" width="8" height="8" rx="1" fill="white" fillOpacity="0.4"/>
    <rect x="38" y="22" width="8" height="8" rx="1" fill="white" fillOpacity="0.4"/>
    <rect x="50" y="22" width="4" height="8" rx="1" fill="white" fillOpacity="0.4"/>
    <rect x="26" y="34" width="8" height="8" rx="1" fill="white" fillOpacity="0.4"/>
    <rect x="38" y="34" width="8" height="8" rx="1" fill="white" fillOpacity="0.4"/>
    <rect x="26" y="46" width="8" height="8" rx="1" fill="white" fillOpacity="0.4"/>
    <rect x="38" y="46" width="8" height="8" rx="1" fill="white" fillOpacity="0.4"/>
    <rect x="32" y="58" width="16" height="12" rx="1" fill="white" fillOpacity="0.3"/>
    <rect x="10" y="45" width="14" height="25" rx="2" fill="white" fillOpacity="0.1"/>
    <rect x="56" y="50" width="14" height="20" rx="2" fill="white" fillOpacity="0.1"/>
  </svg>,
  // Villa
  <svg key="villa" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="40,12 65,35 15,35" fill="white" fillOpacity="0.2"/>
    <rect x="18" y="35" width="44" height="33" rx="1" fill="white" fillOpacity="0.15"/>
    <rect x="30" y="48" width="20" height="20" rx="1" fill="white" fillOpacity="0.25"/>
    <rect x="22" y="40" width="10" height="10" rx="1" fill="white" fillOpacity="0.4"/>
    <rect x="48" y="40" width="10" height="10" rx="1" fill="white" fillOpacity="0.4"/>
  </svg>,
  // Mall
  <svg key="mall" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="30" width="64" height="38" rx="3" fill="white" fillOpacity="0.15"/>
    <rect x="8" y="20" width="64" height="12" rx="2" fill="white" fillOpacity="0.2"/>
    <rect x="15" y="38" width="12" height="18" rx="1" fill="white" fillOpacity="0.35"/>
    <rect x="34" y="38" width="12" height="18" rx="1" fill="white" fillOpacity="0.35"/>
    <rect x="53" y="38" width="12" height="18" rx="1" fill="white" fillOpacity="0.35"/>
    <rect x="30" y="55" width="20" height="13" rx="1" fill="white" fillOpacity="0.25"/>
  </svg>,
  // Warehouse
  <svg key="warehouse" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="30" width="60" height="38" rx="2" fill="white" fillOpacity="0.15"/>
    <path d="M10 30 L40 15 L70 30" fill="white" fillOpacity="0.2"/>
    <rect x="15" y="45" width="15" height="23" rx="1" fill="white" fillOpacity="0.3"/>
    <rect x="50" y="45" width="15" height="23" rx="1" fill="white" fillOpacity="0.3"/>
    <rect x="33" y="50" width="14" height="18" rx="1" fill="white" fillOpacity="0.2"/>
  </svg>,
];

interface PropertyImageProps {
  index?: number;
  title?: string;
  type?: string;
  className?: string;
}

export default function PropertyImage({ index = 0, title, type, className = "" }: PropertyImageProps) {
  const gradient = gradients[index % gradients.length];
  const icon = icons[index % icons.length];

  return (
    <div className={`bg-gradient-to-br ${gradient} relative overflow-hidden ${className}`}>
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,white 0,white 1px,transparent 0,transparent 50%),repeating-linear-gradient(90deg,white 0,white 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }}
      />
      {/* Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-60">
        <div className="w-20 h-20">{icon}</div>
      </div>
      {/* Type badge */}
      {type && (
        <div className="absolute top-3 right-3">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">{type}</span>
        </div>
      )}
    </div>
  );
}
