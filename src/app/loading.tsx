export default function Loading() {
  return (
    <div className="flex min-h-[70svh] items-center justify-center bg-forest-950">
      <div className="flex flex-col items-center gap-5" role="status" aria-live="polite">
        <span className="relative flex h-16 w-16">
          <span className="absolute inset-0 animate-ping rounded-full bg-gold-400/25" />
          <span className="relative m-auto h-10 w-10 rounded-full border-2 border-gold-400/30 border-t-gold-400 motion-safe:animate-spin" />
        </span>
        <span className="text-[0.72rem] uppercase tracking-[0.28em] text-gold-400/70">
          Loading
        </span>
      </div>
    </div>
  );
}
