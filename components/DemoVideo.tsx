const DEFAULT_DEMO_VIDEO_URL = "https://www.youtube.com/watch?v=Fc7XWW_Ehb8";

function toYouTubeEmbedUrl(value: string | undefined) {
  const candidate = (value || DEFAULT_DEMO_VIDEO_URL).trim();
  if (!candidate) return null;

  // Be forgiving if an environment variable was pasted with markdown-style
  // brackets/parentheses instead of a plain URL.
  const raw = candidate
    .replace(/^\[|\]$/g, "")
    .replace(/^\(|\)$/g, "")
    .replace(/^\[[^\]]+\]\((https?:\/\/[^)]+)\)$/, "$1")
    .trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    let videoId = "";

    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.replace(/^\//, "").split("/")[0];
    } else if (url.hostname.includes("youtube.com")) {
      videoId = url.searchParams.get("v") || "";
      if (!videoId && url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/")[2] || "";
      }
      if (!videoId && url.pathname.startsWith("/shorts/")) {
        videoId = url.pathname.split("/")[2] || "";
      }
    }

    if (!videoId) return null;
    return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1&playsinline=1`;
  } catch {
    return null;
  }
}

export function DemoVideo() {
  const embedUrl = toYouTubeEmbedUrl(process.env.NEXT_PUBLIC_DEMO_VIDEO_URL);

  return (
    <section className="section demo-section" aria-labelledby="demo-video-title">
      <div className="container demo-grid">
        <div className="demo-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> See Meeting Automator in action</span>
          <h2 id="demo-video-title" className="h2" style={{ marginTop: 18 }}>
            See the meeting flow before you book.
          </h2>
          <p>
            Watch a short walkthrough of how a prospect moves from availability to booking,
            approval, calendar scheduling and the final Google Meet experience — without your
            manager manually coordinating every step.
          </p>
          <div className="demo-points">
            <div><span>01</span> Guest chooses a suitable time</div>
            <div><span>02</span> Your configured workflow handles the booking</div>
            <div><span>03</span> Confirmation and Google Meet follow automatically</div>
          </div>
        </div>

        <div className="demo-video-card">
          {embedUrl ? (
            <div className="demo-video-frame">
              <iframe
                src={embedUrl}
                title="Meeting Automator demo video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="demo-video-placeholder">
              <div className="demo-play">▶</div>
              <strong>Demo video coming soon</strong>
              <span>Add NEXT_PUBLIC_DEMO_VIDEO_URL to your environment.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
