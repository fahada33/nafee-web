import Link from "next/link";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  showNotification?: boolean;
}

export default function TopBar({ title, showBack, backHref = "/home", showNotification = true }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
      {showBack ? (
        <Link href={backHref} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </Link>
      ) : (
        <img src="/logo.svg" alt="نافع" className="h-8 w-auto" />
      )}

      {title && (
        <h1 className="text-base font-bold text-[#1a1a1a] absolute left-1/2 -translate-x-1/2">{title}</h1>
      )}

      {showNotification ? (
        <Link href="/notifications" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors relative">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </Link>
      ) : (
        <div className="w-9" />
      )}
    </header>
  );
}
