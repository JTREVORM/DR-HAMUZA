/**
 * A single place that knows which video is currently playing.
 *
 * The homepage carries a lot of footage, and nothing looks less considered than
 * two clips talking over each other. Every player registers itself here; when
 * one starts, the rest are asked to stop.
 */

const players = new Set<HTMLVideoElement>();

export function registerPlayer(el: HTMLVideoElement) {
  players.add(el);
  return () => {
    players.delete(el);
  };
}

/** Pauses every player except the one that just started. */
export function claimPlayback(current: HTMLVideoElement) {
  for (const el of players) {
    if (el !== current && !el.paused) el.pause();
  }
}

/**
 * True when the visitor has asked for less movement, or the browser has told us
 * the connection is metered. Either way the hero keeps its poster instead of
 * pulling down a video the visitor did not ask for.
 */
export function prefersStillHero() {
  if (typeof window === 'undefined') return false;

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  if (reducedMotion) return true;

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  if (connection?.saveData) return true;
  if (connection?.effectiveType && /^(slow-)?2g$/.test(connection.effectiveType)) return true;

  return false;
}
