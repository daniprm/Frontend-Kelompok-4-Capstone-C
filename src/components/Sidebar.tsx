'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Route as RouteIcon, Bot, MapPin } from 'lucide-react';

interface SidebarProps {
  onChatbotClick?: () => void;
}

export default function Sidebar({ onChatbotClick }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
  { icon: Home, label: 'Beranda', href: '/', type: 'link' as const },
  { icon: RouteIcon, label: 'Rute', href: '/routes', type: 'link' as const },
  { icon: MapPin, label: 'Lihat Semua', href: '/lihat-semua', type: 'link' as const },
  { icon: Bot, label: 'Chatbot', href: '#', type: 'button' as const },
];

  return (
    <div className="fixed left-0 top-1/3 z-50 group/sidebar">
      {/* Hover Trigger Area - Invisible area to trigger hover from edge */}
      <div className="absolute -left-2 top-0 bottom-0 w-6 z-10" />

      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 opacity-0 group-hover/sidebar:opacity-20 blur-lg transition-opacity duration-500"></div>

      {/* Sidebar Container with Auto-hide */}
      <div className="relative bg-white shadow-xl overflow-hidden border-r-2 border-slate-700 transition-all duration-300 -translate-x-[calc(100%-12px)] group-hover/sidebar:translate-x-0 hover:translate-x-0">
        {/* Accent Bar - Always Visible */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-700 via-emerald-600 to-slate-700"></div>

        {/* Vertical Indicator Dots - Visible when collapsed */}
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-100 group-hover/sidebar:opacity-0 transition-opacity duration-300">
          {navItems.map((_, idx) => (
            <div
              key={idx}
              className="w-1.5 h-1.5 bg-slate-700 rounded-full"
            ></div>
          ))}
        </div>

        <div className="flex flex-col">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href && item.type === 'link';

            // Render button for chatbot, link for others
            if (item.type === 'button') {
              return (
                <button
                  key={idx}
                  onClick={onChatbotClick}
                  type="button"
                  className={`relative p-2 transition-all duration-300 border-b border-gray-100 last:border-b-0 group/item overflow-hidden hover:bg-gradient-to-r hover:from-gray-50 hover:to-white`}
                  title={item.label}
                >
                  {/* Icon with Hover Effect */}
                  <div className="relative w-14 h-14 flex items-center justify-center mx-auto mb-2">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300`}
                    ></div>
                    <Icon className="w-6 h-6 text-gray-600 group-hover/item:text-white relative z-10 transition-colors duration-300" />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-xs font-medium text-center block transition-colors duration-300 text-gray-600 group-hover/item:text-slate-800`}
                  >
                    {item.label}
                  </span>

                  {/* Hover Slide Effect */}
                  <div className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-slate-100/50 to-transparent transition-all duration-300 group-hover/item:w-full"></div>
                </button>
              );
            }

            return (
              <Link
                key={idx}
                href={item.href}
                className={`relative p-2 transition-all duration-300 border-b border-gray-100 last:border-b-0 group/item overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-slate-50 to-white'
                    : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-white'
                }`}
                title={item.label}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-700 to-slate-900"></div>
                )}

                {/* Hover Shimmer Effect */}
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-700"></span>

                <div className="relative flex flex-col items-center gap-1">
                  {/* Icon Container - Smaller */}
                  <div
                    className={`relative transition-all duration-300 ${
                      isActive ? 'scale-105' : 'group-hover/item:scale-110'
                    }`}
                  >
                    <div
                      className={`absolute inset-0 blur-sm opacity-0 group-hover/item:opacity-40 transition-opacity duration-300 ${
                        isActive ? 'bg-slate-700 opacity-40' : 'bg-slate-600'
                      }`}
                    ></div>
                    <div
                      className={`relative w-7 h-7 flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-slate-700 to-slate-900'
                          : 'bg-gradient-to-br from-gray-200 to-gray-300 group-hover/item:from-slate-600 group-hover/item:to-slate-800'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-colors duration-300 ${
                          isActive
                            ? 'text-white'
                            : 'text-gray-700 group-hover/item:text-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Label - Show only on hover sidebar */}
                  <div
                    className={`text-[9px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? 'opacity-0 group-hover/sidebar:opacity-100 text-slate-800'
                        : 'opacity-0 group-hover/sidebar:opacity-100 group-hover/item:text-slate-800 text-gray-700'
                    }`}
                  >
                    {item.label}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
