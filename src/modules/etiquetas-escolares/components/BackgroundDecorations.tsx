import React from 'react';

const BackgroundDecorations = React.memo(function BackgroundDecorations() {
  return (
    <>
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-40 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-20 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/3 pointer-events-none"></div>
      <div className="absolute bottom-1/2 right-10 w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 pointer-events-none"></div>

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <svg className="absolute top-[5%] left-[2%] text-yellow-400 rotate-12 w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.5-6.3-4.8-6.3 4.8 2.3-7.5-6-4.6h7.6z" />
        </svg>
        <svg className="absolute top-[15%] left-[8%] text-green-500 -rotate-12 w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg className="absolute top-[25%] left-[3%] text-pink-500 rotate-45 w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.5-6.3-4.8-6.3 4.8 2.3-7.5-6-4.6h7.6z" />
        </svg>
        <svg className="absolute top-[35%] left-[10%] text-purple-400 -rotate-12 w-24 h-24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12c3-4 6-4 9 0s6 4 9 0" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 16c3-4 6-4 9 0s6 4 9 0" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <svg className="absolute top-[45%] left-[4%] text-blue-400 rotate-12 w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
           <circle cx="12" cy="12" r="10" />
        </svg>
        <svg className="absolute top-[55%] left-[9%] text-orange-400 -rotate-6 w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-4 7c3 0 5.5-2 6.5-5H5.5c1 3 3.5 5 6.5 5z" fill="#fff"/>
        </svg>
        <svg className="absolute top-[65%] left-[2%] text-yellow-500 rotate-45 w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.5-6.3-4.8-6.3 4.8 2.3-7.5-6-4.6h7.6z" />
        </svg>
        <svg className="absolute top-[75%] left-[12%] text-green-400 rotate-12 w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg className="absolute top-[85%] left-[5%] text-pink-400 -rotate-12 w-20 h-20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12c3-4 6-4 9 0s6 4 9 0" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 16c3-4 6-4 9 0s6 4 9 0" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <svg className="absolute top-[95%] left-[3%] text-cyan-400 rotate-12 w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.5-6.3-4.8-6.3 4.8 2.3-7.5-6-4.6h7.6z" />
        </svg>

        <svg className="absolute top-[8%] right-[4%] text-pink-400 -rotate-12 w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg className="absolute top-[18%] right-[10%] text-cyan-400 rotate-6 w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-4 7c3 0 5.5-2 6.5-5H5.5c1 3 3.5 5 6.5 5z" fill="#fff"/>
        </svg>
        <svg className="absolute top-[28%] right-[3%] text-yellow-400 rotate-45 w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.5-6.3-4.8-6.3 4.8 2.3-7.5-6-4.6h7.6z" />
        </svg>
        <svg className="absolute top-[38%] right-[8%] text-orange-400 -rotate-12 w-14 h-14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12c3-4 6-4 9 0s6 4 9 0" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 16c3-4 6-4 9 0s6 4 9 0" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <svg className="absolute top-[48%] right-[2%] text-green-400 rotate-12 w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg className="absolute top-[58%] right-[10%] text-purple-400 -rotate-45 w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.5-6.3-4.8-6.3 4.8 2.3-7.5-6-4.6h7.6z" />
        </svg>
        <svg className="absolute top-[68%] right-[4%] text-blue-400 rotate-12 w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
           <circle cx="12" cy="12" r="10" />
        </svg>
        <svg className="absolute top-[78%] right-[11%] text-yellow-400 -rotate-6 w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-4 7c3 0 5.5-2 6.5-5H5.5c1 3 3.5 5 6.5 5z" fill="#fff"/>
        </svg>
        <svg className="absolute top-[88%] right-[5%] text-pink-400 rotate-12 w-18 h-18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12c3-4 6-4 9 0s6 4 9 0" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 16c3-4 6-4 9 0s6 4 9 0" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <svg className="absolute top-[98%] right-[2%] text-green-400 -rotate-12 w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </>
  );
});

export default BackgroundDecorations;
