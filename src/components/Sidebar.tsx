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
    {
      icon: MapPin,
      label: 'Lihat Semua',
      href: '/lihat-semua',
      type: 'link' as const,
    },
    { icon: Bot, label: 'Chatbot', href: '#', type: 'button' as const },
  ];

  return (
    <div className="fixed left-0 top-1/3 z-50 group/sidebar">
      {/* Hover Trigger Area - Invisible area to trigger hover from edge */}
      <div className="absolute -left-2 top-0 bottom-0 w-6 z-10" />

      {/* Sidebar Container with Auto-hide */}
      <div className="relative glass-dark backdrop-blur-2xl shadow-2xl overflow-hidden border-r-4 border-blue-400 rounded-r-3xl transition-all duration-500 -translate-x-[calc(100%-16px)] group-hover/sidebar:translate-x-0 hover:translate-x-0">
        {/* Accent Bar - Always Visible */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-600"></div>

        {/* Vertical Indicator Dots - Visible when collapsed */}
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-100 group-hover/sidebar:opacity-0 transition-opacity duration-300">
          {navItems.map((_, idx) => (
            <div
              key={idx}
              className="w-2 h-2 bg-blue-600 rounded-full shadow-lg"
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
                  className={`relative p-3 transition-all duration-300 border-b border-blue-600/20 last:border-b-0 group/item overflow-hidden hover:bg-blue-600/20`}
                  title={item.label}
                >
                  {/* Icon with Hover Effect */}
                  <div className="relative w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <div
                      className={`absolute inset-0 bg-blue-600 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-all duration-300 shadow-xl`}
                    ></div>
                    <Icon className="w-8 h-8 text-blue-300 group-hover/item:text-white relative z-10 transition-all duration-300 group-hover/item:scale-110" />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-xs font-bold text-center block transition-colors duration-300 text-gray-300 group-hover/item:text-white uppercase tracking-wider`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={idx}
                href={item.href}
                className={`relative p-3 transition-all duration-300 border-b border-blue-600/20 last:border-b-0 group/item overflow-hidden ${
                  isActive ? 'bg-blue-600/30' : 'hover:bg-blue-600/20'
                }`}
                title={item.label}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-600 shadow-lg"></div>
                )}

                <div className="relative flex flex-col items-center gap-2">
                  {/* Icon Container */}
                  <div
                    className={`relative transition-all duration-300 ${
                      isActive ? 'scale-110' : 'group-hover/item:scale-110'
                    }`}
                  >
                    <div
                      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                        isActive
                          ? 'bg-blue-600'
                          : 'bg-blue-600/50 group-hover/item:bg-blue-600'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 transition-all duration-300 ${
                          isActive
                            ? 'text-white'
                            : 'text-blue-200 group-hover/item:text-white group-hover/item:scale-110'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Label - Show only on hover sidebar */}
                  <div
                    className={`text-[10px] font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? 'opacity-0 group-hover/sidebar:opacity-100 text-gray-300'
                        : 'opacity-0 group-hover/sidebar:opacity-100 group-hover/item:text-white text-gray-400'
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
