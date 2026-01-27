export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-160px)] grid place-items-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-fuchsia-600 text-white shadow-lg shadow-rose-500/30">
          <span className="text-xl font-semibold">T</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading TatVivah…
        </p>
      </div>
    </div>
  );
}
