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
      <div className="relative glass-dark backdrop-blur-2xl shadow-2xl overflow-hidden border-r-2 border-blue-400 transition-all duration-500 -translate-x-[calc(100%-12px)] group-hover/sidebar:translate-x-0 hover:translate-x-0">
        {/* Accent Bar - Always Visible */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>

        {/* Vertical Indicator Dots - Visible when collapsed */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-100 group-hover/sidebar:opacity-0 transition-opacity duration-300">
          {navItems.map((_, idx) => (
            <div key={idx} className="w-1.5 h-1.5 bg-blue-600 shadow-lg"></div>
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
                  className={`relative p-2 transition-all duration-300 border-b border-blue-600/20 last:border-b-0 group/item overflow-hidden hover:bg-blue-600/20`}
                  title={item.label}
                >
                  {/* Icon with Hover Effect */}
                  <div className="relative w-10 h-10 flex items-center justify-center mx-auto mb-1">
                    <div
                      className={`absolute inset-0 bg-blue-600 opacity-0 group-hover/item:opacity-100 transition-all duration-300 shadow-xl`}
                    ></div>
                    <Icon className="w-5 h-5 text-blue-600 group-hover/item:text-white relative z-10 transition-all duration-300 group-hover/item:scale-110" />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[10px] font-bold text-center block transition-colors duration-300 text-blue-600 hover:text-blue-800 uppercase tracking-wider`}
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
                className={`relative p-2 transition-all duration-300 border-b border-blue-600/20 last:border-b-0 group/item overflow-hidden ${
                  isActive ? 'bg-blue-600/30' : 'hover:bg-blue-600/20'
                }`}
                title={item.label}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 shadow-lg"></div>
                )}

                {/* Icon with Hover Effect */}
                <div className="relative w-10 h-10 flex items-center justify-center mx-auto mb-1">
                  <div
                    className={`absolute inset-0 transition-all duration-300 shadow-xl ${
                      isActive
                        ? 'bg-blue-600 opacity-100'
                        : 'bg-blue-600 opacity-0 group-hover/item:opacity-100'
                    }`}
                  ></div>
                  <Icon
                    className={`w-5 h-5 relative z-10 transition-all duration-300 group-hover/item:scale-110 ${
                      isActive
                        ? 'text-white'
                        : 'text-blue-600 group-hover/item:text-white'
                    }`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] font-bold text-center block transition-colors duration-300 uppercase tracking-wider text-blue-600 hover:text-blue-800`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
