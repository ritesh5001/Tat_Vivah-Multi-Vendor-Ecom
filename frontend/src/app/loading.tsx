"use client";

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-160px)] grid place-items-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Premium Logo */}
        <div className="flex h-14 w-14 items-center justify-center border border-border-warm bg-cream text-charcoal dark:bg-brown dark:text-ivory">
          <span className="font-serif text-2xl font-light">T</span>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <p className="font-serif text-lg font-light text-foreground">
            TatVivah
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Loading...
          </p>
        </div>

        {/* Subtle Loading Bar - CSS animation via Tailwind */}
        <div className="h-px w-32 bg-border-soft overflow-hidden">
          <div className="h-full w-1/3 bg-gold animate-pulse" />
        </div>
      </div>
    </div>
  );
}
