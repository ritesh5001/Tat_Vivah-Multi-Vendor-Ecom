"use client";

import * as React from "react";

export function GlobalLoader() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const handleStart = () => setCount((prev) => prev + 1);
    const handleEnd = () =>
      setCount((prev) => (prev > 0 ? prev - 1 : 0));

    window.addEventListener("tv-global-loading-start", handleStart);
    window.addEventListener("tv-global-loading-end", handleEnd);

    return () => {
      window.removeEventListener("tv-global-loading-start", handleStart);
      window.removeEventListener("tv-global-loading-end", handleEnd);
    };
  }, []);

  if (count <= 0) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 backdrop-blur dark:bg-slate-950/70">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-rose-100 bg-white/90 px-8 py-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-fuchsia-600 text-white shadow-lg shadow-rose-500/30">
            <span className="text-xl font-semibold">T</span>
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              TatVivah
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Processing your request
            </p>
          </div>
        </div>
        <div className="h-1.5 w-56 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full w-1/2 animate-[loader_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600" />
        </div>
      </div>
      <style jsx>{`
        @keyframes loader {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
