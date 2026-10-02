import type { VideoItem } from '@/lib/types';
import { InlineVideo } from '@/components/video/InlineVideo';
import { PortraitStage, VideoFrame } from '@/components/video/VideoFrame';
import { cn, videoThumbnail } from '@/lib/utils';

/**
 * Cinematic video frame. Nothing plays until the visitor asks for it — no
 * autoplay, and therefore never any unexpected sound.
 *
 * Portrait footage keeps its own shape on a softly blurred stage rather than
 * being stretched to fill a 16:9 box.
 */
export function VideoPlayer({
  video,
  className,
  priority,
}: {
  video: VideoItem;
  className?: string;
  priority?: boolean;
}) {
  const portrait = video.orientation === 'portrait';
  const poster = videoThumbnail(video);

  const player = (
    <InlineVideo
      video={video}
      priority={priority}
      showTitle
      objectFit={portrait ? 'contain' : 'cover'}
      sizes={portrait ? '(max-width: 640px) 85vw, 24rem' : '(max-width: 1024px) 100vw, 60vw'}
    />
  );

  if (!portrait) {
    return (
      <VideoFrame orientation="landscape" className={className} glow={false} rounded="rounded-2xl">
        {player}
      </VideoFrame>
    );
  }

  return (
    <PortraitStage poster={poster} className={cn(className)} height="h-[32rem] sm:h-[38rem]">
      <div className="relative h-full aspect-[9/16] overflow-hidden rounded-[1.25rem] border border-gold-500/35 shadow-deep">
        {player}
      </div>
    </PortraitStage>
  );
}
