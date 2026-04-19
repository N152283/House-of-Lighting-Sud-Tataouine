import React from 'react';

const banners = [
  'Free delivery from 150 DT',
  'Up to -30% on LED lighting',
  'New smart lights available',
];

export default function AnnouncementBar() {
  return (
    <div className="relative bg-slate-900 text-white text-sm sm:text-base">
      <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-4 overflow-hidden">
        <div className="flex items-center gap-3 text-slate-200 font-medium uppercase tracking-[0.18em]">
          <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
          {banners.map((text, index) => (
            <span key={text} className="flex items-center gap-3">
              {text}
              {index < banners.length - 1 && <span className="text-slate-600">•</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
