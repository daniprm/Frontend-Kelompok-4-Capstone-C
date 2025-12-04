export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="particle w-32 h-32 top-10 left-10 opacity-30 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="particle w-24 h-24 bottom-20 right-20 opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="text-center relative z-10 animate-bounce-in">
        <div className="relative inline-block mb-8">
          <div className="animate-spin rounded-full h-32 w-32 border-8 border-blue-600/20 border-t-blue-600 mx-auto shadow-2xl"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full"></div>
          </div>
        </div>
        <p className="text-gray-300 text-2xl font-bold animate-pulse">Memuat...</p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
