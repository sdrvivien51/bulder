import React from 'react';

interface ToolReviewVideoProps {
  videoUrl: string;
}

const ToolReviewVideo: React.FC<ToolReviewVideoProps> = ({ videoUrl }) => {
  // Transform the URL into an embed URL if necessary
  const embedUrl = videoUrl.replace('watch?v=', 'embed/');

  return (
    <div className="video-container" style={{ borderRadius: '8px', overflow: 'hidden' }}>
      <iframe
        width="560"
        height="315"
        src={embedUrl}
        title="Video Review"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default ToolReviewVideo;
