import React from "react";

interface ExplainerVideoProps {
  videoSrc: string;
  title: string;
}

const ExplainerVideo: React.FC<ExplainerVideoProps> = ({ videoSrc, title }) => {
  return (
    <div className="mt-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="aspect-w-16 aspect-h-9">
        <video
          className="w-full h-full rounded-lg shadow-lg border-2 border-gray-300"
          controls
          autoPlay
          muted
          loop
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default ExplainerVideo;
